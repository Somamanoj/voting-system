const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  googleId: String,
  role: {
    type: String,
    enum: ["voter", "admin"],
    default: "voter"
  },
  password: {
    type: String,
  },
  bio: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    default:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png ",
  },
  votedElection: { type: mongoose.Schema.Types.ObjectId, ref: "Election", default: null },
  votedCandidate: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate", default: null },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;