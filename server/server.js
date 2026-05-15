import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import assignmentRoutes from './routes/assignmentRoutes.js';
import attendanceRoutes from './routes/attendanceRoutes.js';
import feeRoutes from './routes/feeRoutes.js';
import trainerRoutes from './routes/trainerRoutes.js';
import debugRoutes from './routes/debugRoutes.js';
import { seedDatabase } from './seed.js';
import { notFound } from './middleware/notFound.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
const app = express();

app.use(helmet());
app.use(
  cors({
    origin: (() => {
      const raw = process.env.CLIENT_URL || 'http://localhost:5173';
      const list = raw
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      return list.length <= 1 ? list[0] || 'http://localhost:5173' : list;
    })(),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  })
);
app.use(express.json({ limit: '25mb' }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});
app.use('/api/', limiter);

app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/trainers', trainerRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/fees', feeRoutes);

if (process.env.NODE_ENV !== 'production') {
  app.use('/api/debug', debugRoutes);
}

app.use(notFound);
app.use(errorHandler);

// Export app for Vercel Serverless Functions
export default app;

const startServer = async () => {
  try {
    await connectDB();
    // Only seed if NOT in production to prevent auto-seeding on serverless cold starts
    if (process.env.NODE_ENV !== 'production') {
      await seedDatabase();
    }
    
    if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error.message);
    // On Vercel, we don't want to exit the process as it might be a cold start
    if (process.env.VERCEL !== '1') {
      process.exit(1);
    }
  }
};

// Initialize connections
startServer();
