import mongoose from 'mongoose';

const schoolSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'School name is required'],
            trim: true,
        },
        board: {
            type: String, // e.g., CBSE, ICSE, State Board
            required: [true, 'Board type is required'],
            trim: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
        },
        imageUrl: {
            type: String,
            default: '',
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('School', schoolSchema);
