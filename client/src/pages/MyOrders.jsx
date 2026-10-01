import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../redux/slices/orderSlice.js";
import { formatCurrency } from "../utils/formatCurrency.js";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import EmptyState from "../components/EmptyState.jsx";
import "./MyOrders.css";

const statusClass = (status) => {
  if (status === "Delivered") return "badge-ember";
  if (status === "Cancelled") return "badge-danger";
  return "badge-steel";
};

const MyOrders = () => {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <div className="container" style={{ padding: 60 }}><LoadingSpinner /></div>;

  return (
    <div className="container yb-orders-page">
      <div className="section-head">
        <h1>My Orders</h1>
      </div>

      {myOrders.length === 0 ? (
        <EmptyState
          title="No orders yet"
          message="Your placed orders will appear here."
          action={<Link to="/shop" className="btn btn-primary">Start Shopping</Link>}
        />
      ) : (
        <div className="yb-orders-list">
          {myOrders.map((order) => (
            <Link key={order._id} to={`/order-success/${order._id}`} className="card yb-order-row">
              <div>
                <span className="yb-order-id">#{order._id.slice(-8).toUpperCase()}</span>
                <span className="yb-order-date">
                  {new Date(order.createdAt).toLocaleDateString("en-ZA", { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              <span>{order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}</span>
              <span className="yb-price-now">{formatCurrency(order.totalPrice)}</span>
              <span className={`badge ${statusClass(order.orderStatus)}`}>{order.orderStatus}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
