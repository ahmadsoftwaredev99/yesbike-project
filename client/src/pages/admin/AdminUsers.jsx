import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FiTrash2 } from "react-icons/fi";
import api from "../../services/api.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import useAuth from "../../hooks/useAuth.js";
import "./AdminProducts.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  const loadUsers = () => {
    setLoading(true);
    api.get("/users").then((res) => setUsers(res.data.data)).finally(() => setLoading(false));
  };

  useEffect(() => { loadUsers(); }, []);

  const changeRole = async (id, role) => {
    try {
      await api.put(`/users/${id}`, { role });
      setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role } : u)));
      toast.success("Role updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User removed");
    } catch (err) {
      toast.error(err.message);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div className="section-head">
        <h1>Users</h1>
      </div>
      <div className="yb-table-wrap">
        <table className="yb-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th></th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  <select
                    className="form-control"
                    style={{ padding: "6px 10px", fontSize: "0.85rem" }}
                    value={u.role}
                    onChange={(e) => changeRole(u._id, e.target.value)}
                    disabled={u._id === currentUser?._id}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>{new Date(u.createdAt).toLocaleDateString("en-ZA")}</td>
                <td>
                  <button
                    className="yb-icon-btn"
                    onClick={() => deleteUser(u._id)}
                    disabled={u._id === currentUser?._id}
                  >
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
