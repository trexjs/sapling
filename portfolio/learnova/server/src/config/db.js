import mongoose from 'mongoose';

const { MONGODB_URI = 'mongodb://127.0.0.1:27017/lms' } = process.env;

export const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error', error);
    throw error;
  }
};
