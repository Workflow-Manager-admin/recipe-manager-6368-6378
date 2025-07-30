import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchRecipeDetails, saveFavorite, removeFavorite } from "../utils/api";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
export default function RecipeDetails() {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const [recipe, setRecipe] = useState(null);
  const [favorite, setFavorite] = useState(false);
  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchRecipeDetails(id);
        setRecipe(data.recipe);
        if (user && data.recipe && user.favorites) {
          setFavorite(user.favorites.includes(data.recipe.id));
        }
      } catch (e) {
        setError(e.message || "Unable to load recipe");
      }
    }
    load();
    // eslint-disable-next-line
  }, [id, user]);

  async function handleFavorite() {
    try {
      if (!user) return;
      if (!favorite) {
        await saveFavorite(recipe.id);
        setMsg("Saved to favorites!");
        setFavorite(true);
        // Update context with new favorites!
        setUser(prev => ({
          ...prev,
          favorites: [...(prev.favorites || []), recipe.id],
        }));
      } else {
        await removeFavorite(recipe.id);
        setMsg("Removed from favorites.");
        setFavorite(false);
        setUser(prev => ({
          ...prev,
          favorites: (prev.favorites || []).filter(f => f !== recipe.id)
        }));
      }
      setTimeout(() => setMsg(""), 1600);
    } catch (e) {
      setMsg("Error: " + e.message);
    }
  }

  if (error) return <div style={{color:"var(--color-danger)"}}>{error}</div>;
  if (!recipe) return <div>Loading recipe details…</div>;

  return (
    <article className="recipe-details" aria-label={`Recipe Details: ${recipe.title}`}>
      <h1 className="recipe-details-title">{recipe.title}</h1>
      {recipe.image && (
        <img src={recipe.image} alt={recipe.title} className="recipe-details-image" />
      )}
      <div className="recipe-details-section">
        <span style={{fontSize:"1rem"}}><strong>Category:</strong> {recipe.category}</span>
        {user && (
          <button
            className={`btn small${favorite ? " accent" : ""}`}
            style={{marginLeft:"1em"}}
            onClick={handleFavorite}
            disabled={msg}
            aria-label={favorite ? "Unfavorite" : "Favorite"}
          >
            {favorite ? "★ Favorited" : "☆ Add to Favorites"}
          </button>
        )}
        {msg && <span style={{marginLeft:".8em", color:"var(--color-secondary)"}}>{msg}</span>}
      </div>
      <div className="recipe-details-section">
        <div className="recipe-details-section-title">Ingredients</div>
        <ul className="recipe-ingredients">
          {(recipe.ingredients || []).map((ingr, idx) => (
            <li key={idx}>{ingr}</li>
          ))}
        </ul>
      </div>
      <div className="recipe-details-section">
        <div className="recipe-details-section-title">Instructions</div>
        <div className="recipe-instructions">{recipe.instructions}</div>
      </div>
    </article>
  );
}
