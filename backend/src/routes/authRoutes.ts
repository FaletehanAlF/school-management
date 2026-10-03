import express from 'express';
import { register, login } from '../controllers/authController';

const router = express.Router();

// POST /register -> dipanggil sebagai POST /auth/register karena dipasang di app.ts
router.post('/register', register);

// POST /login -> dipanggil sebagai POST /auth/login karena dipasang di app.ts
router.post('/login', login);

export default router;
