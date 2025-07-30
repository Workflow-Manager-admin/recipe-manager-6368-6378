import React, { useEffect } from "react";
import "./App.css";
import { themeVars } from "./theme";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import RecipeList from "./components/RecipeList";
import RecipeDetails from "./components/RecipeDetails";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Favorites from "./components/Favorites";

/** PUBLIC_INTERFACE
 * Main App entrypoint. Provides routes for:
 *  - '/' Recipe Browsing/Search
 *  - '/recipes/:id' Recipe Details
 *  - '/login', '/signup' Auth
 *  - '/favorites' User favorites
 */
function AppRoutes() {
  useEffect(() => {
    // Inject theme root CSS vars when mounted
    let style = document.createElement("style");
    style.id = "theme-vars";
    style.innerHTML = themeVars;
    document.head.appendChild(style);
    return () => {
      if (document.getElementById("theme-vars")) {
        document.head.removeChild(style);
      }
    };
  }, []);
  return (
    <div className="root-layout">
      <Header />
      <div className="body-grid">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<RecipeList />} />
            <Route path="/recipes/:id" element={<RecipeDetails />} />
            <Route path="/favorites" element={<RequireAuth><Favorites /></RequireAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function RequireAuth({children}) {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
export default App;
