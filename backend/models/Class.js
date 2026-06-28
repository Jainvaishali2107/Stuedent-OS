import mongoose from 'mongoose';

const classSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    courseName: { type: String, required: true, trim: true },
    courseCode: { type: String, default: '' },
    instructor: { type: String, default: '' },
    location: { type: String, default: '' },
    dayOfWeek: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    color: { type: String, default: '#6366f1' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Class', classSchema);
