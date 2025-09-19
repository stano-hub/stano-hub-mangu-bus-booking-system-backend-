// controllers/busController.js
const { Bus, Booking } = require("../models/SchoolDb");

// Add a bus (Admin only)
exports.addBus = async (req, res) => {
  try {
    const { registrationNumber, capacity, description } = req.body;

    // Check if bus exists already
    const existingBus = await Bus.findOne({ registrationNumber });
    if (existingBus) {
      return res.status(400).json({ message: "Bus already exists" });
    }

    const bus = new Bus({ registrationNumber, capacity, description, isActive: true });
    await bus.save();

    res.status(201).json({ message: "Bus added successfully", bus });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all buses
exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get available buses for a date
exports.getAvailableBuses = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const travelDate = new Date(date);

    // Find buses already booked on this date
    const bookedBuses = await Booking.find({ travelDate }).distinct("bus");

    // Get buses not in booked list and active
    const availableBuses = await Bus.find({
      _id: { $nin: bookedBuses },
      isActive: true,
    });

    res.json(availableBuses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update bus (Admin only)
exports.updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Bus.findByIdAndUpdate(id, req.body, { new: true });

    if (!updated) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json({ message: "Bus updated successfully", bus: updated });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Toggle bus availability (Admin only)
exports.toggleBusAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const bus = await Bus.findById(id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    bus.isActive = !bus.isActive;
    await bus.save();

    res.json({ message: `Bus is now ${bus.isActive ? "active" : "inactive"}`, bus });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete bus (Admin only)
exports.deleteBus = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Bus.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
