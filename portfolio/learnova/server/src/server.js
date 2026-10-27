import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import courseRoutes from './routes/course.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';
import { attachUser } from './middleware/auth.middleware.js';

dotenv.config();

const app = express();
// const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const CLIENT_URL = 'http://localhost:5173';

app.use(cors({
  origin: CLIENT_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'x-user-role', 'X-Requested-With'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.set({
      'Access-Control-Allow-Origin': CLIENT_URL,
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-user-role, X-Requested-With',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    });
    return res.sendStatus(204);
  }
  return next();
});
app.use(express.json());
app.use(cookieParser());
app.use(attachUser);

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'LMS API is running' });
});

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
