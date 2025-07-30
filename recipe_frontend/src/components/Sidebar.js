import React, { useEffect, useState } from "react";
import { fetchFilters } from "../utils/api";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Sidebar() {
  const [filters, setFilters] = useState({ categories: [], ingredients: [] });
  const [selectedCategory, setSelectedCategory] = useState("");
  const [ingredient, setIngredient] = useState("");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Keep UI in sync with query params
  useEffect(() => {
    setQuery(searchParams.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    async function loadFilters() {
      try {
        const res = await fetchFilters();
        setFilters(res);
      } catch {
        setFilters({
          categories: [],
          ingredients: []
        });
      }
    }
    loadFilters();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const criteria = [];
    if (query.trim()) criteria.push(`search=${encodeURIComponent(query)}`);
    if (selectedCategory) criteria.push(`category=${encodeURIComponent(selectedCategory)}`);
    if (ingredient) criteria.push(`ingredient=${encodeURIComponent(ingredient)}`);
    // Construct URL with filters for /?search= &category= &ingredient=
    let param = "";
    if (criteria.length) param = "?" + criteria.join("&");
    navigate("/" + param, { replace: true });
  }

  return (
    <aside className="sidebar" aria-label="Sidebar filter navigation">
      <div className="sidebar-title">Filter Recipes</div>
      <form onSubmit={handleSubmit} autoComplete="off" aria-label="Recipe Filter">
        <label className="sidebar-label" htmlFor="search-bar">Search</label>
        <input
          id="search-bar"
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search recipes..."
          name="search"
        />
        <label className="sidebar-label" htmlFor="category-select">Category</label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          name="category"
        >
          <option value="">All</option>
          {filters.categories.map((cat) => (
            <option value={cat} key={cat}>{cat}</option>
          ))}
        </select>
        <label className="sidebar-label" htmlFor="ingredient-select">Ingredient</label>
        <select
          id="ingredient-select"
          value={ingredient}
          onChange={e => setIngredient(e.target.value)}
          name="ingredient"
        >
          <option value="">Any</option>
          {filters.ingredients.map((ingr) => (
            <option value={ingr} key={ingr}>{ingr}</option>
          ))}
        </select>
        <button className="btn accent" type="submit" aria-label="Apply filters">Search</button>
      </form>
    </aside>
  );
}
