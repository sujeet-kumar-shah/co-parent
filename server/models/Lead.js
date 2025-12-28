import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
    },
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    message: {
        type: String,
    },
    status: {
        type: String,
        enum: ['new', 'contacted', 'converted', 'closed'],
        default: 'new',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
