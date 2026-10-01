import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import Contact from "../models/Contact.js";

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json({ success: true, data: users });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  res.json({ success: true, data: user });
});

// @desc    Update a user (role, name, etc.)
// @route   PUT /api/users/:id
// @access  Private/Admin
export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");

  if (req.body.role && !["user", "admin"].includes(req.body.role)) {
    throw new ApiError(400, "Invalid role");
  }

  user.name = req.body.name ?? user.name;
  user.role = req.body.role ?? user.role;
  user.phone = req.body.phone ?? user.phone;

  const updated = await user.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) throw new ApiError(400, "Cannot delete the last remaining admin");
  }
  await user.deleteOne();
  res.json({ success: true, message: "User removed" });
});

// --- Wishlist ---

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
export const addToWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) throw new ApiError(404, "Product not found");

  const user = await User.findById(req.user._id);
  if (!user.wishlist.includes(product._id)) {
    user.wishlist.push(product._id);
    await user.save();
  }
  res.json({ success: true, data: user.wishlist });
});

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();
  res.json({ success: true, data: user.wishlist });
});

// @desc    Get logged-in user's wishlist (populated)
// @route   GET /api/users/wishlist
// @access  Private
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json({ success: true, data: user.wishlist });
});

// @desc    Admin dashboard summary stats
// @route   GET /api/users/admin/stats
// @access  Private/Admin
export const getAdminStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalProducts, totalOrders, orders, newMessages, totalMessages] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.find({}),
      Contact.countDocuments({ status: "New" }),
      Contact.countDocuments(),
    ]);

  const totalSales = orders.reduce((sum, o) => sum + o.totalPrice, 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === "Pending").length;
  const deliveredOrders = orders.filter((o) => o.orderStatus === "Delivered").length;

  res.json({
    success: true,
    data: {
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales,
      pendingOrders,
      deliveredOrders,
      newMessages,
      totalMessages,
    },
  });
});
