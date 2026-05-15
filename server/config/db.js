import mongoose from 'mongoose';

const connectDB = async () => {
  const uri = typeof process.env.MONGO_URI === 'string' ? process.env.MONGO_URI.trim() : '';

  if (!uri) {
    console.error('CRITICAL ERROR: MONGO_URI is missing in environment variables.');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host} (${conn.connection.name})`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;

