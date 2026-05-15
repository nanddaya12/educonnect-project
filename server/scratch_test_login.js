import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const identifier = 'admin@educonnect.com';
    const password = 'admin123';
    const role = 'admin';

    console.log(`Searching for user with identifier: ${identifier}, role: ${role}`);
    const user = await User.findOne({ 
      $or: [{ uniqueId: identifier }, { email: identifier }],
      role: role 
    });

    if (!user) {
      console.log('User not found in database!');
      const allUsers = await User.find({});
      console.log('Available users:', allUsers.map(u => u.email));
    } else {
      console.log('User found:', user.uniqueId);
      const isMatch = await user.matchPassword(password);
      console.log('Password match:', isMatch);
      
      // Manual check
      const manualMatch = await bcrypt.compare(password, user.password);
      console.log('Manual bcrypt match:', manualMatch);
      console.log('Hashed password in DB:', user.password);
    }

    process.exit();
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testLogin();
