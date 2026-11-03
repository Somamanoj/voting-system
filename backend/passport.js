const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("./models/user");

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `/auth/google/callback`
  },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.trim().toLowerCase();
        if (!email) {
          return done(new Error("Google account did not provide an email"));
        }

        const escapedEmail = email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        let user = await User.findOne({ email: new RegExp(`^${escapedEmail}$`, "i") });

        if (!user) {
          // Create new user with Google data
          user = new User({
            fullName: profile.displayName,
            email,
            googleId: profile.id,
            image: profile.photos?.[0]?.value,
            createdAt: Date.now()
          });
          await user.save();
        } else {
          // Update existing user with latest image if needed
          user.image = profile.photos?.[0]?.value || user.image;
          await user.save();
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }));
} else {
  console.warn("[Passport] Google OAuth credentials not set; Google login will be disabled.");
}

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user && !user.role) {
      user.role = "voter";
    }
    done(null, user);
  } catch (err) {
    done(err);
  }
});