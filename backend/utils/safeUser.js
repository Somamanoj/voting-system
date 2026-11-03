function safeUser(user) {
  if (!user) {
    return null;
  }

  return {
    _id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role || "voter",
    createdAt: user.createdAt
  };
}

module.exports = safeUser;