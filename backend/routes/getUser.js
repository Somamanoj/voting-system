const express = require('express');
const router = express.Router();
const User = require('../models/user');
const safeUser = require('../utils/safeUser');
const { requireAuth } = require('../middleware/auth');

router.get("/user/:userId", requireAuth, async (req, res) => {
  try {
    const userId = req.params.userId;
    if (String(req.user._id) !== userId && (req.user.role || 'voter') !== 'admin') {
      return res.status(403).json({ error: "Access denied" });
    }

    const user = await User.findById(userId).select('fullName email bio image role createdAt');

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(safeUser(user));
  } catch (error) {
    console.error("User lookup failed");
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

module.exports = router;