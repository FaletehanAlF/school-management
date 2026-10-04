import express from 'express';
import { getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../controllers/announcementController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authorizeRole } from '../middleware/roleMiddleware';
import upload from '../middleware/uploadMiddleware';

const router = express.Router();

router.get('/', getAnnouncements);
router.get('/:id', getAnnouncementById);

router.post('/', authMiddleware, authorizeRole('teacher'), upload.single('image'), createAnnouncement);

router.put('/:id', authMiddleware, authorizeRole('teacher'), updateAnnouncement);

router.delete('/:id', authMiddleware, authorizeRole('teacher'), deleteAnnouncement);

export default router;
