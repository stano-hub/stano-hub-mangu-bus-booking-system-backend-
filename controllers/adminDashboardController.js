// controllers/adminDashboardController.js
const { Teacher, Bus, Booking } = require("../models/SchoolDb");

// ================== ADMIN DASHBOARD (Stats + Analytics) ==================
exports.getAdminDashboard = async (req, res) => {
  try {
    const teachersCount = await Teacher.countDocuments({ role: "teacher" });
    const busesCount = await Bus.countDocuments();
    const bookingsCount = await Booking.countDocuments();

    // Most booked bus
    const mostBookedBusAgg = await Booking.aggregate([
      { $group: { _id: "$bus", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const mostBookedBus = mostBookedBusAgg.length
      ? await Bus.findById(mostBookedBusAgg[0]._id)
      : null;

    // Most active teacher
    const mostActiveTeacherAgg = await Booking.aggregate([
      { $group: { _id: "$teacher", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const mostActiveTeacher = mostActiveTeacherAgg.length
      ? await Teacher.findById(mostActiveTeacherAgg[0]._id).select("name email")
      : null;

    // Upcoming bookings (next 7 days)
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const upcomingBookings = await Booking.find({
      travelDate: { $gte: today, $lte: nextWeek },
    })
      .populate("bus")
      .populate("teacher", "name email");

    res.json({
      stats: {
        teachersCount,
        busesCount,
        bookingsCount,
      },
      analytics: {
        mostBookedBus,
        mostActiveTeacher,
      },
      upcomingBookings,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ================== ADMIN BUS CONTROL ==================

// Mark a bus as inactive (unavailable)
exports.deactivateBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findByIdAndUpdate(
      busId,
      { isActive: false },
      { new: true }
    );

    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.json({ message: "Bus deactivated successfully", bus });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Mark a bus as active (available again)
exports.activateBus = async (req, res) => {
  try {
    const { busId } = req.params;
    const bus = await Bus.findByIdAndUpdate(
      busId,
      { isActive: true },
      { new: true }
    );

    if (!bus) return res.status(404).json({ message: "Bus not found" });

    res.json({ message: "Bus activated successfully", bus });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// View all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password");
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// View all bookings
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("teacher", "name email")
      .populate("bus", "registrationNumber capacity");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Optional: separate stats endpoint
exports.getStats = async (req, res) => {
  try {
    const teachersCount = await Teacher.countDocuments({ role: "teacher" });
    const busesCount = await Bus.countDocuments();
    const bookingsCount = await Booking.countDocuments();
    res.json({ teachersCount, busesCount, bookingsCount });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
