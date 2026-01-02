
import express from 'express';
import Listing from '../models/Listing.js';
import { protect } from '../middleware/authMiddleware.js';
import  multer from 'multer';
import Liked from '../models/liked.js';

const router = express.Router();

// @desc    Get all listings
// @route   GET /api/listings
// @access  Public

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            // Ensure the 'uploads' directory exists
            cb(null, './uploads/'); 
        },
        filename: function (req, file, cb) {
            // Generate a unique filename (e.g., timestamp-originalName)
            cb(null, Date.now() + '-' + file.originalname);
        }   
    })
    const upload = multer({ storage: storage });
router.get('/', async (req, res) => {
    try {
        const { category, city, search, minPrice, maxPrice, sort } = req.query;

        let query = {};

        if (category && category !== 'all') {
            query.category = category;
        }

        if (city && city !== 'All Cities') {
            query.city = city;
        }

        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { location: { $regex: search, $options: 'i' } },
            ];
        }

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        let listingsQuery = Listing.find(query);

        if (sort) {
            if (sort === 'rating') listingsQuery = listingsQuery.sort({ rating: -1 });
            if (sort === 'price-low') listingsQuery = listingsQuery.sort({ price: 1 });
            if (sort === 'price-high') listingsQuery = listingsQuery.sort({ price: -1 });
            if (sort === 'reviews') listingsQuery = listingsQuery.sort({ reviews: -1 });
        }

        const listings = await listingsQuery;

        res.json(listings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single listing
// @route   GET /api/listings/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate('vendor', 'name email');
        const likedStatus = await Liked.findOne({listingId:req.params.id})
        if (listing) {
            console.log(likedStatus);
            res.json({listing,likedStatus});
        } else {
            res.status(404).json({ message: 'Listing not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a listing
// @desc    Create a listing
// @route   POST /api/listings
// @access  Private (Vendor only)
router.post('/', protect,upload.fields([{ name: 'image', maxCount: 1 },{ name: 'images', maxCount: 5 }]), async (req, res) => {
    try {
        if (req.user.type !== 'vendor') {
            return res.status(403).json({ message: 'Only vendors can create listings' });
        }

        const {
            title,
            description,
            category,
            location,
            city,
            address,
            price,
            videos,
            features,
            amenities,
            gender,
            status
        } = req.body;
    //   // parse possible JSON-encoded arrays from multipart/form-data
    //   const parseArrayField = (val) => {
    //       if (!val) return [];
    //       if (Array.isArray(val)) return val;
    //       if (typeof val === 'string') {
    //           try {
    //               const parsed = JSON.parse(val);
    //               if (Array.isArray(parsed)) return parsed;
    //           } catch (e) {
    //               // fallback to comma-separated
    //               return val.split(',').map(s => s.trim()).filter(Boolean);
    //           }
    //       }
    //       return [];
    //   };

    //   const parsedVideos = parseArrayField(videos);
    //   const parsedAmenities = parseArrayField(amenities);

      const image = req.files?.image?.[0]?.filename || null;
      const images = req.files?.images?.map(f => f.filename) || [];
        
        const listing = new Listing({
            vendor: req.user._id,
            title,
            description,
            category,
            location,
            city,
            address,
            price,
            image,
            images,
            videos,
            features,
            amenities,
            gender,
            status: status || 'draft'
        });

        const createdListing = await listing.save();
        res.status(201).json(createdListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/like', async (req, res) => {
    try {
        const propertyId = req.body.propertyId;
        const userId = req.body.userId;
        const status = !req.body.liked;

        if (!propertyId) {
            return res.status(400).json({ message: 'propertyId is required' });
        }

        // Upsert like record
        let record = await Liked.findOne({ listingId: propertyId, userId });
        if (record) {
            record.status = status;
            await record.save();
        } else {
            record = await Liked.create({ listingId: propertyId, userId, status });
        }

        res.json({ success: true, liked: record.status });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// @desc    Seed initial data (For demo purposes)
// @route   POST /api/listings/seed
// @access  Public (Should be private in prod)
router.post('/seed', async (req, res) => {
    try {
        await Listing.deleteMany({});

        // We need a dummy user ID to assign as vendor
        const User = (await import('../models/User.js')).default;
        let dummyUser = await User.findOne({});
        if (!dummyUser) {
            dummyUser = await User.create({
                name: "Demo Vendor",
                email: "vendor@demo.com",
                password: "password123", // Will be hashed by pre-save hook
                type: "vendor",
                phone: "1234567890",
                businessName: "Demo Business"
            });
        }

        const sampleListings = [
            {
                title: "Sunrise Boys Hostel",
                category: "hostel",
                location: "Kothrud, Pune",
                city: "Pune",
                price: 8500,
                rating: 4.8,
                reviews: 124,
                image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop",
                features: ["AC Rooms", "WiFi", "Gym"],
                gender: "boys",
                vendor: dummyUser._id
            },
            {
                title: "Shree Krishna PG",
                category: "pg",
                location: "Koramangala, Bangalore",
                city: "Bangalore",
                price: 12000,
                rating: 4.6,
                reviews: 89,
                image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop",
                features: ["Single Rooms", "Meals", "Laundry"],
                gender: "unisex",
                vendor: dummyUser._id
            },
            {
                title: "Apex IIT-JEE Coaching",
                category: "coaching",
                location: "Kalu Sarai, Delhi",
                city: "Delhi",
                price: 45000,
                rating: 4.9,
                reviews: 312,
                image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=400&fit=crop",
                features: ["Expert Faculty", "Study Material", "Mock Tests"],
                gender: "unisex",
                vendor: dummyUser._id
            },
            {
                title: "Quiet Study Library",
                category: "library",
                location: "Civil Lines, Jaipur",
                city: "Jaipur",
                price: 1500,
                rating: 4.7,
                reviews: 67,
                image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&h=400&fit=crop",
                features: ["24/7 Access", "AC", "Locker"],
                gender: "unisex",
                vendor: dummyUser._id
            },
        ];

        await Listing.insertMany(sampleListings);
        res.json({ message: 'Data seeded!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
