const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
require("dotenv").config();
const sessionCookie = require("./utils/sessionCookie");

const app = express();

if (!process.env.MONGODB_URI) {
  console.error("MONGODB_URI is not set in .env file");
  process.exit(1);
}
if (!process.env.SESSION_SECRET) {
  console.error("SESSION_SECRET is not set in .env file");
  process.exit(1);
}

const configuredOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  ...(process.env.CORS_ORIGINS || "").split(",")
].map((origin) => origin?.trim()).filter(Boolean);
const allowedOrigins = new Set(configuredOrigins.map((origin) => new URL(origin).origin));

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    return next();
  }

  const origin = req.get("Origin");
  if (origin && !allowedOrigins.has(origin)) {
    return res.status(403).json({ message: "Origin is not allowed" });
  }

  return next();
});

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    collectionName: 'sessions'
  }),
  cookie: {
    maxAge: 1000 * 60 * 60 * 24,
    httpOnly: true,
    secure: sessionCookie.secure,
    sameSite: sessionCookie.sameSite
  }
}));

// Passport Initialization
require("./passport");
app.use(passport.initialize());
app.use(passport.session());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => {
    console.error("MongoDB connection failed");
    process.exit(1);
  });

// Import routes
const getAllUsersRoute = require("./routes/getAll");
const signupRoute = require("./routes/signup");
const loginRoute = require("./routes/login");
const getUserRoute = require("./routes/getUser");
const googleAuthRoute = require("./routes/googleAuth");
const createElection = require("./routes/createElection");
const updateElection = require("./routes/updateElection");
const deleteElection = require("./routes/deleteElection");
const getAllElection = require("./routes/getAllElection");
const getElection = require("./routes/getElection");
const vote = require("./routes/vote");
const getAiResponse = require("./routes/getAiResponse");

// User routes
app.use(signupRoute);
app.use(loginRoute);
app.use(getAllUsersRoute);
app.use(getUserRoute);

// Election routes
app.use(createElection);
app.use(updateElection);
app.use(deleteElection);
app.use(getAllElection);
app.use(getElection);
app.use(vote);
app.use(getAiResponse);


app.use("/auth", googleAuthRoute); // Mount Google OAuth routes under /auth

// Basic Route
app.get("/", (req, res) => {
  res.send("Welcome to the Express server!");
});

// Error Handling Middleware
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: {
      message: statusCode === 404 ? "Not Found" : "Internal server error",
    },
  });
});

// Server Setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});