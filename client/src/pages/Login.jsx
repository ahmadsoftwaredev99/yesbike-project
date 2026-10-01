import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { login, clearAuthError } from "../redux/slices/authSlice.js";
import "./Auth.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) navigate(location.state?.from?.pathname || "/");
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (error) toast.error(error);
    return () => dispatch(clearAuthError());
  }, [error]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(form));
  };

  return (
    <div className="yb-auth-page">
      <form className="card yb-auth-card" onSubmit={handleSubmit}>
        <h1>Welcome Back</h1>
        <p>Login to your Yes Bike account.</p>

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            required
            className="form-control"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            required
            className="form-control"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          />
        </div>

        <button className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="yb-auth-switch">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
