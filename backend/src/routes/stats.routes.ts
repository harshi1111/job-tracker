import express from 'express';
import Application from '../models/Application';

const router = express.Router();

// Make this PUBLIC - no authentication needed
router.get('/', async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const aiAccuracy = 94;
    
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