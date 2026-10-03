import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Tipe sederhana: Request + info user dari JWT
// Dipakai agar TypeScript tidak error saat menulis req.user
export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: string;
  };
}

// Middleware: cek JWT dari header Authorization
export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    // 1. Ambil header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      res.status(401).json({ message: 'Token tidak ditemukan' });
      return;
    }

    // 2. Format harus: Bearer <token>
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer' || !parts[1]) {
      res.status(401).json({ message: 'Format token salah' });
      return;
    }

    const token = parts[1];

    // 3. Ambil secret dari environment
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ message: 'JWT secret belum diatur' });
      return;
    }

    // 4. Verifikasi token (cek tanda tangan + expired)
    const payload = jwt.verify(token, jwtSecret) as { id: number; role: string };

    // 5. Simpan payload ke req agar endpoint berikutnya tahu id dan role
    req.user = { id: payload.id, role: payload.role };

    // 6. Lanjut ke endpoint berikutnya
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token tidak valid' });
  }
}

export default authMiddleware;
