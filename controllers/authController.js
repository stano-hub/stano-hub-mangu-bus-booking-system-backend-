// controllers/authController.js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Teacher } = require("../models/SchoolDb");

// Generate JWT
const generateToken = (teacher) => {
  return jwt.sign(
    { id: teacher._id, role: teacher.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

// ================= Register =================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if teacher already exists
    let teacher = await Teacher.findOne({ email });
    if (teacher) {
      return res.status(400).json({ message: "Teacher already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create teacher
    teacher = new Teacher({
      name,
      email,
      password: hashedPassword,
      phone,
      role: role || "teacher",
    });

    await teacher.save();

    // Create token
    const token = generateToken(teacher);

    res.status(201).json({
      message: "Registration successful",
      token,
      user: { id: teacher._id, name: teacher.name, email: teacher.email, role: teacher.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ================= Login =================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(teacher);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: teacher._id, name: teacher.name, email: teacher.email, role: teacher.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ================= Get Profile =================
exports.getProfile = async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.user.id).select("-password");
    if (!teacher) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(teacher);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ================= Update Profile =================
exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;

    // If password update, hash it
    if (updates.password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(updates.password, salt);
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true }
    ).select("-password");

    if (!teacher) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: teacher,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
