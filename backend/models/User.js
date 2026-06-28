import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: {
      type: String,
      minlength: 6,
      required: function () {
        return !this.googleId;
      },
    },
    googleId: { type: String, sparse: true, unique: true },
    avatar: { type: String, default: '' },
    major: { type: String, default: '' },
    year: { type: String, default: '' },
    notificationsEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
