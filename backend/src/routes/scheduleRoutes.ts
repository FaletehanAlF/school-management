import express from 'express';
import { getSchedules, getScheduleById } from '../controllers/scheduleController';

const router = express.Router();

router.get('/', getSchedules);
router.get('/:id', getScheduleById);

export default router;
