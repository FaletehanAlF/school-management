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

// GET /users/me - ambil profile user yang sedang login dari database
export async function getMe(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    const [rows]: any = await db.query(
      'SELECT id, name, email, role, profile_image, created_at FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'User tidak ditemukan',
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil profile user',
    });
  }
}