// routes/teachers.js
const express = require("express");
const router = express.Router();
const { Teacher } = require("../models/SchoolDb");
const auth = require("../middlewares/auth");

// Admin: Get all teachers
router.get("/", auth(["admin"]), async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Admin: Get teacher by ID (optional duplicate of profile/:id)
router.get("/:id", auth(["admin"]), async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select("-password");
    if (!teacher) return res.status(404).json({ message: "Teacher not found" });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
