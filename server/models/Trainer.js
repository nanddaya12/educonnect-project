import mongoose from 'mongoose';

const trainerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  phone: { type: String },
  department: { type: String },
  profileImage: { type: String }
}, { timestamps: true });

export default mongoose.model('Trainer', trainerSchema);
