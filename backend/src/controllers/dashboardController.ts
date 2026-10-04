import type { Request, Response } from 'express';
import db from '../database';

export async function getDashboardSummary(_req: Request, res: Response) {
  try {
    const [usersRows]: any = await db.query('SELECT COUNT(*) AS total FROM users');
    const [studentsRows]: any = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = 'student'"
    );
    const [teachersRows]: any = await db.query(
      "SELECT COUNT(*) AS total FROM users WHERE role = 'teacher'"
    );
    const [announcementsRows]: any = await db.query(
      'SELECT COUNT(*) AS total FROM announcements'
    );
    const [schedulesRows]: any = await db.query(
      'SELECT COUNT(*) AS total FROM schedules'
    );

    res.status(200).json({
      total_users: usersRows[0].total,
      total_students: studentsRows[0].total,
      total_teachers: teachersRows[0].total,
      total_announcements: announcementsRows[0].total,
      total_schedules: schedulesRows[0].total,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Gagal mengambil dashboard summary',
    });
  }
}
