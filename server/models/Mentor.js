import mongoose from 'mongoose';

const mentorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Mentor name is required'],
            trim: true,
        },
        counselingType: {
            type: String,
            required: [true, 'Counseling type is required'],
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

export default mongoose.model('Mentor', mentorSchema);
