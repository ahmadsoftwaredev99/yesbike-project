import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiHeart, FiMinus, FiPlus } from "react-icons/fi";
import api from "../services/api.js";
import StarRating from "../components/StarRating.jsx";
import ProductCard from "../components/ProductCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import { fetchProductById, clearCurrentProduct } from "../redux/slices/productSlice.js";
import { addToCart } from "../redux/slices/cartSlice.js";
import { toggleWishlistItem } from "../redux/slices/wishlistSlice.js";
import useAuth from "../hooks/useAuth.js";
import "./ProductDetails.css";

const TABS = ["Description", "Specifications", "Reviews"];

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { current: product, currentLoading } = useSelector((state) => state.products);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { isAuthenticated, user } = useAuth();

  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const [tab, setTab] = useState("Description");
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => dispatch(clearCurrentProduct());
  }, [dispatch, id]);

  useEffect(() => {
    if (!product?._id) return;
    setSize(product.sizes?.[0] || "");
    setColor(product.colors?.[0] || "");
    setActiveImage(0);
    api.get(`/products/${product._id}/reviews`).then((res) => setReviews(res.data.data)).catch(() => {});
    api.get(`/products/${product._id}/related`).then((res) => setRelated(res.data.data)).catch(() => {});
  }, [product?._id]);

  if (currentLoading || !product) {
    return <div className="container" style={{ padding: "60px 24px" }}><LoadingSpinner /></div>;
  }

  const outOfStock = product.stock <= 0;
  const isWishlisted = wishlistItems.some((p) => p._id === product._id);

  const handleAddToCart = () => {
    if (outOfStock) return;
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images?.[0],
        price: product.discountPrice || product.price,
        stock: product.stock,
        size,
        color,
        quantity: qty,
      })
    );
    toast.success("Added to cart");
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };

  const handleWishlist = () => {
    if (!isAuthenticated) return toast.info("Please login to save items to your wishlist");
    dispatch(toggleWishlistItem({ productId: product._id, isInWishlist: isWishlisted }));
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return toast.info("Please login to leave a review");
    setSubmittingReview(true);
    try {
      await api.post(`/products/${product._id}/reviews`, reviewForm);
      toast.success("Review submitted");
      const res = await api.get(`/products/${product._id}/reviews`);
      setReviews(res.data.data);
      setReviewForm({ rating: 5, comment: "" });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="container yb-pd">
      <nav className="yb-breadcrumb">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
      </nav>

      <div className="yb-pd-grid">
        <div className="yb-pd-gallery">
          <div className="yb-pd-main-image">
            <img src={product.images?.[activeImage]} alt={product.name} />
          </div>
          {product.images?.length > 1 && (
            <div className="yb-pd-thumbs">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  className={`yb-pd-thumb ${i === activeImage ? "yb-pd-thumb-active" : ""}`}
                  onClick={() => setActiveImage(i)}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="yb-pd-info">
          <span className="yb-product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <StarRating rating={product.rating} count={product.numReviews} />

          <div className="yb-pd-price">
            {product.discountPrice ? (
              <>
                <span className="yb-price-now">{formatCurrency(product.discountPrice)}</span>
                <span className="yb-price-was">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="yb-price-now">{formatCurrency(product.price)}</span>
            )}
          </div>

          <p>{product.description}</p>

          <div className="yb-pd-stock">
            {outOfStock ? (
              <span className="badge badge-danger">Out of Stock</span>
            ) : (
              <span className="badge badge-ember">In Stock ({product.stock} available)</span>
            )}
          </div>

          {product.sizes?.length > 0 && (
            <div className="yb-filter-group">
              <h4>Size</h4>
              <div className="yb-chip-group">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    className={`yb-chip ${size === s ? "yb-chip-active" : ""}`}
                    onClick={() => setSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div className="yb-filter-group">
              <h4>Color</h4>
              <div className="yb-chip-group">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    className={`yb-chip ${color === c ? "yb-chip-active" : ""}`}
                    onClick={() => setColor(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="yb-filter-group">
            <h4>Quantity</h4>
            <div className="yb-qty-stepper">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}><FiMinus /></button>
              <span>{qty}</span>
              <button onClick={() => setQty((q) => Math.min(product.stock, q + 1))}><FiPlus /></button>
            </div>
          </div>

          <div className="yb-pd-actions">
            <button className="btn btn-outline" onClick={handleAddToCart} disabled={outOfStock}>
              Add to Cart
            </button>
            <button className="btn btn-primary" onClick={handleBuyNow} disabled={outOfStock}>
              Buy Now
            </button>
            <button
              className={`btn btn-dark yb-pd-wishlist ${isWishlisted ? "yb-wishlist-active" : ""}`}
              onClick={handleWishlist}
              aria-label="Add to wishlist"
            >
              <FiHeart />
            </button>
          </div>
        </div>
      </div>

      <div className="yb-pd-tabs">
        <div className="yb-pd-tab-heads">
          {TABS.map((t) => (
            <button
              key={t}
              className={`yb-pd-tab-head ${tab === t ? "yb-pd-tab-head-active" : ""}`}
              onClick={() => setTab(t)}
            >
              {t} {t === "Reviews" && `(${reviews.length})`}
            </button>
          ))}
        </div>

        <div className="yb-pd-tab-body">
          {tab === "Description" && <p>{product.description}</p>}

          {tab === "Specifications" && (
            <ul className="yb-spec-list">
              <li><span>Category</span><span>{product.category}</span></li>
              <li><span>Brand</span><span>{product.brand}</span></li>
              <li><span>Available Sizes</span><span>{product.sizes?.join(", ") || "One Size"}</span></li>
              <li><span>Available Colors</span><span>{product.colors?.join(", ") || "-"}</span></li>
            </ul>
          )}

          {tab === "Reviews" && (
            <div className="yb-reviews">
              {reviews.length === 0 ? (
                <p>No reviews yet. Be the first to review this product.</p>
              ) : (
                <div className="yb-review-list">
                  {reviews.map((r) => (
                    <div key={r._id} className="card yb-review-item">
                      <div className="yb-review-head">
                        <strong>{r.user?.name || "Rider"}</strong>
                        <StarRating rating={r.rating} />
                      </div>
                      <p>{r.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {isAuthenticated ? (
                <form className="yb-review-form" onSubmit={submitReview}>
                  <h4>Write a Review</h4>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <select
                      className="form-control"
                      value={reviewForm.rating}
                      onChange={(e) => setReviewForm((f) => ({ ...f, rating: Number(e.target.value) }))}
                    >
                      {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} Star{n > 1 && "s"}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Comment</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      required
                      value={reviewForm.comment}
                      onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                    />
                  </div>
                  <button className="btn btn-primary" disabled={submittingReview}>
                    {submittingReview ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <p><Link to="/login">Login</Link> to write a review.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="section-tight">
          <div className="section-head">
            <h2>Related Products</h2>
          </div>
          <div className="grid grid-4">
            {related.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
