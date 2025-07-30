/**
 * /api/users
 * GET    /            → list users
 * POST   /            → add user
 * POST   /claim       → claim random points for a user
 * GET    /leaderboard → ranked users with totals
 * GET    /history     → global claim feed (paginated)
 * GET    /history/:id → per-user claim feed (paginated)
 */


const express = require('express');
const router = express.Router();
const {
  getUsers,
  addUser,
  claimPoints,
  getLeaderboard,
  getAllHistory,
  getUserHistory
} = require('../controllers/userController');

router.get('/', getUsers);
router.post('/', addUser);
router.post('/claim', claimPoints);
router.get('/leaderboard', getLeaderboard);
router.get('/history', getAllHistory);
router.get('/history/:userId', getUserHistory);

module.exports = router;
