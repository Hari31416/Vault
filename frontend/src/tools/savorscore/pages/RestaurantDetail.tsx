import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSavorScore } from "../context/SavorScoreContext";
import { useTheme } from "../../../context/ThemeContext";
import { Restaurant, Dish, DishRating, RestaurantFormData } from "../types";
import RestaurantModal from "../components/RestaurantModal";

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    state,
    getRestaurantById,
    getDishesByRestaurant,
    getRatingsByRestaurant,
    updateRestaurant,
  } = useSavorScore();
  const { theme } = useTheme();

  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [ratings, setRatings] = useState<DishRating[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "dishes" | "ratings">(
    "overview"
  );
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    if (id) {
      setRestaurant(getRestaurantById(id));
      setDishes(getDishesByRestaurant(id));
      setRatings(getRatingsByRestaurant(id));
    }
  }, [id, state.restaurants, state.dishes, state.ratings]);

  // Per-dish average ratings (memoized) MUST be before any early return
  const dishAvgMap = useMemo(() => {
    const map: Record<string, { avg: number; count: number }> = {};
    ratings.forEach((r) => {
      if (!r.dishId) return;
      const existing = map[r.dishId];
      if (existing) {
        const newCount = existing.count + 1;
        map[r.dishId] = {
          avg: (existing.avg * existing.count + r.averageScore) / newCount,
          count: newCount,
        };
      } else {
        map[r.dishId] = { avg: r.averageScore, count: 1 };
      }
    });
    return map;
  }, [ratings]);

  const handleUpdateRestaurant = async (data: RestaurantFormData) => {
    if (restaurant?._id) {
      await updateRestaurant(restaurant._id, data);
      // refresh local restaurant details
      setRestaurant(getRestaurantById(restaurant._id));
      setShowEditModal(false);
    }
  };

  if (!restaurant) {
    return (
      <div className="container py-4">
        <button className="btn btn-link" onClick={() => navigate(-1)}>
          <i className="bi bi-arrow-left"></i> Back
        </button>
        <div className="alert alert-warning mt-3">Restaurant not found.</div>
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
    <div className="container py-4 restaurant-detail-view">
      <div className="d-flex align-items-center mb-3 gap-2 flex-wrap">
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-outline-secondary btn-sm d-inline-flex align-items-center"
            onClick={() => navigate(-1)}
          >
            <i className="bi bi-arrow-left me-1"></i>
            Back
          </button>
          <h2 className="mb-0 d-flex align-items-center gap-3 flex-wrap">
            {restaurant.name}
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
        <div className="ms-auto d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowEditModal(true)}
          >
            <i className="bi bi-pencil me-1" /> Edit
          </button>
        </div>
      </div>

      {/* Summary Strip */}
      <div className="row g-3 mb-4">
        {/* Dishes */}
        <div className="col-6 col-md-3 col-lg-2">
          <div className="card h-100 shadow-sm">
            <div
              className={`card-body py-3 d-flex flex-column justify-content-center text-center ${textClass}`}
            >
              <div className="small text-uppercase">Dishes</div>
              <div
                className="fw-semibold"
                style={{ fontSize: "2.3rem", lineHeight: 1 }}
              >
                {dishes.length}
              </div>
            </div>
          </div>
        </div>
        {/* Ratings */}
        <div className="col-6 col-md-3 col-lg-2">
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
        {/* Average (Bigger & Wider after removing Quick Info) */}
        <div className="col-12 col-md-6 col-lg-8">
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
                      width: 170,
                      height: 170,
                      maxWidth: "100%",
                    }}
                  >
                    <div className="inner d-flex align-items-center justify-content-center">
                      <div
                        className="main-score"
                        style={{ fontSize: "2.6rem", fontWeight: 600 }}
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
        {/* (Quick Info card removed; its content moved to Overview tab) */}
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
            className={`nav-link ${activeTab === "dishes" ? "active" : ""}`}
            onClick={() => setActiveTab("dishes")}
          >
            Dishes ({dishes.length})
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

      {/* Tab Panels */}
      <div>
        {activeTab === "overview" && (
          <div className="row g-4">
            <div className="col-lg-6">
              <div className="card h-100">
                <div className={`card-body ${textClass}`}>
                  <h5 className="card-title mb-3">Details</h5>
                  <div className="small">
                    <div className="mb-1">
                      <strong>Address:</strong> {restaurant.address || "-"}
                    </div>
                    <div className="mb-1">
                      <strong>Price Range:</strong>{" "}
                      {(() => {
                        const legacyMap: Record<string, string> = {
                          $: "₹",
                          $$: "₹₹",
                          $$$: "₹₹₹",
                          $$$$: "₹₹₹₹",
                        };
                        const pr = restaurant.priceRange;
                        return pr ? legacyMap[pr] || pr : "-";
                      })()}
                    </div>
                    <div className="mb-1">
                      <strong>Cuisine:</strong> {restaurant.cuisine || "-"}
                    </div>
                    <div className="mb-1">
                      <strong>Phone:</strong> {restaurant.phone || "-"}
                    </div>
                    {restaurant.website && (
                      <div className="mb-1">
                        <strong>Website:</strong>{" "}
                        <a
                          href={restaurant.website}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {restaurant.website}
                        </a>
                      </div>
                    )}
                    <div className="mb-1">
                      <strong>Notes:</strong>{" "}
                      {restaurant.notes ? (
                        <span>{restaurant.notes}</span>
                      ) : (
                        <span className="text-muted">None</span>
                      )}
                    </div>
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
                                {r.dishName || "Dish"}
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

        {activeTab === "dishes" && (
          <div>
            {dishes.length === 0 ? (
              <p className="text-muted">No dishes for this restaurant.</p>
            ) : (
              <div className="row g-3 mb-4">
                {dishes.map((d) => {
                  const stat = d._id ? dishAvgMap[d._id] : undefined;
                  const avg = stat ? stat.avg.toFixed(1) : null;
                  const badgeClass = avg
                    ? scoreClass(parseFloat(avg))
                    : "score-empty";
                  return (
                    <div key={d._id} className="col-12 col-sm-6 col-lg-4">
                      <div className={`card h-100 dish-mini-card ${textClass}`}>
                        <div className="card-body d-flex flex-column">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className={`mb-0 me-2 clamp-1 ${textClass}`}>
                              {d.name}
                            </h6>
                            <span
                              className={`score-badge ${badgeClass}`}
                              title={
                                avg
                                  ? `Average ${avg}/5 from ${stat?.count} rating(s)`
                                  : "No ratings"
                              }
                            >
                              {avg ? `${avg}` : "--"}
                            </span>
                          </div>
                          <div className="small mb-2 text-secondary">
                            {d.category && (
                              <span className="me-2">{d.category}</span>
                            )}
                            {stat && <span>({stat.count})</span>}
                          </div>
                          {d.description && (
                            <p
                              className={`small flex-grow-1 mb-2 ${textClass}`}
                            >
                              {d.description.length > 90
                                ? `${d.description.substring(0, 90)}…`
                                : d.description}
                            </p>
                          )}
                          <div className="d-flex justify-content-between align-items-center mt-auto">
                            {typeof d.price === "number" ? (
                              <span className="badge bg-success">
                                ₹{d.price.toFixed(2)}
                              </span>
                            ) : (
                              <span className="text-muted small">No price</span>
                            )}
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() =>
                                navigate(`/tools/savorscore/dish/${d._id}`)
                              }
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "ratings" && (
          <div>
            {ratings.length === 0 ? (
              <p className="text-muted">No ratings for this restaurant.</p>
            ) : (
              <div className="row g-3">
                {ratings.map((r) => (
                  <div key={r._id} className="col-12 col-md-6 col-lg-4">
                    <div className="card h-100 rating-mini-card">
                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <h6 className="mb-0 small fw-semibold clamp-1">
                            {r.dishName || "Dish"}
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

      {showEditModal && (
        <RestaurantModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleUpdateRestaurant}
          restaurant={restaurant}
        />
      )}
    </div>
  );
};

export default RestaurantDetail;
