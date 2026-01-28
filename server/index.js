
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Allow larger JSON bodies to support base64 image uploads from client
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());
// CORS Configuration - Updated for production deployment
app.use(cors({
    origin: [
        // Production URLs
        'http://68.183.85.8:3000',           // Frontend on port 3000
        'http://68.183.85.8',                 // Direct IP access
        process.env.FRONTEND_URL,             // From environment variable
        // Development URLs
        'http://localhost:5173',              // Vite default
        'http://localhost:8080',              // Alternative port
        'http://localhost:3000'               // Frontend build preview
    ].filter(Boolean), // Remove undefined/null values
    credentials: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/co-parents')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import vendorRoutes from './routes/vendor.js';
import adminRoutes from './routes/admin.routes.js';
import queryRoutes from './routes/queryRoutes.js';
import areasRoutes from './routes/areas.js';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/vendor', vendorRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/query', queryRoutes);
app.use('/api/areas', areasRoutes);

// Serve uploaded files (images) statically
// const __dirname = path.resolve(); // Removed in favor of top-level declaration

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
