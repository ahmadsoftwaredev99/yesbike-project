import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Product from "../models/Product.js";

// @desc    Get all products with search, filter, sort, pagination
// @route   GET /api/products
// @access  Public
export const getProducts = asyncHandler(async (req, res) => {
  const {
    keyword,
    category,
    minPrice,
    maxPrice,
    size,
    color,
    rating,
    sort,
    page = 1,
    limit = 12,
    featured,
    isNew,
    isBestSeller,
  } = req.query;

  const filter = {};

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { category: { $regex: keyword, $options: "i" } },
    ];
  }
  if (category) filter.category = category;
  if (size) filter.sizes = size;
  if (color) filter.colors = color;
  if (rating) filter.rating = { $gte: Number(rating) };
  if (featured) filter.featured = featured === "true";
  if (isNew) filter.isNew = isNew === "true";
  if (isBestSeller) filter.isBestSeller = isBestSeller === "true";
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortOption = { createdAt: -1 };
  if (sort === "price_asc") sortOption = { price: 1 };
  if (sort === "price_desc") sortOption = { price: -1 };
  if (sort === "rating") sortOption = { rating: -1 };
  if (sort === "popularity") sortOption = { numReviews: -1 };
  if (sort === "newest") sortOption = { createdAt: -1 };

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.max(Number(limit), 1);

  const [products, count] = await Promise.all([
    Product.find(filter)
      .sort(sortOption)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    page: pageNum,
    pages: Math.ceil(count / limitNum) || 1,
    total: count,
  });
});

// @desc    Get single product by id or slug
// @route   GET /api/products/:id
// @access  Public
export const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
  const product = await Product.findOne(query);
  if (!product) throw new ApiError(404, "Product not found");
  res.json({ success: true, data: product });
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, "Product not found");
  await product.deleteOne();
  res.json({ success: true, message: "Product removed" });
});

// @desc    Get related products (same category, excluding current)
// @route   GET /api/products/:id/related
// @access  Public
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
  const product = await Product.findOne(query);
  if (!product) throw new ApiError(404, "Product not found");
  const related = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
  }).limit(4);
  res.json({ success: true, data: related });
});
