import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiSearch,
  FiHeart,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiLogOut,
  FiShield,
  FiPackage,
} from "react-icons/fi";
import useAuth from "../hooks/useAuth.js";
import { logout } from "../redux/slices/authSlice.js";
import { clearWishlistState } from "../redux/slices/wishlistSlice.js";
import "./Navbar.css";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/shop" },
  { label: "Categories", path: "/categories" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const userMenuRef = useRef(null);

  const cartCount = useSelector((state) =>
    state.cart.items.reduce((n, i) => n + i.quantity, 0)
  );
  const { isAuthenticated, isAdmin, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close account dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWishlistState());
    setUserMenuOpen(false);
    setOpen(false);
    navigate("/login", { replace: true });
  };

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(
      query.trim() ? `/shop?keyword=${encodeURIComponent(query.trim())}` : "/shop"
    );
    setOpen(false);
  };

  return (
    <header className="yb-navbar">
      <div className="container yb-navbar-inner">
        <Link to="/" className="yb-brand" onClick={() => setOpen(false)}>
          <span className="yb-brand-mark">YES</span>
          <span className="yb-brand-mark yb-brand-mark-accent">BIKE</span>
        </Link>

        <nav className={`yb-nav-links ${open ? "yb-nav-links-open" : ""}`}>
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setOpen(false)}>
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setOpen(false)}
              className="yb-admin-link"
            >
              Admin Dashboard
            </Link>
          )}

          <form className="yb-search yb-search-mobile" onSubmit={submitSearch}>
            <FiSearch />
            <input
              type="search"
              placeholder="Search gear..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </form>

          <div className="yb-nav-mobile-actions">
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)}>
                  My Profile
                </Link>
                <Link to="/orders" onClick={() => setOpen(false)}>
                  My Orders
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)} className="yb-admin-link">
                    Admin Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  className="yb-link-btn"
                  style={{ color: "#ff8080", display: "flex", alignItems: "center", gap: "6px" }}
                  onClick={handleLogout}
                >
                  <FiLogOut /> Logout ({user?.name?.split(" ")[0]})
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="yb-navbar-actions">
          <form className="yb-search" onSubmit={submitSearch}>
            <FiSearch />
            <input
              type="search"
              placeholder="Search gear..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search products"
            />
          </form>

          <Link to="/wishlist" className="yb-icon-btn" aria-label="Wishlist">
            <FiHeart />
          </Link>

          <Link to="/cart" className="yb-icon-btn" aria-label="Cart">
            <FiShoppingBag />
            {cartCount > 0 && <span className="yb-cart-count">{cartCount}</span>}
          </Link>

          {/* User Account / Dropdown */}
          {isAuthenticated ? (
            <div className="yb-user-menu" ref={userMenuRef}>
              <button
                type="button"
                className={`yb-icon-btn ${userMenuOpen ? "yb-icon-btn-active" : ""}`}
                aria-label="User Account Menu"
                aria-expanded={userMenuOpen}
                onClick={() => setUserMenuOpen((prev) => !prev)}
                title={user?.name || "Account"}
              >
                <FiUser />
              </button>

              {userMenuOpen && (
                <div className="yb-user-dropdown">
                  <div className="yb-user-dropdown-header">
                    <div className="yb-user-dropdown-name">{user?.name}</div>
                    <div className="yb-user-dropdown-email">{user?.email}</div>
                  </div>

                  <Link
                    to="/profile"
                    className="yb-user-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiUser /> My Profile
                  </Link>

                  <Link
                    to="/orders"
                    className="yb-user-dropdown-item"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    <FiPackage /> My Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="yb-user-dropdown-item"
                      style={{ color: "var(--ember-bright)" }}
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <FiShield /> Admin Dashboard
                    </Link>
                  )}

                  <button
                    type="button"
                    className="yb-user-dropdown-item yb-user-logout"
                    onClick={handleLogout}
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="yb-icon-btn" aria-label="Login">
              <FiUser />
            </Link>
          )}

          <button
            type="button"
            className="yb-icon-btn yb-hamburger"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
