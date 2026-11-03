const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
  partyName: { type: String, required: true },
  manifesto: { type: String },
  foundedYear: { type: Number },
  votesCount: { type: Number, default: 0 }
});

module.exports = mongoose.model("Candidate", CandidateSchema);