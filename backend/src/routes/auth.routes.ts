import express from 'express';
import { register, login, setSecurityQuestion, initiatePasswordReset, verifySecurityAnswer } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/set-security-question', authenticate, setSecurityQuestion);
router.post('/initiate-reset', initiatePasswordReset);
router.post('/verify-answer', verifySecurityAnswer);

export default router;