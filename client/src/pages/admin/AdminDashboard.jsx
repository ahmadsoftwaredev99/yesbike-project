import { useEffect, useState } from "react";
import { FiDollarSign, FiShoppingBag, FiBox, FiUsers, FiClock, FiCheckCircle } from "react-icons/fi";
import api from "../../services/api.js";
import { formatCurrency } from "../../utils/formatCurrency.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/admin/stats")
      .then((res) => setStats(res.data.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!stats) return <p>Could not load dashboard statistics.</p>;

  const cards = [
    { label: "Total Sales", value: formatCurrency(stats.totalSales), icon: <FiDollarSign /> },
    { label: "Total Orders", value: stats.totalOrders, icon: <FiShoppingBag /> },
    { label: "Total Products", value: stats.totalProducts, icon: <FiBox /> },
    { label: "Total Users", value: stats.totalUsers, icon: <FiUsers /> },
    { label: "Pending Orders", value: stats.pendingOrders, icon: <FiClock /> },
    { label: "Delivered Orders", value: stats.deliveredOrders, icon: <FiCheckCircle /> },
  ];

  return (
    <div>
      <div className="section-head">
        <h1>Dashboard</h1>
      </div>
      <div className="grid grid-3 yb-stat-grid">
        {cards.map((c) => (
          <div key={c.label} className="card yb-stat-card">
            <div className="yb-stat-icon">{c.icon}</div>
            <div>
              <span className="yb-stat-value">{c.value}</span>
              <span className="yb-stat-label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
