"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = getUsers;
const database_1 = __importDefault(require("../database"));
async function getUsers(_req, res) {
    try {
        const [rows] = await database_1.default.query('SELECT * FROM users');
        res.status(200).json(rows);
    }
    catch (error) {
        res.status(500).json({
            message: 'Gagal mengambil data users',
        });
    }
}
