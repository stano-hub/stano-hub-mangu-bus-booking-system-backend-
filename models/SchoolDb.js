// models/SchoolDb.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ================= Teacher Schema =================
const teacherSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ["teacher", "admin"], default: "teacher" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ================= Bus Schema =================
const busSchema = new Schema(
  {
    registrationNumber: { type: String, required: true, unique: true },
    capacity: { type: Number, required: true },
    description: { type: String },
    isActive: { type: Boolean, default: true }, // 🚍 true = available, false = unavailable
  },
  { timestamps: true }
);


// ================= Booking Schema =================
const bookingSchema = new Schema(
  {
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
    bus: { type: mongoose.Schema.Types.ObjectId, ref: "Bus", required: true },
    travelDate: { type: Date, required: true },
    purpose: { type: String, required: true },
  },
  { timestamps: true }
);

// Prevent double booking for the same bus on the same date
bookingSchema.index({ bus: 1, travelDate: 1 }, { unique: true });

// ================= Export Models =================
const Teacher = mongoose.model("Teacher", teacherSchema);
const Bus = mongoose.model("Bus", busSchema);
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = { Teacher, Bus, Booking };
