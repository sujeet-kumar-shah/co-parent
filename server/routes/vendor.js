import express from 'express';
import Listing from '../models/Listing.js';
import Lead from '../models/Lead.js';
import { protect } from '../middleware/authMiddleware.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Ensure the 'uploads' directory exists
        const uploadPath = path.join(__dirname, '..', 'uploads');
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        // Generate a unique filename (e.g., timestamp-originalName)
        cb(null, Date.now() + '-' + file.originalname);
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 70 * 1024 * 1024 // 70 MB in bytes
    }
});


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

        const listings = await Listing.find({ vendor: req.user._id }).populate('location', 'name').sort({ createdAt: -1 });
        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a listing
// @route   PUT /api/vendor/listings/:id
// @access  Private (Vendor only)
router.put('/listings/:id', protect, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]), async (req, res) => {
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
            street,
            price,
            videos,
            features,
            amenities,
            gender,
            status,
            nearbyCoaching,
            coachingDistance
        } = req.body;

        const image = req.files?.image?.[0]?.filename || null;
        let images = req.files?.images?.map(f => f.filename) || [];

        // Helper to parse array fields
        const parseArrayField = (val) => {
            if (!val) return [];
            if (Array.isArray(val)) return val;
            if (typeof val === 'string') {
                try {
                    const parsed = JSON.parse(val);
                    if (Array.isArray(parsed)) return parsed;
                } catch (e) {
                    // fallback to comma-separated
                    return val.split(',').map(s => s.trim()).filter(Boolean);
                }
            }
            return [];
        };

        // Append new images to existing ones if handled that way, or replace. 
        // For now, let's say if new images are uploaded, they append. 

        if (image) listing.image = image;
        if (images.length > 0) {
            // If we want to replace: 
            listing.images = images;
        }


        listing.title = title || listing.title;
        listing.description = description || listing.description;
        listing.category = category || listing.category;
        listing.location = location || listing.location;
        listing.city = city || listing.city;
        listing.street = street || listing.street;
        listing.price = price || listing.price;
        // listing.image = image || listing.image; // Handled above
        // listing.images = images || listing.images; // Handled above
        listing.videos = parseArrayField(videos) || listing.videos;
        listing.features = features || listing.features;
        listing.amenities = parseArrayField(amenities) || listing.amenities;
        listing.gender = gender || listing.gender;
        listing.status = status || listing.status;
        listing.nearbyCoaching = nearbyCoaching || listing.nearbyCoaching;
        listing.coachingDistance = coachingDistance || listing.coachingDistance;

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

        // if (listing.vendor.toString() !== req.user._id.toString()) {
        //     return res.status(403).json({ message: 'Not authorized to delete this listing' });
        // }

        await listing.deleteOne();
        res.json({ message: 'Listing removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
