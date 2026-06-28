import express from 'express';
import Hackathon from '../models/Hackathon.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const hackathons = await Hackathon.find({ user: req.user.id }).sort({ startDate: 1 });
    res.json(hackathons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const hackathon = await Hackathon.create({ ...req.body, user: req.user.id });
    res.status(201).json(hackathon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const hackathon = await Hackathon.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });
    res.json(hackathon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const hackathon = await Hackathon.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!hackathon) return res.status(404).json({ message: 'Hackathon not found' });
    res.json({ message: 'Hackathon deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
