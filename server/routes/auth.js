
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import twilio from 'twilio';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Otp from '../models/Otp.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Initialize Twilio client only when credentials exist
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    try {
        twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    } catch (err) {
        console.error('Failed to initialize Twilio client', err);
        twilioClient = null;
    }
} else {
    console.warn('Twilio credentials not configured; SMS will be skipped');
}

async function sendOtpSms(toPhone, otp) {
    const from = process.env.TWILLIO_NUMBER;
    if (!twilioClient) {
        console.warn('Twilio not configured, skipping SMS for', toPhone, 'otp:', otp);
        return false;
    }

    try {
        await twilioClient.messages.create({ body: `Your CO-PARENTS OTP is: ${otp}`, from, to: toPhone });
        return true;
    } catch (err) {
        console.error('Twilio send error:', err);
        return false;
    }
}

function generateOtp() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

// @route POST /api/auth/register
// @desc  Register a new user (Auto-activate, no OTP for now)
router.post('/register', async (req, res) => {
    const { name, email, password, phone, type, businessName } = req.body;

    try {
        const existing = await User.findOne({ phone });
        if (existing) return res.status(400).json({ success: false, message: 'Phone already registered' });

        // Auto-activate user (isActive: true)
        const user = await User.create({ name, email, password, phone, type, businessName, isActive: true });

        // Generate token immediately
        const token = generateToken(user._id);

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                type: user.type,
                businessName: user.businessName,
                profileImage: user.profileImage
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route POST /api/auth/login
// @desc  Authenticate user and return token
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (user && (await user.matchPassword(password)) && user.isActive === true) {
            return res.json({ _id: user._id, name: user.name, email: user.email, profileImage: user.profileImage, type: user.type, phone: user.phone, businessName: user.businessName, token: generateToken(user._id) });
        }
        return res.status(401).json({ success: false, message: 'Invalid phone or password' });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route GET /api/auth/profile
// @desc  Get user profile
router.get('/profile', protect, async (req, res) => {
    const user = req.user;
    return res.json({ _id: user._id, name: user.name, email: user.email, phone: user.phone, type: user.type, businessName: user.businessName, profileImage: user.profileImage });
});

// @route PUT /api/auth/profile
// @desc  Update user profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.profileImage = req.body.profileImage || user.profileImage;
        if (req.body.password) user.password = req.body.password;
        if (user.type === 'vendor' && req.body.businessName) user.businessName = req.body.businessName;

        const updatedUser = await user.save();
        return res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, profileImage: updatedUser.profileImage, phone: updatedUser.phone, type: updatedUser.type, businessName: updatedUser.businessName, token: generateToken(updatedUser._id) });
    } catch (error) {
        console.error('Profile update error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route POST /api/auth/forget
// @desc  Create password reset OTP and send via SMS (non-fatal) - OTP BYPASSED
router.post('/forget', async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // OTP logic commented out to bypass OTP verification
        // const otp = generateOtp();
        // await Otp.create({ userId: user._id, phone: user.phone, otp, purpose: 'reset_password', expiresAt: new Date(Date.now() + 5 * 60 * 1000) });

        // const toPhone = user.phone.toString().startsWith('+') ? user.phone : `+91${user.phone}`;
        // const smsSent = await sendOtpSms(toPhone, otp);
        // if (!smsSent) console.warn('OTP created but SMS failed for', toPhone);

        return res.json({ success: true, message: 'OTP sent for password reset' });
    } catch (error) {
        console.error('Forget error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route POST /api/auth/verify-otp
// @desc  Verify OTP for signup or reset
router.post('/verify-otp', async (req, res) => {
    const { phone, otp, purpose = 'signup' } = req.body;
    const normalizedPurpose = purpose === 'reset' ? 'reset_password' : purpose;
    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        const userOtp = await Otp.findOne({ userId: user._id, purpose: normalizedPurpose }).sort({ createdAt: -1 });
        if (!userOtp) return res.status(400).json({ success: false, message: 'OTP not found' });
        if (userOtp.otp !== otp) return res.status(400).json({ success: false, message: 'Invalid OTP' });
        if (userOtp.expiresAt < new Date()) return res.status(400).json({ success: false, message: 'OTP expired' });

        // consume OTPs for this purpose
        await Otp.deleteMany({ userId: user._id, purpose: normalizedPurpose });

        if (normalizedPurpose === 'signup') {
            user.isActive = true;
            await user.save();
            return res.json({ success: true, message: 'OTP verified, user activated', user, token: generateToken(user._id) });
        }

        // For password reset, return a short-lived reset token so client can change password
        const resetToken = jwt.sign({ id: user._id, purpose: 'reset' }, process.env.JWT_SECRET, { expiresIn: '10m' });
        return res.json({ success: true, message: 'OTP verified for reset', userId: user._id, resetToken });
    } catch (error) {
        console.error('Verify OTP error:', error);
        return res.status(500).json({ success: false, message: error.message });
    }
});

// @route POST /api/auth/reset-password
// @desc  Reset password using phone (OTP bypassed)
router.post('/reset-password', async (req, res) => {
    const { phone, newPassword } = req.body;
    if (!phone || !newPassword) return res.status(400).json({ success: false, message: 'Missing phone or new password' });

    try {
        // OTP token verification commented out - using phone directly
        // const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
        // if (!decoded || decoded.purpose !== 'reset') return res.status(400).json({ success: false, message: 'Invalid reset token' });

        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        user.password = newPassword;
        await user.save();
        return res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
        console.error('Reset password error:', error);
        return res.status(400).json({ success: false, message: 'Could not reset password' });
    }
});

export default router;
