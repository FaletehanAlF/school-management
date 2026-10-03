import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './authMiddleware';

// Middleware authorization: cek apakah role user diizinkan
// Contoh: authorizeRole('teacher') atau authorizeRole('teacher', 'admin')
export function authorizeRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // 1. Pastikan user sudah lewat authentication (req.user harus ada)
    if (!req.user) {
      res.status(401).json({ message: 'User belum terautentikasi' });
      return;
    }

    // 2. Cek apakah role user termasuk yang diizinkan
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ message: 'Akses ditolak' });
      return;
    }

    // 3. Role sesuai, lanjut ke endpoint berikutnya
    next();
  };
}

export default authorizeRole;
