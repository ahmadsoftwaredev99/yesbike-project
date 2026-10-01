import express from "express";
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getAdminStats,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/:productId", protect, addToWishlist);
router.delete("/wishlist/:productId", protect, removeFromWishlist);

router.get("/admin/stats", protect, admin, getAdminStats);

router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
