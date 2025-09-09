import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSavorScore } from "../context/SavorScoreContext";
import { useTheme } from "../../../context/ThemeContext";
import { Dish, DishRating, Restaurant } from "../types";

const DishDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { state, getDishById, getRatingsByDish, getRestaurantById } =
    useSavorScore();
  const { theme } = useTheme();

  const [dish, setDish] = useState<Dish | undefined>();
  const [ratings, setRatings] = useState<DishRating[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();
  const [activeTab, setActiveTab] = useState<"overview" | "ratings">(
    "overview"
  );

  useEffect(() => {
    if (id) {
      const d = getDishById(id);
      setDish(d);
      if (d?.restaurantId) setRestaurant(getRestaurantById(d.restaurantId));
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
  const flavorAvg = ratings.length
    ? (
        ratings.reduce((s, r) => s + r.overallFlavor, 0) / ratings.length
      ).toFixed(1)
    : null;
  const qualityAvg = ratings.length
    ? (
        ratings.reduce((s, r) => s + r.ingredientQuality, 0) / ratings.length
      ).toFixed(1)
    : null;
  const valueAvg = ratings.length
    ? (
        ratings.reduce((s, r) => s + r.valueForMoney, 0) / ratings.length
      ).toFixed(1)
    : null;

  const topRecent = ratings.slice(0, 6);
  const scoreClass = (n: number) =>
    n >= 4.2 ? "score-high" : n >= 3.3 ? "score-mid" : "score-low";
  const textClass = theme === "dark" ? "text-light" : "text-dark";

  return (
    <div className="container py-4 dish-detail-view">
      <div className="d-flex align-items-center mb-3 gap-2 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-1"></i> Back
          </button>
          <h2 className="mb-0 d-flex align-items-center gap-3 flex-wrap">
            {dish.name}
            {avgScore !== "N/A" && (
              <span
                className={`score-badge score-large ${
                  avgScoreNum ? scoreClass(avgScoreNum) : ""
                }`}
                title="Average Score"
              >
                {avgScore}/5
              </span>
            )}
          </h2>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="row g-3 mb-4">
        {/* Ratings Count */}
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card h-100 shadow-sm">
            <div
              className={`card-body py-3 d-flex flex-column justify-content-center text-center ${textClass}`}
            >
              <div className="small text-uppercase">Ratings</div>
              <div
                className="fw-semibold"
                style={{ fontSize: "2.3rem", lineHeight: 1 }}
              >
                {ratings.length}
              </div>
            </div>
          </div>
        </div>
        {/* Price */}
        <div className="col-6 col-md-4 col-lg-2">
          <div className="card h-100 shadow-sm">
            <div
              className={`card-body py-3 d-flex flex-column justify-content-center text-center ${textClass}`}
            >
              <div className="small text-uppercase">Price</div>
              <div className="fw-semibold" style={{ fontSize: "1.6rem" }}>
                {typeof dish.price === "number"
                  ? `₹${dish.price.toFixed(2)}`
                  : "--"}
              </div>
            </div>
          </div>
        </div>
        {/* Average Rating */}
        <div className="col-12 col-md-8 col-lg-8">
          <div className="card h-100 shadow-sm">
            <div
              className={`card-body py-3 text-center d-flex flex-column justify-content-center ${textClass}`}
            >
              <div className="small text-uppercase mb-2">Average Rating</div>
              {avgScoreNum !== null ? (
                <div className="d-flex flex-column align-items-center">
                  <div
                    className={`score-circle ${scoreClass(avgScoreNum)}`}
                    style={{
                      ["--p" as any]: ((avgScoreNum / 5) * 100).toFixed(0),
                      width: 160,
                      height: 160,
                      maxWidth: "100%",
                    }}
                  >
                    <div className="inner d-flex align-items-center justify-content-center">
                      <div
                        className="main-score"
                        style={{ fontSize: "2.4rem", fontWeight: 600 }}
                      >
                        {avgScore}
                      </div>
                    </div>
                  </div>
                  <div className="small mt-3 d-flex gap-4 flex-wrap justify-content-center">
                    {flavorAvg && <span>Flavor {flavorAvg}</span>}
                    {qualityAvg && <span>Quality {qualityAvg}</span>}
                    {valueAvg && <span>Value {valueAvg}</span>}
                  </div>
                </div>
              ) : (
                <div className="text-muted">N/A</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "ratings" ? "active" : ""}`}
            onClick={() => setActiveTab("ratings")}
          >
            Ratings ({ratings.length})
          </button>
        </li>
      </ul>

      <div>
        {activeTab === "overview" && (
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card h-100">
                <div className={`card-body ${textClass}`}>
                  <h5 className="card-title mb-3">Details</h5>
                  <div className="small">
                    {restaurant && (
                      <div className="mb-1">
                        <strong>Restaurant:</strong>{" "}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-info px-2 py-0 align-baseline savor-inline-link"
                          onClick={() =>
                            navigate(
                              `/tools/savorscore/restaurant/${restaurant._id}`
                            )
                          }
                          style={{ fontSize: "0.8rem", lineHeight: 1.2 }}
                        >
                          <i className="bi bi-shop me-1" /> {restaurant.name}
                        </button>
                      </div>
                    )}
                    <div className="mb-1">
                      <strong>Category:</strong> {dish.category || "-"}
                    </div>
                    <div className="mb-1">
                      <strong>Price:</strong>{" "}
                      {typeof dish.price === "number"
                        ? `₹${dish.price.toFixed(2)}`
                        : "-"}
                    </div>
                    {dish.description && (
                      <div className="mb-1">
                        <strong>Description:</strong> {dish.description}
                      </div>
                    )}
                    {dish.notes && (
                      <div className="mb-1">
                        <strong>Notes:</strong> {dish.notes}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card h-100">
                <div className={`card-body ${textClass}`}>
                  <h5 className="card-title mb-3">Recent Ratings</h5>
                  {ratings.length === 0 && (
                    <p className="text-muted small mb-0">No ratings yet.</p>
                  )}
                  {ratings.length > 0 && (
                    <div className="row row-cols-1 row-cols-md-2 g-3">
                      {topRecent.map((r) => (
                        <div key={r._id} className="col">
                          <div className="rounded p-2 h-100 d-flex flex-column rating-mini-card">
                            <div className="d-flex justify-content-between align-items-start mb-1">
                              <span className="fw-semibold small clamp-1">
                                {new Date(r.dateVisited).toLocaleDateString()}
                              </span>
                              <span
                                className={`score-badge score-tiny ${scoreClass(
                                  r.averageScore
                                )}`}
                              >
                                {r.averageScore.toFixed(1)}
                              </span>
                            </div>
                            <div className="small mb-2 d-flex flex-column gap-1">
                              <div className="d-flex justify-content-between">
                                <span>Flavor</span>
                                <span>{r.overallFlavor}/5</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Quality</span>
                                <span>{r.ingredientQuality}/5</span>
                              </div>
                              <div className="d-flex justify-content-between">
                                <span>Value</span>
                                <span>{r.valueForMoney}/5</span>
                              </div>
                            </div>
                            <button
                              className="btn btn-sm btn-outline-primary mt-auto align-self-center"
                              onClick={() =>
                                navigate(`/tools/savorscore/rating/${r._id}`)
                              }
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "ratings" && (
          <div>
            {ratings.length === 0 ? (
              <p className="text-muted">No ratings for this dish yet.</p>
            ) : (
              <div className="row g-3">
                {ratings.map((r) => (
                  <div key={r._id} className="col-12 col-md-6 col-lg-4">
                    <div className="card h-100 rating-mini-card">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0 small fw-semibold clamp-1">
                            {new Date(r.dateVisited).toLocaleDateString()}
                          </h6>
                          <span
                            className={`score-badge score-tiny ${scoreClass(
                              r.averageScore
                            )}`}
                          >
                            {r.averageScore.toFixed(1)}/5
                          </span>
                        </div>
                        <div className="small mb-2 d-flex flex-column gap-1">
                          <div className="d-flex justify-content-between">
                            <span>Flavor</span>
                            <span>{r.overallFlavor}/5</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Quality</span>
                            <span>{r.ingredientQuality}/5</span>
                          </div>
                          <div className="d-flex justify-content-between">
                            <span>Value</span>
                            <span>{r.valueForMoney}/5</span>
                          </div>
                        </div>
                        <button
                          className="btn btn-sm btn-outline-primary mt-auto align-self-center"
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
        )}
      </div>
    </div>
  );
};

export default DishDetail;
