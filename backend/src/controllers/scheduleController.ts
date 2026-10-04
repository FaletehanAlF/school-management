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
