const express = require('express');
const router = express.Router();
const Election = require('../models/election');

router.get('/all-election', async (req, res) => {
  try {
    const elections = await Election.find().select('-voterIds')
      .populate('candidates')
      .sort({ startDate: -1 });

    res.status(200).json(elections);
  } catch {
    console.error('Election list retrieval failed');
    res.status(500).json({
      message: 'Failed to fetch elections'
    });
  }
});

module.exports = router;