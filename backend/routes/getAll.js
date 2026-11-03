const express = require('express');
const router = express.Router();
const User = require('../models/user');
const safeUser = require('../utils/safeUser');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.get('/allUsers', requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find().select('fullName email googleId bio image role createdAt');
    res.json(users.map(safeUser));
  } catch {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;