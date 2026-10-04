import type { Request, Response } from 'express';
import type { AuthRequest } from '../middleware/authMiddleware';
import db from '../database';
import cloudinary from '../config/cloudinary';

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

export async function updateProfileImage(req: AuthRequest, res: Response) {
  try {
    const userId = req.user?.id;

    if (!req.file) {
      return res.status(400).json({
        message: 'File gambar wajib diupload',
      });
    }

    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'school-management/profiles',
      resource_type: 'image',
    });

    const imageUrl = result.secure_url;

    await db.query('UPDATE users SET profile_image = ? WHERE id = ?', [imageUrl, userId]);

    res.status(200).json({
      message: 'Foto profile berhasil diperbarui',
      profile_image: imageUrl,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memperbarui foto profile',
    });
  }
}