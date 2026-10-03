import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware';
import db from '../database';

export async function getUsers(_req: Request, res: Response) {
  try {
    const [rows] = await db.query('SELECT * FROM users');

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data users',
    });
  }
}

export function testTeacherAccess(req: AuthRequest, res: Response) {
  res.status(200).json({
    message: 'Akses teacher berhasil',
    user: {
      id: req.user?.id,
      role: req.user?.role,
    },
  });
}

// GET /users/me - kembalikan id dan role dari token (tanpa query database)
export function getMe(req: AuthRequest, res: Response) {
  res.status(200).json({
    message: 'Token valid',
    user: req.user,
  });
}