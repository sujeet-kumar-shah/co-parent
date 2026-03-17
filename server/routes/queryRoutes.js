import express from 'express';
import Counseling from '../models/Counseling.js';
import ListingQuery from '../models/ListingQuery.js';
import Feedback from '../models/Feedback.js';
import User from '../models/User.js';
import Listing from '../models/Listing.js';
import CounselingOption from '../models/CounselingOption.js';
import Mentor from '../models/Mentor.js';
import School from '../models/School.js';

const router = express.Router();

// @desc    Get Active Mentors
// @route   GET /api/query/mentors
// @access  Public
router.get('/mentors', async (req, res) => {
    try {
        const mentors = await Mentor.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, data: mentors });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get Active Schools
// @route   GET /api/query/schools
// @access  Public
router.get('/schools', async (req, res) => {
    try {
        const schools = await School.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, data: schools });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get Active Counseling Options
// @route   GET /api/query/counseling-options
// @access  Public
router.get('/counseling-options', async (req, res) => {
    try {
        const options = await CounselingOption.find({ isActive: true });
        res.json({ success: true, data: options });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// @desc    Get Public Stats for Hero Section
// @route   GET /api/query/stats
// @access  Public
router.get('/stats', async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ type: 'student' });
        const totalVendors = await User.countDocuments({ type: 'vendor' });
        const activeListings = await Listing.countDocuments({ status: 'approved' });

        res.json({
            success: true,
            data: {
                students: totalStudents,
                vendors: totalVendors,
                listings: activeListings
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.post('/counselingForm', async (req, res) => {
    const { name, contact_number, message, percentage, query_type, userId, mentorId } = req.body
    const queryData = new Counseling({
        userId: userId || null,
        mentorId: mentorId || null,
        name: name,
        query_type: query_type,
        message: message,
        contact_number,
        percent: percentage,
    });

    const counselingQuery = await queryData.save();
    res.status(201).json(counselingQuery);

})
router.post('/status/:id', async (req, res) => {
    const { status } = req.body
    let queryData;

    queryData = await Counseling.findOneAndUpdate(
        { _id: req.params.id },
        { status: status },
        { new: true }   // returns updated document
    );


    res.status(200).json({
        success: true,
        data: queryData
    });
})

router.post('/listing', async (req, res) => {
    const { listingId, name, phone, message, userId } = req.body
    const queryData = new ListingQuery({
        userId: userId,
        name: name,
        phone: phone,
        message: message,
        listingId: listingId,
    });

    const listingQuery = await queryData.save();
    res.status(201).json(listingQuery);

})
router.post('/listing-status/:id', async (req, res) => {
    const { status } = req.body
    let queryData;

    queryData = await ListingQuery.findOneAndUpdate(
        { _id: req.params.id },
        { status: status },
        { new: true }   // returns updated document
    );


    res.status(200).json({
        success: true,
        data: queryData
    });
})

router.post('/feedback', async (req, res) => {
    try {
        const { name, rating, message } = req.body;
        const feedbackData = new Feedback({
            name,
            rating,
            message
        });

        const feedback = await feedbackData.save();
        res.status(201).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

router.get('/feedback', async (req, res) => {
    try {
        const feedback = await Feedback.find().sort({ created_at: -1 });
        res.status(200).json({
            success: true,
            data: feedback
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;