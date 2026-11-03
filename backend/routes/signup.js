const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const safeUser = require("../utils/safeUser");
const establishSession = require("../utils/establishSession");

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body || {};
    if (typeof fullName !== "string" || typeof email !== "string" || typeof password !== "string" ||
      !fullName.trim() || !email.trim() || !password) {
      return res
        .status(400)
        .json({ message: "Please enter all required fields" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({
      email: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i")
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email: normalizedEmail,
      password: hashedPassword,
      createdAt: Date.now(),
    });

    const savedUser = await newUser.save();
    await establishSession(req, savedUser);

    res.status(201).json({
      message: "Signup successful",
      user: safeUser(savedUser)
    });

  } catch (err) {
    console.error("Signup failed");
    res.status(500).json({ message: "Server error during registration" });
  }
});

module.exports = router;