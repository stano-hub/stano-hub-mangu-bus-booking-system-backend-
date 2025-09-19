const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const auth = require("../middlewares/auth");

// Create a booking (teacher)
router.post("/", auth(["teacher", "admin"]), bookingController.createBooking);

// Get all bookings (teachers + admins)
router.get("/", auth(["teacher", "admin"]), bookingController.getAllBookings);

// Update booking (teacher who created or admin)
router.put("/:id", auth(["teacher", "admin"]), bookingController.updateBooking);

// Cancel booking (teacher who created or admin)
router.delete("/:id", auth(["teacher", "admin"]), bookingController.cancelBooking);

module.exports = router;
