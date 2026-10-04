import express from 'express';
import { getSchedules, getScheduleById, createSchedule, updateSchedule } from '../controllers/scheduleController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';

const router = express.Router();

router.get('/', getSchedules);
router.get('/:id', getScheduleById);

router.post('/', authMiddleware, authorizeRole('teacher'), createSchedule);

router.put('/:id', authMiddleware, authorizeRole('teacher'), updateSchedule);

export default router;
