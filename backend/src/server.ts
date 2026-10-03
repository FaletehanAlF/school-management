import 'dotenv/config';
import app from './app';
import db from './database';

const PORT = 9000;

async function startServer() {
  try {
    await db.query('SELECT 1');

    console.log('Database connected');

    app.listen(PORT, () => {
      console.log(`School Management API is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
  }
}

startServer();