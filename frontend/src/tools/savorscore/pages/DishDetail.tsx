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

  return (
    <div className="container py-4">
      <button className="btn btn-link" onClick={() => navigate(-1)}>
        <i className="bi bi-arrow-left"></i> Back
      </button>
      <h2 className="mb-3">{dish.name}</h2>
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

      <h4 className="mt-4">Recent Ratings</h4>
      {ratings.length === 0 ? (
        <p className="text-muted">No ratings for this dish yet.</p>
      ) : (
        <div className="row">
          {ratings.slice(0, 6).map((r) => (
            <div key={r._id} className="col-md-4 mb-3">
              <div className="card h-100">
                <div className="card-body">
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

export default DishDetail;
