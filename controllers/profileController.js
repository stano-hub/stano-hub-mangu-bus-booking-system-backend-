const { Teacher } = require("../models/SchoolDb");
const bcrypt = require("bcryptjs");

// Logged-in teacher
exports.getProfile = async (req, res) => {
  try {
    const user = await Teacher.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const user = await Teacher.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, password } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "Profile updated", user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ================= Admin Methods =================

// Get any teacher by ID
exports.getProfileById = async (req, res) => {
  try {
    const user = await Teacher.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Teacher not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update any teacher by ID
exports.updateProfileById = async (req, res) => {
  try {
    const user = await Teacher.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Teacher not found" });

    const { name, email, password, isActive } = req.body;
    if (name) user.name = name;
    if (email) user.email = email;
    if (typeof isActive === "boolean") user.isActive = isActive;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();
    res.json({ message: "Teacher updated", user: { name: user.name, email: user.email, role: user.role, isActive: user.isActive } });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete teacher by ID
exports.deleteProfileById = async (req, res) => {
  try {
    const user = await Teacher.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "Teacher not found" });
    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
