const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Election = require('../models/election');
const Candidate = require('../models/candidate');
const { requireAuth } = require('../middleware/auth');

router.post('/vote', requireAuth, async (req, res) => {
  try {
    const { electionId, candidateId, voterId } = req.body;

    if (!electionId || !candidateId || !voterId) {
      return res.status(400).json({ message: 'Missing required vote information' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (user.votedElection) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    // Find the election and candidate
    const election = await Election.findById(electionId);
    const candidate = await Candidate.findById(candidateId);

    if (!election || !candidate) {
      return res.status(404).json({ message: 'Election or Candidate not found' });
    }

    // Check if voter ID exists in the election's voter IDs
    const voterIdIndex = election.voterIds.indexOf(voterId);
    if (voterIdIndex === -1) {
      return res.status(400).json({ message: 'Invalid Voter ID' });
    }

    // Increment candidate votes
    candidate.votesCount = (candidate.votesCount || 0) + 1;
    await candidate.save();

    // Remove the used voter ID from the election
    election.voterIds.splice(voterIdIndex, 1);
    await election.save();

    // Update user to mark as voted
    user.votedElection = electionId;
    user.votedCandidate = candidateId;
    await user.save();

    res.status(200).json({
      message: 'Vote submitted successfully',
      votesCount: candidate.votesCount
    });

  } catch (error) {
    console.error('Vote submission failed');
    res.status(500).json({ message: 'Error submitting vote' });
  }
});

module.exports = router;