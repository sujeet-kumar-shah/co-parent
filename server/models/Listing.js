
import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
    vendor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['hostel', 'pg', 'coaching', 'library', 'mess', 'flat'],
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Area',
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true
    },
    nearbyCoaching: {
        type: String,
        default: ''
    },
    coachingDistance: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    reviews: {
        type: Number,
        default: 0,
    },
    image: {
        type: String, // Main thumbnail
        required: true,
    },
    images: {
        type: [String], // Gallery images
        default: [],
    },
    videos: {
        type: [String],
        default: [],
    },
    features: {
        type: [String],
        default: [],
    },
    amenities: {
        type: [String],
        default: [],
    },
    gender: {
        type: String,
        enum: ['boys', 'girls', 'unisex'],
        default: 'unisex',
    },
    status: {
        type: String,
        enum: ['draft', 'submitted', 'approved', 'rejected'],
        default: 'draft',
    },
    views: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
