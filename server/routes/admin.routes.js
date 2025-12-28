import express from 'express';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// @desc    Get Admin Dashboard Stats
// @route   GET /api/admin/stats
// @access  Private/Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ type: 'student' });
        const totalVendors = await User.countDocuments({ type: 'vendor' });
        const activeListings = await Listing.countDocuments({ status: 'approved' });
        const pendingApprovals = await Listing.countDocuments({ status: 'submitted' });

        res.json({
            totalStudents,
            totalVendors,
            activeListings,
            pendingApprovals
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Listings with filter
// @route   GET /api/admin/listings
// @access  Private/Admin
router.get('/listings', protect, admin, async (req, res) => {
    try {
        const { status } = req.query;
        let query = {};
        if (status) {
            query.status = status;
        }

        const listings = await Listing.find(query)
            .populate('vendor', 'name email businessName')
            .sort({ createdAt: -1 });

        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update Listing Status
// @route   PUT /api/admin/listings/:id/status
// @access  Private/Admin
router.put('/listings/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body; // approved, rejected
        const listing = await Listing.findById(req.params.id);

        if (listing) {
            listing.status = status;
            const updatedListing = await listing.save();
            res.json(updatedListing);
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get Users by type
// @route   GET /api/admin/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const { type } = req.query; // student, vendor
        let query = {};
        if (type) {
            query.type = type;
        } else {
            query.type = { $ne: 'admin' };
        }

        const users = await User.find(query).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update User Status (Suspend/Activate)
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
router.put('/users/:id/status', protect, admin, async (req, res) => {
    try {
        const { isActive } = req.body;
        const user = await User.findById(req.params.id);

        if (user) {
            user.isActive = isActive;
            const updatedUser = await user.save();
            res.json({ _id: updatedUser._id, isActive: updatedUser.isActive, message: `User ${isActive ? 'activated' : 'suspended'}` });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Seed Admin User
// @route   POST /api/admin/seed
// @access  Public (Run once then remove or protect)
router.post('/seed', async (req, res) => {
    try {
        const adminExists = await User.findOne({ type: 'admin' });
        if (adminExists) {
            return res.status(400).json({ message: 'Admin already exists' });
        }

        const adminUser = await User.create({
            name: 'Super Admin',
            email: 'admin@coparents.com',
            password: 'adminpassword123',
            type: 'admin',
            phone: '0000000000'
        });

        res.status(201).json({
            _id: adminUser._id,
            name: adminUser.name,
            email: adminUser.email,
            type: adminUser.type,
            token: null // No token needed for seed
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
