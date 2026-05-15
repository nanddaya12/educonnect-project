import mongoose from 'mongoose';

const feeRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  month: { type: String, required: true }, // e.g., 'May 2026'
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['Paid', 'Pending', 'Overdue'], default: 'Pending' },
  paidDate: { type: Date }
}, { timestamps: true });

export default mongoose.model('FeeRecord', feeRecordSchema);
