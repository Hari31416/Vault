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

  const getScoreClass = (score: number) => {
    if (score >= 4.2) return "score-high";
    if (score >= 3.3) return "score-mid";
    return "score-low";
  };

  return (
    <div className="container py-4 rating-detail-view">
      <button
        className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center mb-3"
        onClick={() => navigate(-1)}
      >
        <i className="bi bi-arrow-left me-1"></i> Back
      </button>
      <h2 className="mb-3 d-flex align-items-center gap-3">
        Rating Details
        <span
          className={`score-badge score-large ${getScoreClass(
            rating.averageScore
          )}`}
        >
          {rating.averageScore.toFixed(1)}/5
        </span>
      </h2>
      <div className="row">
        <div className="col-md-8 mb-3">
          <div className="card enhanced-rating-card">
            <div className="card-body">
              <h5 className="card-title d-flex align-items-center gap-2">
                {dish?.name || rating.dishName || "Dish"}
                {rating.wouldOrderAgain && (
                  <span className="badge bg-success">Would Order Again</span>
                )}
              </h5>
              <div className="detail-meta small text-muted mb-3 d-flex flex-wrap gap-3">
                <span>
                  <i className="bi bi-shop me-1"></i>
                  {restaurant?.name || rating.restaurantName}
                </span>
                <span>
                  <i className="bi bi-calendar me-1"></i>
                  {new Date(rating.dateVisited).toLocaleDateString()}
                </span>
              </div>
              <div className="row criteria-grid">
                {criteria.map((c) => (
                  <div key={c.label} className="col-sm-6 mb-3">
                    <div className="crit-label-row d-flex justify-content-between align-items-center mb-1 small">
                      <span className="crit-label clamp-2">{c.label}</span>
                      <strong className="crit-value">{c.value}/5</strong>
                    </div>
                    <div className="progress progress-thin">
                      <div
                        className={`progress-bar ${getScoreClass(c.value)}`}
                        role="progressbar"
                        style={{ width: `${(c.value / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              {rating.notes && (
                <div className="mt-3">
                  <h6 className="fw-semibold mb-1 small text-uppercase opacity-75">
                    Notes
                  </h6>
                  <p className="mb-0 small lh-base">{rating.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-3">
          <div className="card score-focus-card">
            <div className="card-body text-center">
              <div className="score-circle-wrapper mx-auto mb-3">
                <div
                  className={`score-circle ${getScoreClass(
                    rating.averageScore
                  )}`}
                >
                  <div className="inner">
                    <div className="main-score">
                      {rating.averageScore.toFixed(1)}/5
                    </div>
                  </div>
                </div>
              </div>
              <div className="mini-breakdown d-flex justify-content-center gap-3 small">
                <span>Flavor {rating.overallFlavor}</span>
                <span>Value {rating.valueForMoney}</span>
                <span>Craving {rating.cravingAndReorderLikelihood}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingDetail;
