import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database';

// POST /auth/register - membuat user baru
export async function register(req: Request, res: Response) {
  try {
    const { name, email, password } = req.body;

    // Validasi sederhana
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Name, email, dan password wajib diisi' });
      return;
    }

    // 1. Cek apakah email sudah terdaftar
    const [existing]: any = await db.query('SELECT id FROM users WHERE email = ?', [email]);

    if (existing.length > 0) {
      res.status(400).json({ message: 'Email sudah digunakan' });
      return;
    }

    // 2. Hash password sebelum disimpan (10 = salt rounds, standar yang umum dipakai)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Jika belum ada, INSERT user baru (role ikut DEFAULT 'student' dari database)
    await db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
      name,
      email,
      hashedPassword,
    ]);

    res.status(201).json({ message: 'Register berhasil' });
  } catch (error) {
    res.status(500).json({ message: 'Gagal register user' });
  }
}

// POST /auth/login - cek email dan password
export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    // Validasi sederhana
    if (!email || !password) {
      res.status(400).json({ message: 'Email dan password wajib diisi' });
      return;
    }

    // 1. Cari user berdasarkan email
    const [rows]: any = await db.query(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email]
    );

    if (rows.length === 0) {
      res.status(401).json({ message: 'Email atau password salah' });
      return;
    }

    const user = rows[0];

    // 2. Bandingkan password asli dengan hash di database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: 'Email atau password salah' });
      return;
    }

    // 3. Jika cocok, buat JWT token (hanya setelah password terbukti benar)
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      res.status(500).json({ message: 'JWT secret belum diatur' });
      return;
    }

    const token = jwt.sign({ id: user.id, role: user.role }, jwtSecret, {
      expiresIn: '1d',
    });

    // 4. Jika cocok, kembalikan token + data aman tanpa password
    res.status(200).json({
      message: 'Login berhasil',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Gagal login' });
  }
}
