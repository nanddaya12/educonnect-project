import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  const uri = typeof process.env.MONGO_URI === 'string' ? process.env.MONGO_URI.trim() : '';

  try {
    if (!uri) {
      throw new Error('MONGO_URI is missing');
    }
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    console.error(`Primary MongoDB connection failed (${error.message}). Spinning up in-memory MongoMemoryServer fallback...`);
    try {
      const mongod = await MongoMemoryServer.create();
      const memoryUri = mongod.getUri();
      await mongoose.connect(memoryUri);
      console.log(`MongoDB Connected (MemoryServer Fallback): ${mongoose.connection.host}`);
    } catch (fallbackError) {
      console.error(`Fallback MongoDB connection failed: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;

