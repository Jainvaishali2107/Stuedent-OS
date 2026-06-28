import express from 'express';
import Class from '../models/Class.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const classes = await Class.find({ user: req.user.id }).sort({ dayOfWeek: 1, startTime: 1 });
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const classItem = await Class.create({ ...req.body, user: req.user.id });
    res.status(201).json(classItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const classItem = await Class.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!classItem) return res.status(404).json({ message: 'Class not found' });
    res.json(classItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const classItem = await Class.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!classItem) return res.status(404).json({ message: 'Class not found' });
    res.json({ message: 'Class deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
