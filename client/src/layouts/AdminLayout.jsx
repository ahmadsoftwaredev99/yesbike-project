import { NavLink, Outlet, Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import {
  FiGrid,
  FiBox,
  FiShoppingCart,
  FiUsers,
  FiMail,
  FiArrowLeftCircle,
  FiLogOut,
} from "react-icons/fi";
import { logout } from "../redux/slices/authSlice.js";
import { clearWishlistState } from "../redux/slices/wishlistSlice.js";
import "react-toastify/dist/ReactToastify.css";
import "./AdminLayout.css";

const links = [
  { to: "/admin", label: "Dashboard", icon: <FiGrid />, end: true },
  { to: "/admin/products", label: "Products", icon: <FiBox /> },
  { to: "/admin/orders", label: "Orders", icon: <FiShoppingCart /> },
  { to: "/admin/users", label: "Users", icon: <FiUsers /> },
  { to: "/admin/contacts", label: "Messages", icon: <FiMail /> },
];

const AdminLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWishlistState());
    navigate("/login", { replace: true });
  };

  return (
    <div className="yb-admin-shell">
      <aside className="yb-admin-sidebar">
        <div className="yb-admin-brand">
          <span>YES</span>
          <span className="yb-brand-mark-accent">BIKE</span>
          <span className="yb-admin-tag">Admin</span>
        </div>
        <nav className="yb-admin-nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `yb-admin-nav-link ${isActive ? "yb-admin-nav-link-active" : ""}`
              }
            >
              {link.icon} {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="yb-admin-sidebar-footer">
          <Link to="/" className="yb-admin-nav-link yb-admin-exit">
            <FiArrowLeftCircle /> Back to Store
          </Link>
          <button
            type="button"
            className="yb-admin-nav-link yb-admin-logout"
            onClick={handleLogout}
            title="Sign out of Admin Dashboard"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </aside>
      <div className="yb-admin-content">
        <Outlet />
      </div>
      <ToastContainer theme="dark" position="top-right" autoClose={2500} />
    </div>
  );
};

export default AdminLayout;
