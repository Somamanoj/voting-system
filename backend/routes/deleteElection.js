const express = require('express');
const router = express.Router();
const Election = require('../models/election');
const candidate = require('../models/candidate');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.delete('/delete-election/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Remove associated candidates
    await candidate.deleteMany({ _id: { $in: election.candidates } });

    // Remove election
    await Election.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: 'Election and associated candidates deleted successfully'
    });
  } catch {
    console.error('Election deletion failed');
    res.status(500).json({
      message: 'Failed to delete election'
    });
  }
});

module.exports = router;