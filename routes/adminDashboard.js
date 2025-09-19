const express = require("express");
const router = express.Router();
const adminDashboardController = require("../controllers/adminDashboardController");
const auth = require("../middlewares/auth");

// Dashboard stats
router.get("/stats", auth(["admin"]), adminDashboardController.getStats);

// View all teachers
router.get("/teachers", auth(["admin"]), adminDashboardController.getAllTeachers);

// View all bookings
router.get("/bookings", auth(["admin"]), adminDashboardController.getAllBookings);

// Control bus availability
router.put("/bus/:busId/deactivate", auth(["admin"]), adminDashboardController.deactivateBus);
router.put("/bus/:busId/activate", auth(["admin"]), adminDashboardController.activateBus);

module.exports = router;
