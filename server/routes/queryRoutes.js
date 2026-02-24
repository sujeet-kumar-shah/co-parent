import express from 'express';
import Counseling from '../models/Counseling.js';
import ListingQuery from '../models/ListingQuery.js';
import Feedback from '../models/Feedback.js';

const router = express.Router();

router.post('/counselingForm', async (req, res) => {
    const { name, contact_number, message, percentage, query_type, userId } = req.body
    const queryData = new Counseling({
        userId: userId,
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