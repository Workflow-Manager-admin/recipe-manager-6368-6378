import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Signup() {
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { name, email, password } = form;
    if (!name || !email || !password) {
      setError("All fields are required.");
      setLoading(false);
      return;
    }
    const res = await signup(name, email, password);
    if (res.success) {
      navigate("/");
    } else {
      setError(res.error || "Failed to signup.");
    }
    setLoading(false);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
      <div className="auth-form-title">Sign Up</div>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={form.name}
        onChange={handleChange}
        autoFocus
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      {error && <div className="form-error">{error}</div>}
      <input type="submit" className="btn" value={loading ? "Signing up…" : "Sign up"} disabled={loading}/>
      <div style={{marginTop:"1rem", textAlign: "center"}}>
        Already have an account? <Link to="/login">Log in</Link>
      </div>
    </form>
  );
}
