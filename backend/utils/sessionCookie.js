const configuredSameSite = (process.env.SESSION_COOKIE_SAME_SITE || "lax").toLowerCase();
const sameSite = ["lax", "strict", "none"].includes(configuredSameSite)
  ? configuredSameSite
  : "lax";

module.exports = {
  sameSite,
  secure: process.env.NODE_ENV === "production" || sameSite === "none"
};