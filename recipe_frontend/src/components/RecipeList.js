import React, { useEffect, useState } from "react";
import { fetchRecipeList, fetchFilteredRecipes } from "../utils/api";
import { useNavigate, useLocation } from "react-router-dom";

// PUBLIC_INTERFACE
export default function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // Parse query params for search & filters
  function getFilters() {
    const params = new URLSearchParams(location.search);
    let filters = {};
    if (params.get("search")) filters.search = params.get("search");
    if (params.get("category")) filters.category = params.get("category");
    if (params.get("ingredient")) filters.ingredient = params.get("ingredient");
    return filters;
  }

  useEffect(() => {
    async function loadRecipes() {
      setLoading(true);
      setError("");
      try {
        const filters = getFilters();
        let data;
        if (Object.keys(filters).length > 0) {
          data = await fetchFilteredRecipes(filters);
        } else {
          data = await fetchRecipeList();
        }
        setRecipes(data.recipes || []);
      } catch (e) {
        setError(String(e.message));
      } finally {
        setLoading(false);
      }
    }
    loadRecipes();
    // eslint-disable-next-line
  }, [location.search]);

  return (
    <section>
      <h2 style={{marginTop: 0, fontWeight: 700}}>Browse Recipes</h2>
      {loading ? (
        <div>Loading recipes…</div>
      ) : error ? (
        <div style={{ color: "var(--color-danger)" }}>{error}</div>
      ) : (
        <div className="recipe-list-grid" role="list">
          {recipes.length === 0 ? (
            <div>No recipes found.</div>
          ) : (
            recipes.map((recipe) => (
              <div
                className="recipe-card"
                key={recipe.id}
                tabIndex={0}
                role="listitem"
                onClick={() => navigate(`/recipes/${recipe.id}`)}
                onKeyDown={e => {if(e.key==="Enter")navigate(`/recipes/${recipe.id}`);}}
                aria-label={`Recipe: ${recipe.title}`}
              >
                {recipe.image && (
                  <img className="recipe-card-image" src={recipe.image} alt={`Recipe ${recipe.title}`} />
                )}
                <div className="recipe-card-title">{recipe.title}</div>
                <div className="recipe-card-info">{recipe.summary || recipe.description || "No summary."}</div>
                <div className="recipe-card-footer" style={{marginTop: "auto"}}>
                  <span>{recipe.category}</span>
                  {/* Optionally: favorite icon, etc. */}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
