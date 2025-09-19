const { Booking } = require("../models/SchoolDb");

// ================== Teacher Dashboard ==================

// Get all bookings for the logged-in teacher
exports.getMyBookings = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const bookings = await Booking.find({ teacher: teacherId })
      .populate("bus")
      .sort({ travelDate: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get stats for logged-in teacher
exports.getStats = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const today = new Date();

    const upcomingBookings = await Booking.find({
      teacher: teacherId,
      travelDate: { $gte: today },
    });

    const pastBookings = await Booking.find({
      teacher: teacherId,
      travelDate: { $lt: today },
    });

    res.json({
      totalBookings: upcomingBookings.length + pastBookings.length,
      upcomingCount: upcomingBookings.length,
      pastCount: pastBookings.length,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
