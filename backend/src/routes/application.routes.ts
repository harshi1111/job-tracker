import express from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';
import { getApplications, createApplication, updateApplication, deleteApplication } from '../controllers/application.controller';

const router = express.Router();

console.log('🔥 APPLICATION ROUTES REGISTERED - POST / will use createApplication');

router.use(authenticate);

router.get('/', getApplications);
router.post('/', createApplication);
router.put('/:id', updateApplication);
router.delete('/:id', deleteApplication);

export default router;