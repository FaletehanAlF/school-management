import type { Request, Response } from 'express';
import db from '../database';

export async function getSchedules(_req: Request, res: Response) {
  try {
    const [rows] = await db.query('SELECT * FROM schedules');

    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil data jadwal',
    });
  }
}

export async function getScheduleById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const [rows]: any = await db.query(
      'SELECT * FROM schedules WHERE id = ?',
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: 'Jadwal tidak ditemukan',
      });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil detail jadwal',
    });
  }
}

export async function createSchedule(req: Request, res: Response) {
  try {
    const { class_name, subject, teacher, day, start_time, end_time } = req.body;

    if (!class_name || !subject || !teacher || !day || !start_time || !end_time) {
      return res.status(400).json({
        message: 'Semua field jadwal wajib diisi',
      });
    }

    const [result]: any = await db.query(
      'INSERT INTO schedules (class_name, subject, teacher, day, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?)',
      [class_name, subject, teacher, day, start_time, end_time]
    );

    res.status(201).json({
      message: 'Jadwal berhasil dibuat',
      id: result.insertId,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal membuat jadwal',
    });
  }
}

export async function updateSchedule(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { class_name, subject, teacher, day, start_time, end_time } = req.body;

    if (!class_name || !subject || !teacher || !day || !start_time || !end_time) {
      return res.status(400).json({
        message: 'Semua field jadwal wajib diisi',
      });
    }

    const [existing]: any = await db.query(
      'SELECT id FROM schedules WHERE id = ?',
      [id]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        message: 'Jadwal tidak ditemukan',
      });
    }

    await db.query(
      'UPDATE schedules SET class_name = ?, subject = ?, teacher = ?, day = ?, start_time = ?, end_time = ? WHERE id = ?',
      [class_name, subject, teacher, day, start_time, end_time, id]
    );

    res.status(200).json({
      message: 'Jadwal berhasil diperbarui',
      id: Number(id),
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal memperbarui jadwal',
    });
  }
}
