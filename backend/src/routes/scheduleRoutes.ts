import express from 'express';
import { getSchedules } from '../controllers/scheduleController';

const router = express.Router();

router.get('/', getSchedules);

export default router;
