import React, { createContext, useContext, useState, useEffect } from "react";

// PUBLIC_INTERFACE
export const AuthContext = createContext(null);

// PUBLIC_INTERFACE
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * AuthProvider
 * Provides user authentication state, login, signup, logout and checks.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { token, email, favorites: [] }

  // On mount: check localStorage for existing login
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      setUser({ ...JSON.parse(userData), token });
    }
  }, []);

  // Login
  // Returns: {success: boolean, user: Object, error: string}
  // PUBLIC_INTERFACE
  async function login(email, password) {
    try {
      // Use env variable for backend URL
      const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser({ ...data.user, token: data.token });
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || "Login failed" };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  // Signup
  // PUBLIC_INTERFACE
  async function signup(name, email, password) {
    try {
      const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser({ ...data.user, token: data.token });
        return { success: true, user: data.user };
      }
      return { success: false, error: data.message || "Signup failed" };
    } catch (e) {
      return { success: false, error: String(e) };
    }
  }

  // Logout
  // PUBLIC_INTERFACE
  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const value = { user, login, signup, logout, setUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
