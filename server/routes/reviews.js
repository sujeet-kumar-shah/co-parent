import express from 'express';
import Review from '../models/Review.js';
import Listing from '../models/Listing.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a new review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { listingId, rating, comment } = req.body;
        const userId = req.user._id;

        // Check if user already reviewed this listing
        const existingReview = await Review.findOne({ listing: listingId, user: userId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this listing' });
        }

        const review = new Review({
            listing: listingId,
            user: userId,
            rating: Number(rating),
            comment,
        });

        const savedReview = await review.save();

        // Update Listing rating and review count
        const reviews = await Review.find({ listing: listingId });
        const numReviews = reviews.length;
        const avgRating = reviews.reduce((acc, item) => item.rating + acc, 0) / numReviews;

        await Listing.findByIdAndUpdate(listingId, {
            rating: avgRating.toFixed(1),
            reviews: numReviews,
        });

        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get reviews for a listing
// @route   GET /api/reviews/listing/:listingId
// @access  Public
router.get('/listing/:listingId', async (req, res) => {
    try {
        const reviews = await Review.find({ listing: req.params.listingId })
            .populate('user', 'name profileImage')
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
