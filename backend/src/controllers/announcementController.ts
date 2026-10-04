import type { Request, Response } from 'express';
import db from '../database';
import cloudinary from '../config/cloudinary';

export async function getAnnouncements(_req: Request, res: Response) {
  try {
    const [rows] = await db.query('SELECT * FROM announcements');

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data pengumuman',
    });
  }
}

export async function createAnnouncement(req: Request, res: Response) {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: 'Title dan content wajib diisi',
      });
    }

    let coverUrl = null;

    if (req.file) {
      const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'school-management/announcements',
        resource_type: 'image',
      });

      coverUrl = result.secure_url;
    }

    const [result]: any = await db.query(
      'INSERT INTO announcements (title, content, cover_url) VALUES (?, ?, ?)',
      [title, content, coverUrl]
    );

    res.status(201).json({
      message: 'Pengumuman berhasil dibuat',
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal membuat pengumuman',
    });
  }
}

export async function updateAnnouncement(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, content, cover_url } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: 'Title dan content wajib diisi',
      });
    }

    const [existing]: any = await db.query(
      'SELECT id FROM announcements WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: 'Pengumuman tidak ditemukan',
      });
    }

    await db.query(
      'UPDATE announcements SET title = ?, content = ?, cover_url = ? WHERE id = ?',
      [title, content, cover_url || null, id]
    );

    res.status(200).json({
      message: 'Pengumuman berhasil diperbarui',
      id: Number(id),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memperbarui pengumuman',
    });
  }
}

export async function deleteAnnouncement(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [existing]: any = await db.query(
      'SELECT id FROM announcements WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: 'Pengumuman tidak ditemukan',
      });
    }

    await db.query('DELETE FROM announcements WHERE id = ?', [id]);

    res.status(200).json({
      message: 'Pengumuman berhasil dihapus',
      id: Number(id),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal menghapus pengumuman',
    });
  }
}

export async function getAnnouncementById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [rows]: any = await db.query(
      'SELECT * FROM announcements WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Pengumuman tidak ditemukan',
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil detail pengumuman',
    });
  }
}
