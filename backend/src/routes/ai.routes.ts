import express from 'express';
import { parseJobDescription, generateResumeSuggestions } from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

router.post('/parse-job', parseJobDescription);
router.post('/resume-suggestions', generateResumeSuggestions);

export default router;