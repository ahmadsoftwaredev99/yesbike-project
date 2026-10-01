import { useState } from "react";
import { toast } from "react-toastify";
import { FiPhone, FiMail, FiMapPin, FiClock } from "react-icons/fi";
import api from "../services/api.js";
import "./Contact.css";

const initialForm = { name: "", email: "", phone: "", subject: "", message: "" };

const Contact = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "A valid email is required";
    if (!form.subject.trim()) next.subject = "Subject is required";
    if (!form.message.trim()) next.message = "Message is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await api.post("/contacts", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      toast.success(
        res.data?.message || "Thank you! Your message has been sent successfully."
      );
      setForm(initialForm);
      setErrors({});
    } catch (err) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container yb-contact">
      <div className="section-head">
        <h1>Contact Us</h1>
        <p>Questions about sizing, stock or an order? Reach out.</p>
      </div>

      <div className="yb-contact-grid">
        <form className="card yb-contact-form" onSubmit={handleSubmit} noValidate>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              />
              {errors.email && <div className="form-error">{errors.email}</div>}
            </div>
          </div>
          <div className="grid grid-2">
            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                value={form.phone}
                onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                className="form-control"
                value={form.subject}
                onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
              />
              {errors.subject && <div className="form-error">{errors.subject}</div>}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              className="form-control"
              rows={5}
              value={form.message}
              onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            />
            {errors.message && <div className="form-error">{errors.message}</div>}
          </div>
          <button
            className="btn btn-primary btn-block"
            type="submit"
            disabled={loading}
          >
            {loading ? "Sending Message..." : "Send Message"}
          </button>
        </form>

        <div className="yb-contact-details">
          <div className="card yb-contact-block">
            <h3><FiPhone /> Phone</h3>
            <p><a href="tel:0825351244">082 535 1244</a></p>
            <p><a href="tel:0832966806">083 296 6806</a></p>
          </div>
          <div className="card yb-contact-block">
            <h3><FiMail /> Email</h3>
            <p><a href="mailto:ar_leather@telkomsa.net">ar_leather@telkomsa.net</a></p>
          </div>
          <div className="card yb-contact-block">
            <h3><FiMapPin /> Locations</h3>
            <p>Panorama I-20 - I-22</p>
            <p>Boksburg C29 - C56</p>
            <p>A95 - A96 - B17</p>
            <p>Montana D23 - D24</p>
          </div>
          <div className="card yb-contact-block">
            <h3><FiClock /> Business Hours</h3>
            <p>Please call or email ahead to confirm hours at your nearest location.</p>
          </div>
        </div>
      </div>

      <div className="card yb-map-placeholder">
        <p>Map view coming soon. Please use the contact details above to find your nearest location.</p>
      </div>
    </div>
  );
};

export default Contact;
