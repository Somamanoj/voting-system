const express = require("express");
const router = express.Router();
const passport = require("passport");
const safeUser = require("../utils/safeUser");
const sessionCookie = require("../utils/sessionCookie");
const frontendUrl = (process.env.FRONTEND_URL || "").replace(/\/+$/, "");

// Initiate Google OAuth
router.get("/google", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(503).json({ message: "Google OAuth is not configured on this server." });
  }
  return passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
});

// Google OAuth callback
router.get("/google/callback", (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${frontendUrl}/login?oauth=not_configured`);
  }
  return passport.authenticate("google", { failureRedirect: `${frontendUrl}/login?oauth=failed` })(req, res, (err) => {
    if (err) return next(err);
    res.redirect(`${frontendUrl}/`);
  });
});

router.get("/current_user", (req, res) => {
  res.set("Cache-Control", "no-store");
  if (!req.isAuthenticated() || !req.user) {
    return res.json({ authenticated: false, user: null });
  }

  return res.json({ authenticated: true, user: safeUser(req.user) });
});

router.post("/logout", (req, res) => {
  req.logout((logoutError) => {
    if (logoutError) {
      return res.status(500).json({ message: "Logout failed" });
    }

    if (!req.session) {
      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: sessionCookie.secure,
        sameSite: sessionCookie.sameSite,
        path: "/"
      });
      return res.status(200).json({ message: "Logged out" });
    }

    req.session.destroy((destroyError) => {
      if (destroyError) {
        return res.status(500).json({ message: "Logout failed" });
      }

      res.clearCookie("connect.sid", {
        httpOnly: true,
        secure: sessionCookie.secure,
        sameSite: sessionCookie.sameSite,
        path: "/"
      });
      return res.status(200).json({ message: "Logged out" });
    });
  });
});

module.exports = router;