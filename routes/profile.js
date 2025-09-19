const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const auth = require("../middlewares/auth");

// Get logged-in teacher profile
router.get("/", auth(), profileController.getProfile);

// Update logged-in teacher profile
router.put("/", auth(), profileController.updateProfile);

// Admin can view any teacher profile
router.get("/:id", auth(["admin"]), profileController.getProfileById);

// Admin can update teacher profile
router.put("/:id", auth(["admin"]), profileController.updateProfileById);

// Admin can delete teacher profile
router.delete("/:id", auth(["admin"]), profileController.deleteProfileById);

module.exports = router;
