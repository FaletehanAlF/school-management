"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
const database_1 = __importDefault(require("../database"));
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Name, email, dan password wajib diisi' });
            return;
        }
        const [existing] = await database_1.default.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            res.status(400).json({ message: 'Email sudah digunakan' });
            return;
        }
        await database_1.default.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
            name,
            email,
            password,
        ]);
        res.status(201).json({ message: 'Register berhasil' });
    }
    catch (error) {
        res.status(500).json({ message: 'Gagal register user' });
    }
}
