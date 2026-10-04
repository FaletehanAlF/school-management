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
