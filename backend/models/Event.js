import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    location: { type: String, default: '' },
    category: { type: String, enum: ['workshop', 'meetup', 'career', 'social', 'other'], default: 'other' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    reminder: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Event', eventSchema);
