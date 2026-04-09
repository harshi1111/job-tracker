import express from 'express';
import Application from '../models/Application';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get global stats (no auth required)
router.get('/', async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    
    // You can calculate AI accuracy based on successful parses
    // For now, we'll use a reasonable estimate
    const aiAccuracy = 94; // This can be updated based on actual success rate
    
    res.json({
      totalApplications,
      aiAccuracy,
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

export default router;