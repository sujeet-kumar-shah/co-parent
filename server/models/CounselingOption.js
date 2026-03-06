import mongoose from 'mongoose';

const counselingOptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Option name is required (e.g. JEE)'],
            unique: true,
            trim: true,
        },
        value: {
            type: String,
            required: [true, 'Option value is required (e.g. jee)'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model('CounselingOption', counselingOptionSchema);
