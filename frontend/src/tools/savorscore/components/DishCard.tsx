import React from "react";
import { Dish } from "../types";

interface DishCardProps {
  dish: Dish;
  onEdit: (dish: Dish) => void;
  onDelete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const DishCard: React.FC<DishCardProps> = ({
  dish,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  return (
    <div className="card h-100">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title mb-0 savor-dish-title">{dish.name}</h6>
          <span className="badge bg-info">{dish.category}</span>
        </div>

        {dish.restaurantName && (
          <p className="text-muted small mb-2 savor-dish-restaurant">
            <i className="bi bi-shop me-1"></i>
            {dish.restaurantName}
          </p>
        )}

        {dish.description && (
          <p className="card-text small savor-dish-description">
            {dish.description.length > 100
              ? `${dish.description.substring(0, 100)}...`
              : dish.description}
          </p>
        )}

        {dish.price && (
          <div className="mb-2">
            <span className="badge bg-success">${dish.price.toFixed(2)}</span>
          </div>
        )}
      </div>
      <div className="card-footer bg-transparent">
        <div className="btn-group w-100" role="group">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => onViewDetails(dish._id!)}
          >
            <i className="bi bi-eye me-1"></i>
            View
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => onEdit(dish)}
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
                  `Are you sure you want to delete "${dish.name}"?`
                )
              ) {
                onDelete(dish._id!);
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

export default DishCard;
