function requireAuth(req, res, next) {
  if (req.user) {
    return next();
  }

  return res.status(401).json({ message: "Authentication required" });
}

module.exports = { requireAuth };