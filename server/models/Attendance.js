import mongoose from 'mongoose';

const attendanceRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late'], required: true },
});

const attendanceSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    records: [attendanceRecordSchema],
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

attendanceSchema.index({ date: 1 }, { unique: true });

export default mongoose.model('Attendance', attendanceSchema);
