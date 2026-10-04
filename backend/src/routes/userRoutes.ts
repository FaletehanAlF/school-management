import express from 'express';
import { getUsers, getMe, testTeacherAccess, updateProfileImage } from '../controllers/userController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

// POST /users/me/profile-image - upload foto profile user yang login
router.post('/me/profile-image', authMiddleware, upload.single('image'), updateProfileImage);

// GET /users/me - harus lewat authMiddleware dulu
router.get('/me', authMiddleware, getMe);

// GET /users/teacher-area - hanya untuk role teacher
router.get('/teacher-area', authMiddleware, authorizeRole('teacher'), testTeacherAccess);

router.get('/', getUsers);

export default router;