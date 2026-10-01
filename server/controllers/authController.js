import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    throw new ApiError(400, "Please fill in all fields");
  }
  if (password !== confirmPassword) {
    throw new ApiError(400, "Passwords do not match");
  }
  if (password.length < 6) {
    throw new ApiError(400, "Password must be at least 6 characters");
  }

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    throw new ApiError(400, "An account with this email already exists");
  }

  const user = await User.create({ name, email, password });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Please provide email and password");
  }

  const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    },
  });
});

// @desc    Get logged-in user's profile
// @route   GET /api/auth/profile
// @access  Private
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  res.json({ success: true, data: user });
});

// @desc    Update logged-in user's profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "User not found");

  user.name = req.body.name ?? user.name;
  user.phone = req.body.phone ?? user.phone;
  if (req.body.address) user.address = { ...user.address, ...req.body.address };
  if (req.body.password) {
    if (req.body.password.length < 6) throw new ApiError(400, "Password must be at least 6 characters");
    user.password = req.body.password;
  }

  const updated = await user.save();
  res.json({
    success: true,
    data: {
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      phone: updated.phone,
      address: updated.address,
      role: updated.role,
    },
  });
});

// @desc    Logout user / invalidate session
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});
