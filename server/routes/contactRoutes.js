import express from "express";
import {
  submitContactMessage,
  getContactMessages,
  getContactMessageById,
  updateContactStatus,
  deleteContactMessage,
} from "../controllers/contactController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public endpoint for submitting the Contact Us form
router.post("/", submitContactMessage);

// Admin-only endpoints for viewing, managing, and deleting contact submissions
router.get("/", protect, admin, getContactMessages);
router.get("/:id", protect, admin, getContactMessageById);
router.put("/:id/status", protect, admin, updateContactStatus);
router.put("/:id", protect, admin, updateContactStatus);
router.delete("/:id", protect, admin, deleteContactMessage);

export default router;
