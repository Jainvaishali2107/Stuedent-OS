import mongoose from 'mongoose';

const hackathonSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    organizer: { type: String, default: '' },
    location: { type: String, default: '' },
    url: { type: String, default: '' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    status: { type: String, enum: ['interested', 'registered', 'completed'], default: 'interested' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Hackathon', hackathonSchema);
