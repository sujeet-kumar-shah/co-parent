import express from 'express';
import Listing from '../models/Listing.js';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get vendor dashboard stats
// @route   GET /api/vendor/stats
// @access  Private (Vendor only)
router.get('/stats', protect, async (req, res) => {
    try {
        if (req.user.type !== 'vendor') {
            return res.status(403).json({ message: 'Not authorized as vendor' });
        }

        const vendorId = req.user._id;

        // Get all listings for this vendor
        const listings = await Listing.find({ vendor: vendorId });

        const totalListings = listings.length;
        const activeListings = listings.filter(l => l.status === 'approved').length; // Assuming 'approved' is 'active' for stats
        const totalViews = listings.reduce((acc, curr) => acc + (curr.views || 0), 0);

        // Get leads count
        const totalLeads = await Lead.countDocuments({ vendor: vendorId });

        // Calculate conversion rate
        const conversionRate = totalViews > 0 ? ((totalLeads / totalViews) * 100).toFixed(1) : 0;

        res.json({
            stats: {
                totalLeads,
                views: totalViews,
                conversion: conversionRate,
                activeListings,
                totalListings
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get vendor listings (including drafts, etc)
// @route   GET /api/vendor/listings
// @access  Private (Vendor only)
router.get('/listings', protect, async (req, res) => {
    try {
        if (req.user.type !== 'vendor') {
            return res.status(403).json({ message: 'Not authorized as vendor' });
        }

        const listings = await Listing.find({ vendor: req.user._id }).sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a listing
// @route   PUT /api/vendor/listings/:id
// @access  Private (Vendor only)
router.put('/listings/:id', protect, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        // Verify ownership
        if (listing.vendor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this listing' });
        }

        const {
            title,
            description,
            category,
            location,
            city,
            address,
            price,
            image,
            images,
            videos,
            features,
            amenities,
            gender,
            status
        } = req.body;

        listing.title = title || listing.title;
        listing.description = description || listing.description;
        listing.category = category || listing.category;
        listing.location = location || listing.location;
        listing.city = city || listing.city;
        listing.address = address || listing.address;
        listing.price = price || listing.price;
        listing.image = image || listing.image;
        listing.images = images || listing.images;
        listing.videos = videos || listing.videos;
        listing.features = features || listing.features;
        listing.amenities = amenities || listing.amenities;
        listing.gender = gender || listing.gender;
        listing.status = status || listing.status;

        const updatedListing = await listing.save();
        res.json(updatedListing);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a listing
// @route   DELETE /api/vendor/listings/:id
// @access  Private (Vendor only)
router.delete('/listings/:id', protect, async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        if (listing.vendor.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this listing' });
        }

        await listing.deleteOne();
        res.json({ message: 'Listing removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
