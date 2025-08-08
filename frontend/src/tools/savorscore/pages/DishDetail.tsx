import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSavorScore } from "../context/SavorScoreContext";
import { Dish, DishRating, Restaurant } from "../types";

const DishDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, getDishById, getRatingsByDish, getRestaurantById } =
    useSavorScore();

  const [dish, setDish] = useState<Dish | undefined>();
  const [ratings, setRatings] = useState<DishRating[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();

  useEffect(() => {
    if (id) {
      const d = getDishById(id);
      setDish(d);
      if (d?.restaurantId) {
        setRestaurant(getRestaurantById(d.restaurantId));
      }
      setRatings(getRatingsByDish(id));
    }
  }, [id, state.dishes, state.ratings, state.restaurants]);

  if (!dish) {
    return (
      <div className="container py-4">
        <button className="btn btn-link" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <div className="alert alert-warning mt-3">Dish not found.</div>
      </div>
    );
  }

  const avgScore = ratings.length
    ? (
        ratings.reduce((sum, r) => sum + r.averageScore, 0) / ratings.length
      ).toFixed(1)
    : "N/A";
  const avgScoreNum = avgScore === "N/A" ? null : parseFloat(avgScore);
  const topRecent = ratings.slice(0, 6);

  return (
    <div className="container py-4 dish-detail-view">
      <button className="btn btn-link" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Back
      </button>
      <h2 className="mb-3 d-flex align-items-center gap-3">
        {dish.name}
        {avgScore !== "N/A" && (
          <span className="score-badge score-large" title="Average Score">
            {avgScore}/5
          </span>
        )}
      </h2>
      <div className="row mb-4">
        <div className="col-md-8">
          <div className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">Details</h5>
              {restaurant && (
                <p className="mb-1">
                  <strong>Restaurant:</strong> {restaurant.name}
                </p>
              )}
              <p className="mb-1">
                <strong>Category:</strong> {dish.category}
              </p>
              {dish.price !== undefined && (
                <p className="mb-1">
                  <strong>Price:</strong> ${dish.price.toFixed(2)}
                </p>
              )}
              {dish.description && (
                <p className="mt-2">
                  <strong>Description:</strong>
                  <br />
                  {dish.description}
                </p>
              )}
              {dish.notes && (
                <p className="mt-2">
                  <strong>Notes:</strong>
                  <br />
                  {dish.notes}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3 stat-card">
            <div className="card-body text-center">
              <div className="stat-label">Total Ratings</div>
              <div className="stat-number">{ratings.length}</div>
            </div>
          </div>
          <div className="card score-focus-card">
            <div className="card-body text-center">
              <div className="stat-label mb-2">Average Score</div>
              {avgScoreNum !== null ? (
                <div className="score-circle-wrapper mx-auto mb-2">
                  <div
                    className={`score-circle ${
                      avgScoreNum >= 4.2
                        ? "score-high"
                        : avgScoreNum >= 3.3
                        ? "score-mid"
                        : "score-low"
                    }`}
                    style={{
                      ["--p" as any]: ((avgScoreNum / 5) * 100).toFixed(0),
                    }}
                  >
                    <div className="inner">
                      <div className="main-score">{avgScore}/5</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-muted">N/A</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <h4 className="mt-4">Recent Ratings</h4>
      {ratings.length === 0 ? (
        <p className="text-muted">No ratings for this dish yet.</p>
      ) : (
        <div className="row rating-mini-cards">
          {topRecent.map((r) => (
            <div key={r._id} className="col-md-4 mb-3">
              <div className="card h-100 rating-mini-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div className="small fw-semibold clamp-1">
                      {new Date(r.dateVisited).toLocaleDateString()}
                    </div>
                    <span
                      className={`score-badge score-tiny ${
                        r.averageScore >= 4.2
                          ? "score-high"
                          : r.averageScore >= 3.3
                          ? "score-mid"
                          : "score-low"
                      }`}
                    >
                      {r.averageScore.toFixed(1)}/5
                    </span>
                  </div>
                  <div className="rating-bars small mb-2">
                    <div className="rb-row d-flex justify-content-between align-items-center">
                      <span className="rb-label">Flavor</span>
                      <div className="rb-meter">
                        <div
                          style={{ width: `${(r.overallFlavor / 5) * 100}%` }}
                        />
                      </div>
                      <span className="rb-val">{r.overallFlavor}/5</span>
                    </div>
                    <div className="rb-row d-flex justify-content-between align-items-center">
                      <span className="rb-label">Value</span>
                      <div className="rb-meter">
                        <div
                          style={{ width: `${(r.valueForMoney / 5) * 100}%` }}
                        />
                      </div>
                      <span className="rb-val">{r.valueForMoney}/5</span>
                    </div>
                  </div>
                  <button
                    className="btn btn-sm btn-outline-primary w-100"
                    onClick={() =>
                      navigate(`/tools/savorscore/rating/${r._id}`)
                    }
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DishDetail;
