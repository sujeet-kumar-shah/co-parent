import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Area name is required'],
            unique: true,
            trim: true,
            minlength: [2, 'Area name must be at least 2 characters'],
        },
    },
    { timestamps: true }
);

export default mongoose.model('Area', areaSchema);
