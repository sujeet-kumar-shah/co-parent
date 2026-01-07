
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import twilio from 'twilio'
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';
import Otp from '../models/Otp.js'

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
)

function generateOtp(){
    return Math.floor(1000 + Math.random() * 9000);
}
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, phone, type, businessName } = req.body;

    try {
        const userExists = await User.findOne({ phone });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone,
            type,
            businessName,
        });
        try {
            const otp = generateOtp();
            await client.messages.create({
                body: `Your OTP code is: ${otp}`,
                from: process.env.TWILLIO_NUMBER,
                to: `+91${phone}`
            });
            await Otp.create({
                userId: user._id,
                phone: user.phone,
                otp,
                purpose: 'signup',
                expiresAt: new Date(Date.now() + 5 * 60 * 1000)
            });
        } catch (error) {
            console.error('Twilio error:', error);
            return res.status(400).json({ message: 'Failed to send OTP' });
        }
        if (user) {
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                type: user.type,
                phone: user.phone,
                businessName: user.businessName,
                otpVerification:"otp",
                success:"success"
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { phone, password } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (user && (await user.matchPassword(password)) && user.isActive === true) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                profileImage: user.profileImage,
                type: user.type,
                phone: user.phone,
                businessName: user.businessName,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid phone or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
    res.json({
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        type: req.user.type,
        businessName: req.user.businessName,
        profileImage : req.user.profileImage
    });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.profileImage = req.body.profileImage || user.profileImage;
        if (req.body.password) {
            user.password = req.body.password;
        }
        if (user.type === 'vendor' && req.body.businessName) {
            user.businessName = req.body.businessName;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            profileImage: updatedUser.profileImage,
            phone: updatedUser.phone,
            type: updatedUser.type,
            businessName: updatedUser.businessName,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.post('/forget', async (req, res) => {
    const { phone } = req.body;
console.log(phone);
            return;
    try {
        const user = await User.findOne({ phone });

        if (user && user.isActive === true) {
            
            try {
                const otp = generateOtp();
                await client.messages.create({
                    body: `Your OTP code is: ${otp}`,
                    from: process.env.TWILLIO_NUMBER,
                    to: `+91${phone}`
                });
                await Otp.create({
                    userId: user._id,
                    phone: user.phone,
                    otp,
                    purpose: 'signup',
                    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
                });
            } catch (error) {
                console.error('Twilio error:', error);
                return res.status(400).json({ message: 'Failed to send OTP' });
            }
        } else {
            res.status(401).json({ message: 'Invalid phone number' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.post('/otp',async (req,res) =>{
     const { phone } = req.body;

    try {
        const user = await User.findOne({ phone });

        if (user && user.isActive === true) {
            var min = 1000;
            var max = 9999;
            var rand =  min + (Math.random() * (max-min));
            res.json({
                rand
            });
        } else {
            res.status(401).json({ message: 'Invalid phone' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message }); 
    }
})

router.post('/verify-otp', async (req, res) => {
  const { phone, otp } = req.body;

  try {
    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(401).json({ message: 'Invalid phone' });
    }

    if (user.isActive) {
      return res.status(400).json({ message: 'User already verified' });
    }

    const userOtp = await Otp.findOne({ userId: user._id }).sort({ createdAt: -1 });

    if (!userOtp) {
      return res.status(400).json({ message: 'OTP not found' });
    }

    // Check OTP match and expiry
    if (userOtp.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (userOtp.expiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired' });
    }

    // Update user as active
    const userUpdate = await User.findByIdAndUpdate(
      user._id,
      { isActive: true },
      { new: true, runValidators: true }
    );

    return res.json({
      message: 'OTP verified successfully',
      user: userUpdate,
      token: generateToken(userUpdate._id),
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
