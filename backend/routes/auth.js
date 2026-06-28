import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { authMiddleware } from '../middleware/auth.js';
import { formatUser } from '../utils/formatUser.js';

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

router.post('/register', async (req, res) => {
  try {
    const { name, email, password, major, year } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.googleId) {
        return res.status(409).json({ message: 'This email is linked to Google. Sign in with Google instead.' });
      }
      return res.status(409).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashed, major, year });
    const token = createToken(user._id);

    res.status(201).json({ token, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!user.password) {
      return res.status(401).json({ message: 'This account uses Google sign-in. Please continue with Google.' });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user._id);
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required' });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(503).json({ message: 'Google OAuth is not configured on the server' });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      return res.status(400).json({ message: 'Google account must have an email' });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (picture && !user.avatar) user.avatar = picture;
        await user.save();
      } else if (picture && user.avatar !== picture) {
        user.avatar = picture;
        await user.save();
      }
    } else {
      user = await User.create({
        name: name || email.split('@')[0],
        email,
        googleId,
        avatar: picture || '',
      });
    }

    const token = createToken(user._id);
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    res.status(401).json({ message: 'Google authentication failed' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user: formatUser(user) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, major, year, avatar, notificationsEnabled } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name !== undefined) user.name = name.trim();
    if (major !== undefined) user.major = major.trim();
    if (year !== undefined) user.year = year;
    if (avatar !== undefined) user.avatar = avatar.trim();
    if (notificationsEnabled !== undefined) user.notificationsEnabled = Boolean(notificationsEnabled);

    await user.save();
    res.json({ user: formatUser(user) });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
