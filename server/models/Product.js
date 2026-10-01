import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: null },
    category: {
      type: String,
      required: true,
      enum: [
        "Leather Suits",
        "Jackets",
        "Pants",
        "Helmets",
        "Gloves",
        "Boots",
        "Protective Gear",
        "Accessories",
      ],
    },
    brand: { type: String, default: "Yes Bike" },
    images: [{ type: String }],
    stock: { type: Number, required: true, default: 0, min: 0 },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
  },
  { timestamps: true, suppressReservedKeysWarning: true }
);

productSchema.pre("validate", function (next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + "-" + Math.random().toString(36).slice(2, 7);
  }
  next();
});

productSchema.index({ name: "text", description: "text", category: "text" });

export default mongoose.model("Product", productSchema);
