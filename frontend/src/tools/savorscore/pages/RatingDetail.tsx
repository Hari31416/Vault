import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSavorScore } from "../context/SavorScoreContext";
import { DishRating, Dish, Restaurant } from "../types";

const RatingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, getRatingById, getDishById, getRestaurantById } =
    useSavorScore();

  const [rating, setRating] = useState<DishRating | undefined>();
  const [dish, setDish] = useState<Dish | undefined>();
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();

  useEffect(() => {
    if (id) {
      const r = getRatingById(id);
      setRating(r);
      if (r) {
        setDish(getDishById(r.dishId));
        setRestaurant(getRestaurantById(r.restaurantId));
      }
    }
  }, [id, state.ratings, state.dishes, state.restaurants]);

  if (!rating) {
    return (
      <div className="container py-4">
        <button className="btn btn-link" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <div className="alert alert-warning mt-3">Rating not found.</div>
      </div>
    );
  }

  const criteria = [
    { label: "Overall Flavor", value: rating.overallFlavor },
    { label: "Ingredient Quality", value: rating.ingredientQuality },
    { label: "Texture & Mouthfeel", value: rating.textureAndMouthfeel },
    {
      label: "Execution & Craftsmanship",
      value: rating.executionAndCraftsmanship,
    },
    { label: "Value for Money", value: rating.valueForMoney },
    {
      label: "Craving & Reorder Likelihood",
      value: rating.cravingAndReorderLikelihood,
    },
  ];

  return (
    <div className="container py-4">
      <button className="btn btn-link" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Back
      </button>
      <h2 className="mb-3">Rating Details</h2>
      <div className="row">
        <div className="col-md-8 mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                {dish?.name || rating.dishName || "Dish"}
              </h5>
              <p className="mb-1">
                <strong>Restaurant:</strong>{" "}
                {restaurant?.name || rating.restaurantName}
              </p>
              <p className="mb-1">
                <strong>Date Visited:</strong>{" "}
                {new Date(rating.dateVisited).toLocaleDateString()}
              </p>
              <p className="mb-3">
                <strong>Average Score:</strong> {rating.averageScore.toFixed(1)}
              </p>
              <div className="row">
                {criteria.map((c) => (
                  <div key={c.label} className="col-sm-6 mb-2">
                    <div className="d-flex justify-content-between small">
                      <span>{c.label}</span>
                      <strong>{c.value}/5</strong>
                    </div>
                    <div className="progress" style={{ height: 6 }}>
                      <div
                        className="progress-bar"
                        role="progressbar"
                        style={{ width: `${(c.value / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {rating.wouldOrderAgain && (
                <span className="badge bg-success mt-2">Would Order Again</span>
              )}
              {rating.notes && (
                <p className="mt-3">
                  <strong>Notes:</strong>
                  <br />
                  {rating.notes}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card">
            <div className="card-body text-center">
              <h6>Score</h6>
              <div className="display-5">{rating.averageScore.toFixed(1)}</div>
              <small className="text-muted">out of 5</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingDetail;
