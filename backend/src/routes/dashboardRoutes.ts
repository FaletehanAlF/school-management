import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/summary', authMiddleware, getDashboardSummary);

export default router;
