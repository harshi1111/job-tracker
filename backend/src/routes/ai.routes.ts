import express from 'express';
import { 
  parseJobDescription, 
  generateResumeSuggestions,
  parseJobDescriptionStream,
  generateResumeSuggestionsStream
} from '../controllers/ai.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.use(authenticate);

// Regular (non-streaming) routes
router.post('/parse-job', parseJobDescription);
router.post('/resume-suggestions', generateResumeSuggestions);

// Streaming routes
router.post('/parse-job-stream', parseJobDescriptionStream);
router.post('/resume-suggestions-stream', generateResumeSuggestionsStream);

export default router;