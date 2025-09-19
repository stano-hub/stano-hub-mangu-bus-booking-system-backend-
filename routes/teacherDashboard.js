const express = require("express");
const router = express.Router();
const teacherDashboardController = require("../controllers/teacherDashboardController");
const auth = require("../middlewares/auth");

// Get all bookings for logged-in teacher
router.get("/my-bookings", auth(["teacher", "admin"]), teacherDashboardController.getMyBookings);

// Get stats for logged-in teacher
router.get("/stats", auth(["teacher", "admin"]), teacherDashboardController.getStats);

module.exports = router;
