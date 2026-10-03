"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const database_1 = __importDefault(require("./database"));
const PORT = 9000;
async function startServer() {
    try {
        await database_1.default.query('SELECT 1');
        console.log('Database connected');
        app_1.default.listen(PORT, () => {
            console.log(`School Management API is running on http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Database connection failed:', error);
    }
}
startServer();
