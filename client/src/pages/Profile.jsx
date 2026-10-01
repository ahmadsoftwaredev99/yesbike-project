import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FiLogOut } from "react-icons/fi";
import { fetchProfile, updateProfile, logout } from "../redux/slices/authSlice.js";
import { clearWishlistState } from "../redux/slices/wishlistSlice.js";
import "./Profile.css";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    password: "",
    address: {
      street: user?.address?.street || "",
      city: user?.address?.city || "",
      state: user?.address?.state || "",
      country: user?.address?.country || "",
      postalCode: user?.address?.postalCode || "",
    },
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || "",
        phone: user.phone || "",
        address: { ...f.address, ...(user.address || {}) },
      }));
    }
  }, [user?.name, user?.phone]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { name: form.name, phone: form.phone, address: form.address };
    if (form.password) payload.password = form.password;
    const result = await dispatch(updateProfile(payload));
    if (updateProfile.fulfilled.match(result)) {
      toast.success("Profile updated");
      setForm((f) => ({ ...f, password: "" }));
    } else {
      toast.error(result.payload || "Could not update profile");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWishlistState());
    navigate("/login", { replace: true });
  };

  return (
    <div className="container yb-profile-page">
      <div className="section-head">
        <div>
          <h1>My Profile</h1>
          <p>Manage your account details and delivery address.</p>
        </div>
        <button
          type="button"
          className="btn btn-outline btn-sm"
          style={{ color: "#ff8080", borderColor: "rgba(225, 75, 75, 0.4)" }}
          onClick={handleLogout}
        >
          <FiLogOut /> Logout
        </button>
      </div>

      <form className="card yb-profile-form" onSubmit={handleSubmit}>
        <h3>Account Details</h3>
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-control" value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Email (read-only)</label>
            <input className="form-control" value={user?.email || ""} disabled />
          </div>
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-control" value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">New Password (optional)</label>
            <input type="password" className="form-control" placeholder="Leave blank to keep current"
              value={form.password}
              onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} />
          </div>
        </div>

        <h3>Address</h3>
        <div className="form-group">
          <label className="form-label">Street</label>
          <input className="form-control" value={form.address.street}
            onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, street: e.target.value } }))} />
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">City</label>
            <input className="form-control" value={form.address.city}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))} />
          </div>
          <div className="form-group">
            <label className="form-label">State / Province</label>
            <input className="form-control" value={form.address.state}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, state: e.target.value } }))} />
          </div>
        </div>
        <div className="grid grid-2">
          <div className="form-group">
            <label className="form-label">Country</label>
            <input className="form-control" value={form.address.country}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, country: e.target.value } }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Postal Code</label>
            <input className="form-control" value={form.address.postalCode}
              onChange={(e) => setForm((f) => ({ ...f, address: { ...f.address, postalCode: e.target.value } }))} />
          </div>
        </div>

        <button className="btn btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
