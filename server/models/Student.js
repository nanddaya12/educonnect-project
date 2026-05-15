import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String },
  course: { type: String },
  batch: { type: String },
  profileImage: { type: String }
}, { timestamps: true });

export default mongoose.model('Student', studentSchema);
