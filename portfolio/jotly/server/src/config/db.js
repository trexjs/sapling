import mongoose from "mongoose";

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn(
      "⚠️  MONGODB_URI not provided. Falling back to local MongoDB at mongodb://127.0.0.1:27017/task-master"
    );
  }

  const connectionUri = uri ?? "mongodb://127.0.0.1:27017/task-master";

  try {
    await mongoose.connect(connectionUri);
    console.log(`✅ Connected to MongoDB (${connectionUri})`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    process.exit(1);
  }
};
