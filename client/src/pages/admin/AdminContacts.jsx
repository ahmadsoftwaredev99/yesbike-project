import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  FiMail,
  FiEye,
  FiTrash2,
  FiX,
  FiSearch,
  FiCheckCircle,
  FiClock,
  FiUser,
  FiPhone,
  FiMessageSquare,
} from "react-icons/fi";
import api from "../../services/api.js";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import EmptyState from "../../components/EmptyState.jsx";
import "./AdminProducts.css";

const STATUSES = ["New", "Read", "Replied"];

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);

  const loadContacts = () => {
    setLoading(true);
    api
      .get("/contacts")
      .then((res) => setContacts(res.data.data || []))
      .catch((err) => toast.error(err.message || "Failed to load messages"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      setStatusUpdating(true);
      const res = await api.put(`/contacts/${id}/status`, { status: newStatus });
      setContacts((prev) =>
        prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
      );
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(res.data.data || { ...selectedMessage, status: newStatus });
      }
      toast.success(`Marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleViewMessage = (contact) => {
    setSelectedMessage(contact);
    // If the message is currently 'New', automatically update it to 'Read' on opening
    if (contact.status === "New") {
      api
        .put(`/contacts/${contact._id}/status`, { status: "Read" })
        .then(() => {
          setContacts((prev) =>
            prev.map((c) => (c._id === contact._id ? { ...c, status: "Read" } : c))
          );
          setSelectedMessage((prev) => (prev ? { ...prev, status: "Read" } : prev));
        })
        .catch(() => {});
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contact submission? This cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/contacts/${id}`);
      setContacts((prev) => prev.filter((c) => c._id !== id));
      if (selectedMessage && selectedMessage._id === id) {
        setSelectedMessage(null);
      }
      toast.success("Contact message deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete message");
    }
  };

  // Filter messages based on active status filter and search query
  const filteredContacts = contacts.filter((c) => {
    const matchesStatus =
      activeFilter === "All" ? true : c.status === activeFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const countNew = contacts.filter((c) => c.status === "New").length;
  const countRead = contacts.filter((c) => c.status === "Read").length;
  const countReplied = contacts.filter((c) => c.status === "Replied").length;

  return (
    <div>
      <div className="section-head">
        <div>
          <h1>Contact Messages</h1>
          <p>Customer inquiries, sizing questions, and feedback from the Contact Us form.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "16px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            type="button"
            className={`btn btn-sm ${activeFilter === "All" ? "btn-primary" : "btn-dark"}`}
            onClick={() => setActiveFilter("All")}
          >
            All ({contacts.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeFilter === "New" ? "btn-primary" : "btn-dark"}`}
            onClick={() => setActiveFilter("New")}
          >
            New ({countNew})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeFilter === "Read" ? "btn-primary" : "btn-dark"}`}
            onClick={() => setActiveFilter("Read")}
          >
            Read ({countRead})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${activeFilter === "Replied" ? "btn-primary" : "btn-dark"}`}
            onClick={() => setActiveFilter("Replied")}
          >
            Replied ({countReplied})
          </button>
        </div>

        <div
          className="yb-search"
          style={{ minWidth: "260px", maxWidth: "340px", flex: 1 }}
        >
          <FiSearch />
          <input
            type="search"
            placeholder="Search by name, email, subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search contact messages"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filteredContacts.length === 0 ? (
        <EmptyState
          title="No contact messages found"
          message={
            contacts.length === 0
              ? "No messages have been submitted through the Contact Us form yet."
              : "No messages match your selected filter or search query."
          }
        />
      ) : (
        <div className="yb-table-wrap">
          <table className="yb-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Message Preview</th>
                <th>Status</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.map((c) => {
                const dateObj = new Date(c.createdAt);
                const dateStr = dateObj.toLocaleDateString("en-ZA");
                const timeStr = dateObj.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <tr
                    key={c._id}
                    style={{
                      background:
                        c.status === "New" ? "rgba(217, 104, 43, 0.04)" : "transparent",
                    }}
                  >
                    <td style={{ whiteSpace: "nowrap" }}>
                      <div style={{ fontWeight: 500 }}>{dateStr}</div>
                      <div style={{ color: "var(--steel)", fontSize: "0.78rem" }}>
                        {timeStr}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{c.name}</div>
                      <div style={{ color: "var(--steel)", fontSize: "0.82rem" }}>
                        <a
                          href={`mailto:${c.email}`}
                          style={{ color: "inherit", textDecoration: "underline" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {c.email}
                        </a>
                      </div>
                      {c.phone && (
                        <div style={{ color: "var(--steel)", fontSize: "0.78rem" }}>
                          Tel: {c.phone}
                        </div>
                      )}
                    </td>
                    <td style={{ maxWidth: "200px" }}>
                      <span style={{ fontWeight: 500 }}>{c.subject}</span>
                    </td>
                    <td
                      style={{
                        maxWidth: "260px",
                        color: "var(--paper-dim)",
                        fontSize: "0.86rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={c.message}
                    >
                      {c.message}
                    </td>
                    <td>
                      <select
                        className="form-control"
                        style={{
                          padding: "6px 10px",
                          fontSize: "0.84rem",
                          width: "110px",
                          borderColor:
                            c.status === "New"
                              ? "var(--ember)"
                              : c.status === "Replied"
                              ? "var(--success)"
                              : "var(--line)",
                        }}
                        value={c.status}
                        onChange={(e) => handleUpdateStatus(c._id, e.target.value)}
                        disabled={statusUpdating}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <div
                        className="yb-table-actions"
                        style={{ justifyContent: "flex-end" }}
                      >
                        <button
                          type="button"
                          className="yb-icon-btn"
                          title="View complete message"
                          onClick={() => handleViewMessage(c)}
                        >
                          <FiEye />
                        </button>
                        <button
                          type="button"
                          className="yb-icon-btn"
                          title="Delete message"
                          onClick={() => handleDelete(c._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Complete Message View Modal */}
      {selectedMessage && (
        <div
          className="yb-modal-overlay"
          onClick={() => setSelectedMessage(null)}
        >
          <div
            className="card yb-modal"
            style={{ maxWidth: "620px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="yb-modal-head">
              <h3 style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <FiMail style={{ color: "var(--ember)" }} />
                <span>Message Details</span>
              </h3>
              <button
                type="button"
                className="yb-icon-btn"
                onClick={() => setSelectedMessage(null)}
                aria-label="Close dialog"
              >
                <FiX />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Metadata Cards */}
              <div
                style={{
                  background: "var(--surface-alt)",
                  padding: "16px",
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--line)",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "12px",
                }}
              >
                <div>
                  <div className="form-label" style={{ marginBottom: "2px" }}>
                    <FiUser style={{ verticalAlign: "middle", marginRight: "4px" }} />
                    Sender Name
                  </div>
                  <div style={{ fontWeight: 600 }}>{selectedMessage.name}</div>
                </div>

                <div>
                  <div className="form-label" style={{ marginBottom: "2px" }}>
                    <FiMail style={{ verticalAlign: "middle", marginRight: "4px" }} />
                    Email
                  </div>
                  <div>
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject
                      )}`}
                      style={{ color: "var(--ember-bright)", textDecoration: "underline" }}
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                </div>

                <div>
                  <div className="form-label" style={{ marginBottom: "2px" }}>
                    <FiPhone style={{ verticalAlign: "middle", marginRight: "4px" }} />
                    Phone
                  </div>
                  <div>
                    {selectedMessage.phone ? (
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        style={{ color: "var(--paper)" }}
                      >
                        {selectedMessage.phone}
                      </a>
                    ) : (
                      <span style={{ color: "var(--steel)" }}>Not provided</span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="form-label" style={{ marginBottom: "2px" }}>
                    <FiClock style={{ verticalAlign: "middle", marginRight: "4px" }} />
                    Submitted At
                  </div>
                  <div style={{ fontSize: "0.88rem" }}>
                    {new Date(selectedMessage.createdAt).toLocaleString("en-ZA")}
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div>
                <div className="form-label">Subject</div>
                <div
                  style={{
                    background: "var(--surface-alt)",
                    padding: "10px 14px",
                    borderRadius: "var(--radius)",
                    fontWeight: 600,
                    border: "1px solid var(--line)",
                  }}
                >
                  {selectedMessage.subject}
                </div>
              </div>

              {/* Full Message Body */}
              <div>
                <div className="form-label">
                  <FiMessageSquare
                    style={{ verticalAlign: "middle", marginRight: "4px" }}
                  />
                  Message
                </div>
                <div
                  style={{
                    background: "var(--surface-alt)",
                    padding: "16px",
                    borderRadius: "var(--radius)",
                    border: "1px solid var(--line)",
                    whiteSpace: "pre-wrap",
                    lineHeight: "1.6",
                    fontSize: "0.95rem",
                    color: "var(--paper)",
                    minHeight: "120px",
                    maxHeight: "320px",
                    overflowY: "auto",
                  }}
                >
                  {selectedMessage.message}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "8px",
                  gap: "12px",
                  flexWrap: "wrap",
                  borderTop: "1px solid var(--line)",
                  paddingTop: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <label className="form-label" style={{ margin: 0 }}>
                    Status:
                  </label>
                  <select
                    className="form-control"
                    style={{ width: "120px", padding: "6px 10px" }}
                    value={selectedMessage.status}
                    onChange={(e) =>
                      handleUpdateStatus(selectedMessage._id, e.target.value)
                    }
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                      selectedMessage.subject
                    )}`}
                    className="btn btn-primary btn-sm"
                    onClick={() => handleUpdateStatus(selectedMessage._id, "Replied")}
                  >
                    <FiMail /> Reply via Email
                  </a>
                  <button
                    type="button"
                    className="btn btn-dark btn-sm"
                    style={{ color: "var(--danger)", borderColor: "rgba(225, 75, 75, 0.4)" }}
                    onClick={() => handleDelete(selectedMessage._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
