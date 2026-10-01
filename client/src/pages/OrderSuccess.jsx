import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiCheckCircle } from "react-icons/fi";
import { fetchOrderById } from "../redux/slices/orderSlice.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import "./OrderSuccess.css";

const OrderSuccess = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const order = useSelector((state) => state.orders.current);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (!order) return <div className="container" style={{ padding: 60 }}><LoadingSpinner /></div>;

  return (
    <div className="container yb-order-success">
      <div className="card yb-success-card">
        <FiCheckCircle className="yb-success-icon" />
        <h1>Order Placed Successfully</h1>
        <p>Thank you, your order has been received. Order ID: <strong>{order._id}</strong></p>

        <div className="yb-success-summary">
          {order.orderItems.map((item) => (
            <div key={item.product} className="yb-checkout-line">
              <span>{item.name} x{item.quantity}</span>
              <span>{formatCurrency(item.price * item.quantity)}</span>
            </div>
          ))}
          <div className="yb-summary-row yb-summary-total">
            <span>Total</span><span>{formatCurrency(order.totalPrice)}</span>
          </div>
        </div>

        <div className="yb-success-actions">
          <Link to="/orders" className="btn btn-primary">View My Orders</Link>
          <Link to="/shop" className="btn btn-outline">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
