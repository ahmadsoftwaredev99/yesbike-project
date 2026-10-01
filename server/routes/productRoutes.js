import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
} from "../controllers/productController.js";
import { createReview, getProductReviews } from "../controllers/reviewController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/", protect, admin, createProduct);
router.get("/:id", getProductById);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);
router.get("/:id/related", getRelatedProducts);

router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", protect, createReview);

export default router;
