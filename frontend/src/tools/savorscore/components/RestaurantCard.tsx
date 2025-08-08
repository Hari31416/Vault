import React from "react";
import { Restaurant } from "../types";
import { useSavorScore } from "../context/SavorScoreContext";

interface RestaurantCardProps {
  restaurant: Restaurant;
  onEdit: (restaurant: Restaurant) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const priceRangeDisplay = restaurant.priceRange || "Not specified";
  const { state } = useSavorScore();
  const ratings = state.ratings.filter(
    (r) => r.restaurantId === restaurant._id
  );
  const avgScore = ratings.length
    ? (
        ratings.reduce((sum, r) => sum + r.averageScore, 0) / ratings.length
      ).toFixed(1)
    : null;

  const getScoreBadgeClass = () => {
    if (!avgScore) return "score-badge score-empty";
    const n = parseFloat(avgScore);
    if (n >= 4.2) return "score-badge score-high";
    if (n >= 3.3) return "score-badge score-mid";
    return "score-badge score-low";
  };

  return (
    <div className="card h-100 restaurant-card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title mb-0 savor-title d-flex align-items-center">
            {restaurant.name}
          </h6>
          <div className="d-flex flex-column align-items-end gap-1">
            <span className="badge bg-success">{priceRangeDisplay}</span>
            <span className={getScoreBadgeClass()} title="Average Rating">
              {avgScore ? `${avgScore}/5` : "--"}
            </span>
          </div>
        </div>

        <div className="mb-2">
          {restaurant.cuisine && (
            <div className="mb-1">
              <i className="bi bi-bookmark-fill me-2 text-primary"></i>
              <span className="small savor-cuisine">{restaurant.cuisine}</span>
            </div>
          )}
          {restaurant.address && (
            <div className="mb-1">
              <i className="bi bi-geo-alt me-2 text-muted"></i>
              <span className="small savor-address">{restaurant.address}</span>
            </div>
          )}
          {restaurant.phone && (
            <div className="mb-1">
              <i className="bi bi-telephone me-2 text-muted"></i>
              <a
                href={`tel:${restaurant.phone}`}
                className="text-decoration-none small savor-phone"
              >
                {restaurant.phone}
              </a>
            </div>
          )}
          {restaurant.website && (
            <div className="mb-1">
              <i className="bi bi-globe me-2 text-info"></i>
              <a
                href={restaurant.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-decoration-none small savor-website"
              >
                Visit Website
              </a>
            </div>
          )}
        </div>

        {restaurant.notes && (
          <p className="card-text text-muted small">
            {restaurant.notes.length > 100
              ? `${restaurant.notes.substring(0, 100)}...`
              : restaurant.notes}
          </p>
        )}
      </div>
      <div className="card-footer bg-transparent">
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => onViewDetails(restaurant._id!)}
          >
            <i className="bi bi-eye me-1"></i>
            View
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onEdit(restaurant)}
          >
            <i className="bi bi-pencil me-1"></i>
            Edit
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              if (
                window.confirm(
                  `Are you sure you want to delete "${restaurant.name}"?`
                )
              ) {
                onDelete(restaurant._id!);
              }
            }}
          >
            <i className="bi bi-trash me-1"></i>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
