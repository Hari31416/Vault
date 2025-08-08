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

  return (
    <div className="container py-4">
      <button className="btn btn-link" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Back
      </button>
      <h2 className="mb-3">{restaurant.name}</h2>
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
          <div className="card mb-3 bg-light">
            <div className="card-body text-center">
              <h6>Total Dishes</h6>
              <div className="display-6">{dishes.length}</div>
            </div>
          </div>
          <div className="card mb-3 bg-light">
            <div className="card-body text-center">
              <h6>Total Ratings</h6>
              <div className="display-6">{ratings.length}</div>
            </div>
          </div>
          <div className="card bg-light">
            <div className="card-body text-center">
              <h6>Average Score</h6>
              <div className="display-6">{avgScore}</div>
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
        <div className="row">
          {ratings.slice(0, 6).map((r) => (
            <div key={r._id} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h6>{r.dishName || "Dish"}</h6>
                  <p className="mb-1">
                    <strong>Score:</strong> {r.averageScore.toFixed(1)}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong>{" "}
                    {new Date(r.dateVisited).toLocaleDateString()}
                  </p>
                  <button
                    className="btn btn-sm btn-outline-primary"
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
