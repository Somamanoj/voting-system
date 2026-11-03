const express = require('express');
const router = express.Router();
const Election = require('../models/election');

router.get('/election/:id', async (req, res) => {
  try {
    const election = await Election.findById(req.params.id)
      .select('-voterIds')
      .populate('candidates');

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.status(200).json(election);
  } catch {
    console.error('Election retrieval failed');
    res.status(500).json({
      message: 'Failed to fetch election'
    });
  }
});

module.exports = router;