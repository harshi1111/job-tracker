import express from 'express';
import { authenticate } from '../middleware/auth';
import { updatePassword, deleteAccount } from '../controllers/user.controller';

const router = express.Router();

router.use(authenticate);

router.put('/password', updatePassword);
router.delete('/account', deleteAccount);

export default router;