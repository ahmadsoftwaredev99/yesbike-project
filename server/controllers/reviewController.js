import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Review from "../models/Review.js";
import Product from "../models/Product.js";

// Recalculates and saves a product's average rating and review count
const recalcProductRating = async (productId) => {
  const reviews = await Review.find({ product: productId });
  const numReviews = reviews.length;
  const rating = numReviews ? reviews.reduce((sum, r) => sum + r.rating, 0) / numReviews : 0;
  await Product.findByIdAndUpdate(productId, { rating, numReviews });
};

// @desc    Create a review for a product
// @route   POST /api/products/:id/reviews
// @access  Private
export const createReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  if (!rating || !comment) throw new ApiError(400, "Rating and comment are required");

  const product = await Product.findById(productId);
  if (!product) throw new ApiError(404, "Product not found");

  const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
  if (alreadyReviewed) throw new ApiError(400, "You have already reviewed this product");

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    rating: Number(rating),
    comment,
  });

  await recalcProductRating(productId);

  res.status(201).json({ success: true, data: review });
});

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
export const getProductReviews = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let productId = id;
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const product = await Product.findOne({ slug: id });
    if (!product) throw new ApiError(404, "Product not found");
    productId = product._id;
  }
  const reviews = await Review.find({ product: productId })
    .populate("user", "name")
    .sort({ createdAt: -1 });
  res.json({ success: true, data: reviews });
});
