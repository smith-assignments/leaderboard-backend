const mongoose = require('mongoose');
const User = require('../models/User');
const History = require('../models/History');

// Get all users
const getUsers = async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.json(users);
};

// Add new user
const addUser = async (req, res) => {
  try {
    const { name } = req.body;
    const user = new User({ name });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'User name already exists' });
    }
    res.status(500).json({ error: 'Failed to add user' });
  }
};

// claim points
const claimPoints = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    const points = Math.floor(Math.random() * 10) + 1;

    // Atomic increment of totalPoints; ensure updatedAt changes
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { totalPoints: points } },
      { new: true, timestamps: true }
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    try {
      // history write (no transaction)
      await History.create({ userId, points });
    } catch (historyErr) {
      // Compensating write: roll back the increment so totals stay consistent
      await User.updateOne({ _id: userId }, { $inc: { totalPoints: -points } });
      console.error('History insert failed, rolled back user points:', historyErr);
      return res.status(500).json({ error: 'Failed to record claim history' });
    }

    return res.json({
      userId,
      points,
      totalPoints: user.totalPoints
    });
  } catch (err) {
    console.error('claimPoints error:', err);
    return res.status(500).json({ error: 'Failed to claim points' });
  }
};

// Get leaderboard with deterministic tie-breaks
const getLeaderboard = async (req, res) => {
  const users = await User.find()
    .sort({ totalPoints: -1, updatedAt: 1, name: 1 }) // deterministic
    .collation({ locale: 'en', strength: 2 });        // case-insensitive name sort

  const leaderboard = users.map((user, index) => ({
    rank: index + 1,
    userId: user._id,
    name: user.name,
    totalPoints: user.totalPoints
  }));
  res.json(leaderboard);
};

// HISTORY ENDPOINTS :-
// Get all history (paginated) WITH user name
const getAllHistory = async (req, res) => {
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    History.find()
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name') 
      .select('-__v'),
    History.countDocuments()
  ]);

  res.json({
    page,
    limit,
    total,
    items: items.map(h => ({
      id: h.id, 
      userId: h.userId?._id?.toString() || null,
      userName: h.userId?.name || null,
      points: h.points,
      timestamp: h.timestamp
    }))
  });
};


// Get history for a specific user (paginated) WITH user name
const getUserHistory = async (req, res) => {
  const { userId } = req.params;
  const page = parseInt(req.query.page || '1', 10);
  const limit = parseInt(req.query.limit || '20', 10);
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    History.find({ userId })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name') // ← include user name
      .select('-__v'),
    History.countDocuments({ userId })
  ]);

  res.json({
    page,
    limit,
    total,
    items: items.map(h => ({
      id: h.id,
      userId: h.userId?._id?.toString() || null,
      userName: h.userId?.name || null,
      points: h.points,
      timestamp: h.timestamp
    }))
  });
};

module.exports = {
  getUsers,
  addUser,
  claimPoints,
  getLeaderboard,
  getAllHistory,
  getUserHistory
};
