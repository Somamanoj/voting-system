const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const safeUser = require("../utils/safeUser");
const establishSession = require("../utils/establishSession");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== "string" || typeof password !== "string" || !email.trim() || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const escapedEmail = normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const user = await User.findOne({ email: new RegExp(`^${escapedEmail}$`, "i") });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = typeof user.password === "string" && await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    user.role = user.role || "voter";
    await establishSession(req, user);

    res.status(200).json({
      message: "Login successful",
      user: safeUser(user)
    });

  } catch (error) {
    console.error("Login failed");
    res.status(500).json({
      error: "Internal server error"
    });
  }
});

module.exports = router;