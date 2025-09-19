// app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to DB
connectDB();

const app = express();

// ================== CORS CONFIG ==================
app.use(
  cors({
    origin: [
      "http://localhost:3000", // React dev
      "https://mangu-bus-booking-system.vercel.app/", // Vercel frontend
    ],
    credentials: true, // allow cookies/sessions
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ================== MIDDLEWARE ==================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================== SESSION ==================
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/manguBusDB",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only https in prod
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// ================== ROUTES ==================

// Auth (Register, Login, Logout)
app.use("/api/auth", require("./routes/auth"));

// Teacher management (Admin adds/edits/removes teachers)
app.use("/api/teachers", require("./routes/teachers"));

// Teacher profile management (update/view their own profile)
app.use("/api/profile", require("./routes/profile"));

// Bus management
app.use("/api/buses", require("./routes/bus"));

// Bookings (create, view, edit, cancel)
app.use("/api/bookings", require("./routes/bookings"));

// Dashboards
app.use("/api/admin", require("./routes/adminDashboard"));     // Admin-specific
app.use("/api/teacher", require("./routes/teacherDashboard")); // Teacher-specific

// ================== SERVER START ==================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = app;
