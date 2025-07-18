import React, { useState, useEffect } from "react";
import { Connection, Company, Position } from "../types";
import { connectionService, companyService } from "../services/api";

interface SearchBarProps {
  onResults: (results: {
    connections: Connection[];
    companies: Company[];
  }) => void;
  onClear: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onResults, onClear }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      onClear();
      return;
    }

    const timeoutId = setTimeout(async () => {
      try {
        setLoading(true);
        const [connections, companies] = await Promise.all([
          connectionService.search(query),
          companyService.search(query),
        ]);
        onResults({ connections, companies });
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, onResults, onClear]);

  return (
    <div className="mb-4">
      <div className="position-relative">
        <input
          type="text"
          className="form-control"
          placeholder="Search connections and companies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {loading && (
          <div className="position-absolute top-50 end-0 translate-middle-y me-3">
            <div className="spinner-border spinner-border-sm" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
