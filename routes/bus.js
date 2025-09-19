const express = require("express");
const router = express.Router();
const busController = require("../controllers/busController");
const auth = require("../middlewares/auth");

// Add a bus (admin only)
router.post("/", auth(["admin"]), busController.addBus);

// Get all buses (any logged-in user)
router.get("/", auth(), busController.getBuses);

// Get available buses for a specific date (any logged-in user)
router.get("/available", auth(), busController.getAvailableBuses);

// Update bus (admin only)
router.put("/:id", auth(["admin"]), busController.updateBus);

// Toggle bus availability (admin only)
router.put("/:id/toggle", auth(["admin"]), busController.toggleBusAvailability);

// Delete bus (admin only)
router.delete("/:id", auth(["admin"]), busController.deleteBus);

module.exports = router;
