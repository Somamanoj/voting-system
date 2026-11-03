const express = require('express');
const router = express.Router();
const Election = require('../models/election');
const Candidate = require('../models/candidate');
const { requireAuth } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/role');

router.put('/update-election/:id', requireAuth, requireAdmin, async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      startDate,
      endDate,
      image,
      candidates
    } = req.body;

    // Find existing election
    const election = await Election.findById(req.params.id);

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Upsert candidates (update or insert)
    const candidatePromises = candidates.map(async (candidateData) => {
      if (candidateData._id) {
        // Update existing candidate
        return await Candidate.findByIdAndUpdate(
          candidateData._id,
          {
            name: candidateData.name,
            logo: candidateData.logo,
            partyName: candidateData.partyName,
            manifesto: candidateData.manifesto // Added manifesto
          },
          { new: true }
        );
      } else {
        // Create new candidate
        return await Candidate.create({
          name: candidateData.name,
          logo: candidateData.logo,
          partyName: candidateData.partyName,
          manifesto: candidateData.manifesto // Added manifesto
        });
      }
    });

    // Resolve all candidate operations
    const createdCandidates = await Promise.all(candidatePromises);

    // Update election with new candidate IDs
    election.title = title;
    election.description = description;
    election.location = location;
    election.startDate = new Date(startDate);
    election.endDate = new Date(endDate);
    election.image = image;
    election.candidates = createdCandidates.map(candidate => candidate._id);

    await election.save();

    res.status(200).json({
      message: 'Election updated successfully',
      election,
      candidates: createdCandidates
    });
  } catch {
    console.error('Election update failed');
    res.status(500).json({
      message: 'Failed to update election'
    });
  }
});

module.exports = router;