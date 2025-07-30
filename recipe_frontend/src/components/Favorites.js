import React, { useEffect, useState } from "react";
import { getFavorites } from "../utils/api";
import { useNavigate } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Favorites() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      setLoading(true); setError("");
      try {
        const res = await getFavorites();
        setRecipes(res.favorites || []);
      } catch (e) {
        setError(e.message || "Failed to load favorites.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div>Loading favorites…</div>;
  if (error) return <div style={{color:"var(--color-danger)"}}>{error}</div>;
  if (!recipes.length) return <div className="favorites-empty">You have no favorite recipes yet.</div>;

  return (
    <section>
      <h2 style={{marginTop: 0, fontWeight: 700}}>Favorite Recipes</h2>
      <div className="recipe-list-grid">
        {recipes.map((recipe) => (
          <div
            className="recipe-card"
            key={recipe.id}
            role="listitem"
            tabIndex={0}
            onClick={() => navigate(`/recipes/${recipe.id}`)}
            onKeyDown={e => {if(e.key==="Enter")navigate(`/recipes/${recipe.id}`);}}
            aria-label={`Favorite Recipe: ${recipe.title}`}
          >
            {recipe.image && <img className="recipe-card-image" src={recipe.image} alt={recipe.title} />}
            <div className="recipe-card-title">{recipe.title}</div>
            <div className="recipe-card-info">{recipe.summary || recipe.description || "No summary."}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
