import mongoose from 'mongoose';

const ListingQuerySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: false,
        },
        listingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            default: '',
        },
        phone: {
            type: String,
            required: false,
            trim: true,
            default: '',
        },
        message: {
            type: String,
            required: false,
            default: '',
        },
        status: {
            type: String,
            require: true,
            default: 'pending',
        },

    },
    { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

const ListingQuery = mongoose.model('ListingQuery', ListingQuerySchema);

export default ListingQuery;