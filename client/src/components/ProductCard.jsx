import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiHeart, FiShoppingBag } from "react-icons/fi";
import StarRating from "./StarRating.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import { addToCart } from "../redux/slices/cartSlice.js";
import { toggleWishlistItem } from "../redux/slices/wishlistSlice.js";
import useAuth from "../hooks/useAuth.js";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const isWishlisted = wishlistItems.some((p) => p._id === product._id);
  const outOfStock = product.stock <= 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    dispatch(
      addToCart({
        product: product._id,
        name: product.name,
        image: product.images?.[0],
        price: product.discountPrice || product.price,
        stock: product.stock,
        size: product.sizes?.[0] || "",
        color: product.colors?.[0] || "",
        quantity: 1,
      })
    );
    toast.success(`${product.name} added to cart`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please login to save items to your wishlist");
      return;
    }
    dispatch(toggleWishlistItem({ productId: product._id, isInWishlist: isWishlisted }));
  };

  return (
    <Link to={`/product/${product.slug || product._id}`} className="yb-product-card">
      <div className="yb-product-media">
        <img src={product.images?.[0]} alt={product.name} loading="lazy" />
        <button
          className={`yb-wishlist-btn ${isWishlisted ? "yb-wishlist-active" : ""}`}
          onClick={handleWishlist}
          aria-label="Toggle wishlist"
        >
          <FiHeart />
        </button>
        <div className="yb-product-badges">
          {product.isNew && <span className="badge badge-ember">New</span>}
          {product.discountPrice && <span className="badge badge-danger">Sale</span>}
          {outOfStock && <span className="badge badge-steel">Out of Stock</span>}
        </div>
      </div>
      <div className="yb-product-info">
        <span className="yb-product-category">{product.category}</span>
        <h3 className="yb-product-name">{product.name}</h3>
        <StarRating rating={product.rating} count={product.numReviews} />
        <div className="yb-product-price-row">
          <div>
            {product.discountPrice ? (
              <>
                <span className="yb-price-now">{formatCurrency(product.discountPrice)}</span>
                <span className="yb-price-was">{formatCurrency(product.price)}</span>
              </>
            ) : (
              <span className="yb-price-now">{formatCurrency(product.price)}</span>
            )}
          </div>
          <button
            className="yb-icon-btn yb-cart-quick-btn"
            onClick={handleAddToCart}
            disabled={outOfStock}
            aria-label="Add to cart"
          >
            <FiShoppingBag />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
