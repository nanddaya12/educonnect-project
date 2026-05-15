import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Student from './models/Student.js';
import Trainer from './models/Trainer.js';
import Assignment from './models/Assignment.js';
import Attendance from './models/Attendance.js';
import FeeRecord from './models/FeeRecord.js';
import connectDB from './config/db.js';

dotenv.config();

export const seedDatabase = async (force = false) => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0 && !force) {
      console.log('✅ Database already contains data. Skipping auto-seed.');
      return;
    }

    if (force) {
      console.log('🧹 Clearing existing data...');
      await User.deleteMany();
      await Student.deleteMany();
      await Trainer.deleteMany();
      await Assignment.deleteMany();
      await Attendance.deleteMany();
      await FeeRecord.deleteMany();
    }

    console.log('🌱 Seeding database...');

    // Create Admin
    await User.create({
      uniqueId: 'ADM-001',
      email: 'admin@educonnect.com',
      password: 'admin123',
      role: 'admin'
    });

    // Create Trainer
    const trainerUser = await User.create({
      uniqueId: 'TRN-001',
      email: 'trainer@educonnect.com',
      password: 'trainer123',
      role: 'trainer'
    });

    const trainer = await Trainer.create({
      user: trainerUser._id,
      name: 'John Doe (Lead Trainer)',
      phone: '1234567890',
      department: 'Full Stack Development'
    });

    // Create Students
    const students = [];
    for (let i = 1; i <= 5; i++) {
      const user = await User.create({
        uniqueId: `IDH-00${i}`,
        email: `student${i}@educonnect.com`,
        password: 'student123',
        role: 'student'
      });

      const student = await Student.create({
        user: user._id,
        name: `Student ${i}`,
        phone: `987654321${i}`,
        course: 'MERN Stack Bootcamp',
        batch: 'Batch A'
      });
      students.push(student);
    }

    // Create assignments, attendance, fees
    await Assignment.create({
      title: 'React Fundamentals',
      subject: 'Frontend',
      description: 'Build a simple React app with components.',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      assignedStudents: students.map(s => s._id),
      createdBy: trainerUser._id,
    });

    await Attendance.create({
      date: new Date(),
      markedBy: trainerUser._id,
      records: students.map((s, index) => ({
        student: s._id,
        status: index % 2 === 0 ? 'Present' : 'Late'
      }))
    });

    for (const student of students) {
      await FeeRecord.create({
        student: student._id,
        month: 'May 2026',
        amount: 500,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        status: student.name === 'Student 1' ? 'Paid' : 'Pending'
      });
    }

    console.log('✅ Database Seeded Successfully!');
  } catch (error) {
    console.error(`❌ Seeding failed: ${error}`);
    if (process.env.NODE_ENV === 'production' && force) process.exit(1);
  }
};

// Execute if run directly
if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  dotenv.config();
  connectDB().then(() => seedDatabase(true).then(() => process.exit()));
}
