import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header" role="banner">
      <NavLink to="/" className="logo" tabIndex={0}>RecipeApp</NavLink>
      <nav className="header-nav" aria-label="Main Navigation">
        <NavLink end to="/" className={({isActive}) => (isActive ? "header-link active" : "header-link")}>Browse</NavLink>
        {user && <NavLink to="/favorites" className={({isActive}) => (isActive ? "header-link active" : "header-link")}>Favorites</NavLink>}
      </nav>
      <div className="user-actions" aria-label="Account menu">
        {user ? (
          <>
            <span style={{paddingRight: "7px"}}>Hi, {user.name ? user.name.split(' ')[0] : user.email}</span>
            <button className="btn outline small" onClick={handleLogout} tabIndex={0}>Logout</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className="btn small" style={{marginRight: '0.6em'}}>Login</NavLink>
            <NavLink to="/signup" className="btn outline small">Signup</NavLink>
          </>
        )}
      </div>
    </header>
  );
}
