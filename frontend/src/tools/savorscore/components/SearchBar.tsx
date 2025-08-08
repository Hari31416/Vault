import React, { useState } from "react";
import { Restaurant, Dish, DishRating } from "../types";
import { restaurantApi, dishApi, ratingApi } from "../services/api";

interface SearchBarProps {
  onResults: (results: {
    restaurants: Restaurant[];
    dishes: Dish[];
    ratings: DishRating[];
  }) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onResults, onClear }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsSearching(true);
    try {
      const [restaurants, dishes] = await Promise.all([
        restaurantApi.search(searchTerm.trim()),
        dishApi.search(searchTerm.trim()),
      ]);

      onResults({
        restaurants,
        dishes,
        ratings: [], // For now, we don't have rating search
      });
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    onClear();
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search restaurants, dishes, cuisine types..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-outline-primary me-2"
          disabled={isSearching || !searchTerm.trim()}
        >
          {isSearching ? (
            <span className="spinner-border spinner-border-sm me-1" />
          ) : (
            <i className="bi bi-search me-1"></i>
          )}
          Search
        </button>
        {searchTerm && (
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={handleClear}
          >
            <i className="bi bi-x-circle me-1"></i>
            Clear
          </button>
        )}
      </form>
    </div>
  );
};

export default SearchBar;
