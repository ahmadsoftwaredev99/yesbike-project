import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import EmptyState from "../components/EmptyState.jsx";
import { formatCurrency } from "../utils/formatCurrency.js";
import { increaseQty, decreaseQty, removeFromCart, clearCart, cartLineKey } from "../redux/slices/cartSlice.js";
import "./Cart.css";

const FREE_SHIPPING_THRESHOLD = 1500;
const SHIPPING_FLAT_RATE = 100;

const Cart = () => {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = items.length === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="container yb-cart-page">
        <EmptyState
          title="Your cart is empty"
          message="Add some gear to get started."
          action={<Link to="/shop" className="btn btn-primary">Shop Now</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container yb-cart-page">
      <div className="section-head">
        <h1>Your Cart</h1>
        <button className="btn btn-dark btn-sm" onClick={() => dispatch(clearCart())}>Clear Cart</button>
      </div>

      <div className="yb-cart-layout">
        <div className="yb-cart-items">
          {items.map((item) => {
            const key = cartLineKey(item);
            return (
              <div key={key} className="card yb-cart-item">
                <img src={item.image} alt={item.name} />
                <div className="yb-cart-item-info">
                  <h4>{item.name}</h4>
                  <p className="yb-cart-item-meta">
                    {item.size && `Size: ${item.size}`} {item.color && `· Color: ${item.color}`}
                  </p>
                  <span className="yb-price-now">{formatCurrency(item.price)}</span>
                </div>
                <div className="yb-qty-stepper">
                  <button onClick={() => dispatch(decreaseQty(key))}><FiMinus /></button>
                  <span>{item.quantity}</span>
                  <button onClick={() => dispatch(increaseQty(key))}><FiPlus /></button>
                </div>
                <div className="yb-cart-item-total">{formatCurrency(item.price * item.quantity)}</div>
                <button
                  className="yb-icon-btn"
                  aria-label="Remove item"
                  onClick={() => dispatch(removeFromCart(key))}
                >
                  <FiTrash2 />
                </button>
              </div>
            );
          })}
        </div>

        <div className="card yb-cart-summary">
          <h3>Order Summary</h3>
          <div className="yb-summary-row"><span>Subtotal</span><span>{formatCurrency(subtotal)}</span></div>
          <div className="yb-summary-row">
            <span>Shipping</span>
            <span>{shipping === 0 ? "Free" : formatCurrency(shipping)}</span>
          </div>
          {shipping > 0 && (
            <p className="yb-shipping-note">
              Add {formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)} more for free shipping.
            </p>
          )}
          <div className="yb-summary-row yb-summary-total"><span>Total</span><span>{formatCurrency(total)}</span></div>
          <Link to="/checkout" className="btn btn-primary btn-block">Proceed to Checkout</Link>
          <Link to="/shop" className="btn btn-outline btn-block yb-continue-shopping">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
