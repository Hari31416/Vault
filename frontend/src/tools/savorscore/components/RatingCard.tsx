import React from "react";
import { DishRating } from "../types";

interface RatingCardProps {
  rating: DishRating;
  onEdit: (rating: DishRating) => void;
  onDelete: (id: string) => void;
  onViewDetails?: (id: string) => void; // new optional prop
}

const RatingCard: React.FC<RatingCardProps> = ({
  rating,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return "text-success";
    if (score >= 3) return "text-warning";
    return "text-danger";
  };

  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title mb-0">{rating.dishName}</h6>
          <span
            className={`badge ${getScoreColor(
              rating.averageScore
            )} rating-score-badge`}
          >
            <strong>{rating.averageScore.toFixed(1)}/5</strong>
          </span>
        </div>

        <p className="text-muted small mb-2">
          <i className="bi bi-shop me-1"></i>
          {rating.restaurantName}
        </p>

        <div className="small text-muted mb-2">
          <i className="bi bi-calendar me-1"></i>
          {formatDate(rating.dateVisited)}
        </div>

        <div className="row small mb-2">
          <div className="col-6">
            <div>Flavor: {rating.overallFlavor}/5</div>
            <div>Quality: {rating.ingredientQuality}/5</div>
            <div>Texture: {rating.textureAndMouthfeel}/5</div>
          </div>
          <div className="col-6">
            <div>Craft: {rating.executionAndCraftsmanship}/5</div>
            <div>Value: {rating.valueForMoney}/5</div>
            <div>Craving: {rating.cravingAndReorderLikelihood}/5</div>
          </div>
        </div>

        {rating.wouldOrderAgain && (
          <div className="mb-2">
            <span className="badge bg-success">Would Order Again</span>
          </div>
        )}

        {rating.notes && (
          <p className="card-text text-muted small">
            {rating.notes.length > 80
              ? `${rating.notes.substring(0, 80)}...`
              : rating.notes}
          </p>
        )}
      </div>
      <div className="card-footer bg-transparent">
        <div className="btn-group w-100" role="group">
          {onViewDetails && (
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => onViewDetails(rating._id!)}
            >
              <i className="bi bi-eye me-1"></i>
              View
            </button>
          )}
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onEdit(rating)}
          >
            <i className="bi bi-pencil me-1"></i>
            Edit
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => {
              if (
                window.confirm("Are you sure you want to delete this rating?")
              ) {
                onDelete(rating._id!);
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

export default RatingCard;
