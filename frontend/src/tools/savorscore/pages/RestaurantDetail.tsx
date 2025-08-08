import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSavorScore } from "../context/SavorScoreContext";
import { Restaurant, Dish, DishRating } from "../types";

const RestaurantDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    state,
    getRestaurantById,
    getDishesByRestaurant,
    getRatingsByRestaurant,
  } = useSavorScore();

  const [restaurant, setRestaurant] = useState<Restaurant | undefined>();
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [ratings, setRatings] = useState<DishRating[]>([]);

  useEffect(() => {
    if (id) {
      setRestaurant(getRestaurantById(id));
      setDishes(getDishesByRestaurant(id));
      setRatings(getRatingsByRestaurant(id));
    }
  }, [id, state.restaurants, state.dishes, state.ratings]);

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
  const topRecent = ratings.slice(0, 6);
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

  return (
    <div className="container py-4 restaurant-detail-view">
      <button className="btn btn-link" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Back
      </button>
      <h2 className="mb-3 d-flex align-items-center gap-3">
        {restaurant.name}
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
              <p className="mb-1">
                <strong>Cuisine:</strong> {restaurant.cuisine || "-"}
              </p>
              <p className="mb-1">
                <strong>Address:</strong> {restaurant.address || "-"}
              </p>
              <p className="mb-1">
                <strong>Price Range:</strong> {restaurant.priceRange || "-"}
              </p>
              <p className="mb-1">
                <strong>Phone:</strong> {restaurant.phone || "-"}
              </p>
              {restaurant.website && (
                <p className="mb-1">
                  <strong>Website:</strong>{" "}
                  <a href={restaurant.website} target="_blank" rel="noreferrer">
                    {restaurant.website}
                  </a>
                </p>
              )}
              {restaurant.notes && (
                <p className="mt-2">
                  <strong>Notes:</strong>
                  <br />
                  {restaurant.notes}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-3 stat-card">
            <div className="card-body text-center">
              <div className="stat-label">Total Dishes</div>
              <div className="stat-number">{dishes.length}</div>
            </div>
          </div>
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
              {avgScoreNum !== null && (
                <div className="avg-mini-metrics d-flex justify-content-center gap-3 small mt-2 flex-wrap">
                  {flavorAvg && <span>Flavor {flavorAvg}/5</span>}
                  {qualityAvg && <span>Quality {qualityAvg}/5</span>}
                  {valueAvg && <span>Value {valueAvg}/5</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <h4 className="mt-4">Dishes</h4>
      {dishes.length === 0 ? (
        <p className="text-muted">No dishes for this restaurant.</p>
      ) : (
        <ul className="list-group mb-4">
          {dishes.map((d) => (
            <li
              key={d._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span>{d.name}</span>
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => navigate(`/tools/savorscore/dish/${d._id}`)}
              >
                View
              </button>
            </li>
          ))}
        </ul>
      )}

      <h4 className="mt-4">Recent Ratings</h4>
      {ratings.length === 0 ? (
        <p className="text-muted">No ratings for this restaurant.</p>
      ) : (
        <div className="row rating-mini-cards">
          {topRecent.map((r) => (
            <div key={r._id} className="col-md-4 mb-3">
              <div className="card h-100 rating-mini-card">
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h6 className="mb-0 small fw-semibold clamp-1">
                      {r.dishName || "Dish"}
                    </h6>
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
                          style={{
                            width: `${(r.overallFlavor / 5) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="rb-val">{r.overallFlavor}/5</span>
                    </div>
                    <div className="rb-row d-flex justify-content-between align-items-center">
                      <span className="rb-label">Quality</span>
                      <div className="rb-meter">
                        <div
                          style={{
                            width: `${(r.ingredientQuality / 5) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="rb-val">{r.ingredientQuality}/5</span>
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

export default RestaurantDetail;
