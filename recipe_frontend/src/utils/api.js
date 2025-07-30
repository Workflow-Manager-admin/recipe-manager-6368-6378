/**
 * Central API utility for backend communication.
 * All endpoints prefix with REACT_APP_API_URL (from env).
 * Handles Auth when token provided.
 */

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Helper to fetch with optional auth
async function apiFetch(path, options = {}, withAuth = false) {
  const token = localStorage.getItem("token");
  const headers = {
    ...options.headers,
    "Content-Type": "application/json",
  };
  if (withAuth && token) headers["Authorization"] = `Bearer ${token}`;
  const resp = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });
  const data = await resp.json();
  if (!resp.ok) {
    throw new Error(data.message || "API Error");
  }
  return data;
}

// PUBLIC_INTERFACE
export async function fetchRecipeList(query = "") {
  // GET /recipes?search=query
  let url = `/recipes`;
  if (query) url += `?search=${encodeURIComponent(query)}`;
  return apiFetch(url, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function fetchRecipeDetails(id) {
  // GET /recipes/:id
  return apiFetch(`/recipes/${id}`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function fetchFilters() {
  // GET /recipes/filters
  return apiFetch(`/recipes/filters`, { method: "GET" });
}

// PUBLIC_INTERFACE
export async function fetchFilteredRecipes(filters) {
  // POST /recipes/filter
  return apiFetch(`/recipes/filter`, {
    method: "POST",
    body: JSON.stringify(filters),
  });
}

// PUBLIC_INTERFACE
export async function getFavorites() {
  // GET /users/favorites (requires auth)
  return apiFetch(`/users/favorites`, { method: "GET" }, true);
}

// PUBLIC_INTERFACE
export async function saveFavorite(recipeId) {
  // POST /users/favorites
  return apiFetch(`/users/favorites`, {
    method: "POST",
    body: JSON.stringify({ recipeId }),
  }, true);
}

// PUBLIC_INTERFACE
export async function removeFavorite(recipeId) {
  // DELETE /users/favorites/:id
  return apiFetch(`/users/favorites/${recipeId}`, {
    method: "DELETE"
  }, true);
}
