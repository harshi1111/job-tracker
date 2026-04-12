import express from 'express';
import {
  uploadResume,
  getUserResumes,
  deleteResume,
  updateResumeTitle,
} from '../controllers/resume.controller';
import { authenticate } from '../middleware/auth';
import multer from 'multer';

const router = express.Router();

// Configure multer for memory storage (we'll send to cloudinary or MongoDB)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req: any, file: any, cb: any) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed'), false);
    }
  },
});

// All routes require authentication
router.use(authenticate);

// Routes
router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getUserResumes);
router.put('/:id', updateResumeTitle);
router.delete('/:id', deleteResume);

export default router;