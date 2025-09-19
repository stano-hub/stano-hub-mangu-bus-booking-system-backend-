// controllers/bookingController.js
const { Booking, Bus } = require("../models/SchoolDb");

// ================= Create Booking =================
exports.createBooking = async (req, res) => {
  try {
    const { busId, travelDate, purpose } = req.body;
    const teacherId = req.user.id;

    if (!busId || !travelDate || !purpose) {
      return res.status(400).json({ message: "Please provide busId, travelDate, and purpose" });
    }

    // Validate bus exists
    const bus = await Bus.findById(busId);
    if (!bus) return res.status(404).json({ message: "Bus not found" });

    // Prevent booking for past dates
    if (new Date(travelDate) < new Date()) {
      return res.status(400).json({ message: "Cannot book for past dates" });
    }

    // Prevent double booking (bus is fully booked once)
    const existing = await Booking.findOne({ bus: busId, travelDate });
    if (existing) {
      return res.status(400).json({ message: "Bus already booked for this date" });
    }

    const booking = new Booking({
      bus: busId,
      teacher: teacherId,
      travelDate,
      purpose,
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= Get All Bookings =================
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("bus")
      .populate("teacher", "name email");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= Update Booking =================
exports.updateBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    const role = req.user.role;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only owner or admin can update
    if (booking.teacher.toString() !== teacherId && role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    const updated = await Booking.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================= Cancel Booking =================
exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    const role = req.user.role;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only owner or admin can cancel
    if (booking.teacher.toString() !== teacherId && role !== "admin") {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking canceled" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
