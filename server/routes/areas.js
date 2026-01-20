import express from 'express';
import Area from '../models/Area.js';

import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';
const router = express.Router();

// GET all areas
router.get('/', async (req, res) => {
    try {
        const areas = await Area.find().sort({ createdAt: -1 });
        res.json(areas);
    } catch (error) {
        console.error('Error fetching areas:', error);
        res.status(500).json({ error: 'Failed to fetch areas' });
    }
});

// POST - Create new area (admin only)
router.post('/', async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({ error: 'Area name is required' });
        }

        // Check if area already exists
        const existingArea = await Area.findOne({ name: name.trim() });
        if (existingArea) {
            return res.status(400).json({ error: 'Area already exists' });
        }

        const newArea = new Area({ name: name.trim() });
        await newArea.save();

        res.status(201).json(newArea);
    } catch (error) {
        console.error('Error creating area:', error);
        res.status(500).json({ error: 'Failed to create area' });
    }
});

// DELETE - Remove area (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const area = await Area.findByIdAndDelete(req.params.id);

        if (!area) {
            return res.status(404).json({ error: 'Area not found' });
        }

        res.json({ message: 'Area deleted successfully', area });
    } catch (error) {
        console.error('Error deleting area:', error);
        res.status(500).json({ error: 'Failed to delete area' });
    }
});

export default router;
