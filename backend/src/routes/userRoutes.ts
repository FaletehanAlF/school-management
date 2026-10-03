import express from 'express';
import { getUsers, getMe, testTeacherAccess } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';

const router = express.Router();

// GET /users/me - harus lewat authMiddleware dulu
router.get('/me', authMiddleware, getMe);

// GET /users/teacher-area - hanya untuk role teacher
router.get('/teacher-area', authMiddleware, authorizeRole('teacher'), testTeacherAccess);

router.get('/', getUsers);

export default router;