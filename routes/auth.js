const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const auth = require("../middlewares/auth");

// Teacher self-register (role defaults to teacher)
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Get logged-in teacher profile
router.get("/profile", auth(), authController.getProfile);

// Update logged-in teacher profile
router.put("/profile", auth(), authController.updateProfile);

module.exports = router;
