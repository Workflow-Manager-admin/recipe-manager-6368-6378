import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
    const { email, password } = form;
    if (!email || !password) {
      setError("Both fields are required.");
      setLoading(false);
      return;
    }
    const res = await login(email, password);
    if (res.success) {
      navigate("/");
    } else {
      setError(res.error || "Failed to login.");
    }
    setLoading(false);
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
      <div className="auth-form-title">Log In</div>
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        autoFocus
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      {error && <div className="form-error">{error}</div>}
      <input type="submit" className="btn" value={loading ? "Logging in…" : "Log in"} disabled={loading}/>
      <div style={{marginTop:"1rem", textAlign: "center"}}>
        New user? <Link to="/signup">Create account</Link>
      </div>
    </form>
  );
}
