const express = require('express');
const router = express.Router();

const User = require('../models/user');

router.get('/deleteuser', async (req, res) => {
  try {
    await User.deleteMany({});
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch {
    console.error('User deletion failed');
    res.status(500).json({ message: 'Failed to delete users' });
  }
})

module.exports = router;