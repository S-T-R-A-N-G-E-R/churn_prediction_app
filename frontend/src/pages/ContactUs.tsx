import React, { useState } from "react";
import axios from "axios";

const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [statusMsg, setStatusMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatusMsg("");
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/contact`, formData);
      setStatusMsg("Thank you! Your message has been received.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatusMsg("Failed to send message. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 flex justify-center bg-gradient-to-br from-blue-50 via-cyan-100 to-violet-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="glass-card max-w-xl w-full p-8 rounded-3xl backdrop-blur-md bg-white/30 border border-white/30"
      >
        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-fuchsia-600 bg-clip-text text-transparent text-center">
          Contact Us
        </h2>
        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Your Name"
          className="glass-input mb-4"
        />
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          placeholder="Your Email"
          className="glass-input mb-4"
        />
        <input
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          placeholder="Subject"
          className="glass-input mb-4"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          required
          placeholder="Your Message"
          className="glass-input mb-4 resize-none"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-fuchsia-500 to-blue-500 text-white py-3 rounded-xl hover:shadow-lg transition disabled:opacity-50"
        >
          Send Message
        </button>
        {statusMsg && <p className="mt-4 text-center">{statusMsg}</p>}
      </form>
    </div>
  );
};

export default ContactUs;
