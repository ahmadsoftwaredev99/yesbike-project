import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FiTrash2, FiShoppingBag } from "react-icons/fi";
import { fetchWishlist, toggleWishlistItem } from "../redux/slices/wishlistSlice.js";
import { addToCart } from "../redux/slices/cartSlice.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import "./Wishlist.css";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const handleMoveToCart = (product) => {
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
    dispatch(toggleWishlistItem({ productId: product._id, isInWishlist: true }));
    toast.success(`${product.name} moved to cart`);
  };

  if (loading) return <div className="container" style={{ padding: 60 }}><LoadingSpinner /></div>;

  return (
    <div className="container yb-wishlist-page">
      <div className="section-head">
        <h1>My Wishlist</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState
          title="Your wishlist is empty"
          message="Save products you like to find them here later."
          action={<Link to="/shop" className="btn btn-primary">Browse Products</Link>}
        />
      ) : (
        <div className="yb-wishlist-list">
          {items.map((p) => (
            <div key={p._id} className="card yb-wishlist-row">
              <Link to={`/product/${p.slug || p._id}`}>
                <img src={p.images?.[0]} alt={p.name} />
              </Link>
              <div className="yb-wishlist-info">
                <Link to={`/product/${p.slug || p._id}`}><h4>{p.name}</h4></Link>
                <span className="yb-product-category">{p.category}</span>
                <span className="yb-price-now">{formatCurrency(p.discountPrice || p.price)}</span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={() => handleMoveToCart(p)} disabled={p.stock <= 0}>
                <FiShoppingBag /> Move to Cart
              </button>
              <button
                className="yb-icon-btn"
                aria-label="Remove from wishlist"
                onClick={() => dispatch(toggleWishlistItem({ productId: p._id, isInWishlist: true }))}
              >
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
