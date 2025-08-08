import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSavorScore } from "../context/SavorScoreContext";
import {
  Restaurant,
  Dish,
  DishRating,
  RestaurantFormData,
  DishFormData,
  DishRatingFormData,
} from "../types";
import RestaurantCard from "../components/RestaurantCard";
import DishCard from "../components/DishCard";
import RatingCard from "../components/RatingCard";
import RestaurantModal from "../components/RestaurantModal";
import DishModal from "../components/DishModal";
import RatingModal from "../components/RatingModal";
import SearchBar from "../components/SearchBar";

const SavorScoreDashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    state,
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    fetchDishes,
    createDish,
    updateDish,
    deleteDish,
    fetchRatings,
    createRating,
    updateRating,
    deleteRating,
  } = useSavorScore();

  const [searchResults, setSearchResults] = useState<{
    restaurants: Restaurant[];
    dishes: Dish[];
    ratings: DishRating[];
  } | null>(null);

  const [activeTab, setActiveTab] = useState<
    "restaurants" | "dishes" | "ratings" | "analytics"
  >("restaurants");

  // Modal states
  const [showRestaurantModal, setShowRestaurantModal] = useState(false);
  const [showDishModal, setShowDishModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const [editingRestaurant, setEditingRestaurant] = useState<
    Restaurant | undefined
  >();
  const [editingDish, setEditingDish] = useState<Dish | undefined>();
  const [editingRating, setEditingRating] = useState<DishRating | undefined>();

  useEffect(() => {
    fetchRestaurants();
    fetchDishes();
    fetchRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchResults = (results: {
    restaurants: Restaurant[];
    dishes: Dish[];
    ratings: DishRating[];
  }) => {
    setSearchResults(results);
  };

  const handleSearchClear = () => {
    setSearchResults(null);
  };

  // Restaurant handlers
  const handleCreateRestaurant = async (data: RestaurantFormData) => {
    await createRestaurant(data);
  };

  const handleUpdateRestaurant = async (data: RestaurantFormData) => {
    if (editingRestaurant?._id) {
      await updateRestaurant(editingRestaurant._id, data);
      setEditingRestaurant(undefined);
    }
  };

  const handleEditRestaurant = (restaurant: Restaurant) => {
    setEditingRestaurant(restaurant);
    setShowRestaurantModal(true);
  };

  const handleDeleteRestaurant = async (id: string) => {
    await deleteRestaurant(id);
  };

  const handleViewRestaurantDetails = (id: string) => {
    navigate(`/tools/savorscore/restaurant/${id}`);
  };

  // Dish handlers
  const handleCreateDish = async (data: DishFormData) => {
    await createDish(data);
  };

  const handleUpdateDish = async (data: DishFormData) => {
    if (editingDish?._id) {
      await updateDish(editingDish._id, data);
      setEditingDish(undefined);
    }
  };

  const handleEditDish = (dish: Dish) => {
    setEditingDish(dish);
    setShowDishModal(true);
  };

  const handleDeleteDish = async (id: string) => {
    await deleteDish(id);
  };

  const handleViewDishDetails = (id: string) => {
    navigate(`/tools/savorscore/dish/${id}`);
  };

  // Rating handlers
  const handleCreateRating = async (data: DishRatingFormData) => {
    await createRating(data);
  };

  const handleUpdateRating = async (data: DishRatingFormData) => {
    if (editingRating?._id) {
      await updateRating(editingRating._id, data);
      setEditingRating(undefined);
    }
  };

  const handleEditRating = (rating: DishRating) => {
    setEditingRating(rating);
    setShowRatingModal(true);
  };

  const handleDeleteRating = async (id: string) => {
    await deleteRating(id);
  };

  // Modal handlers
  const handleCloseRestaurantModal = () => {
    setShowRestaurantModal(false);
    setEditingRestaurant(undefined);
  };

  const handleCloseDishModal = () => {
    setShowDishModal(false);
    setEditingDish(undefined);
  };

  const handleCloseRatingModal = () => {
    setShowRatingModal(false);
    setEditingRating(undefined);
  };

  const displayRestaurants = searchResults
    ? searchResults.restaurants
    : state.restaurants;
  const displayDishes = searchResults ? searchResults.dishes : state.dishes;
  const displayRatings = searchResults ? searchResults.ratings : state.ratings;

  // Calculate statistics
  const totalRestaurants = state.restaurants.length;
  const totalDishes = state.dishes.length;
  const totalRatings = state.ratings.length;
  const avgScore = state.ratings.length
    ? (
        state.ratings.reduce((sum, rating) => sum + rating.averageScore, 0) /
        state.ratings.length
      ).toFixed(1)
    : "0.0";

  if (state.loading) {
    return (
      <div className="container py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>SavorScore</h1>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/tools/savorscore/analytics")}
            >
              <i className="bi bi-graph-up me-2"></i>
              View Analytics
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-3">
            <div className="col-md-3 col-sm-6 mb-2">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <i className="bi bi-shop display-6"></i>
                  </div>
                  <h4 className="card-title">{totalRestaurants}</h4>
                  <p className="card-text">Restaurants</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <i className="bi bi-egg-fried display-6"></i>
                  </div>
                  <h4 className="card-title">{totalDishes}</h4>
                  <p className="card-text">Dishes</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <i className="bi bi-star-fill display-6"></i>
                  </div>
                  <h4 className="card-title">{totalRatings}</h4>
                  <p className="card-text">Ratings</p>
                </div>
              </div>
            </div>
            <div className="col-md-3 col-sm-6 mb-2">
              <div className="card bg-warning text-white">
                <div className="card-body text-center">
                  <div className="d-flex justify-content-center align-items-center mb-2">
                    <i className="bi bi-graph-up display-6"></i>
                  </div>
                  <h4 className="card-title">{avgScore}</h4>
                  <p className="card-text">Avg Score</p>
                </div>
              </div>
            </div>
          </div>

          <SearchBar
            onResults={handleSearchResults}
            onClear={handleSearchClear}
          />
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "restaurants" ? "active" : ""
                }`}
                onClick={() => setActiveTab("restaurants")}
              >
                <i className="bi bi-shop me-1"></i>
                Restaurants ({displayRestaurants.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${activeTab === "dishes" ? "active" : ""}`}
                onClick={() => setActiveTab("dishes")}
              >
                <i className="bi bi-egg-fried me-1"></i>
                Dishes ({displayDishes.length})
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  activeTab === "ratings" ? "active" : ""
                }`}
                onClick={() => setActiveTab("ratings")}
              >
                <i className="bi bi-star-fill me-1"></i>
                Ratings ({displayRatings.length})
              </button>
            </li>
          </ul>
        </div>
      </div>

      {activeTab === "restaurants" && (
        <div className="row">
          <div className="col-12 mb-3">
            <button
              className="btn btn-success"
              onClick={() => setShowRestaurantModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Restaurant
            </button>
          </div>
          {displayRestaurants.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-shop display-1 text-muted"></i>
                <h3 className="text-muted mt-3">No restaurants found</h3>
                <p className="text-muted">
                  {searchResults
                    ? "Try a different search term"
                    : "Start by adding your first restaurant"}
                </p>
              </div>
            </div>
          ) : (
            displayRestaurants.map((restaurant) => (
              <div key={restaurant._id} className="col-md-6 col-lg-4 mb-3">
                <RestaurantCard
                  restaurant={restaurant}
                  onEdit={handleEditRestaurant}
                  onDelete={handleDeleteRestaurant}
                  onViewDetails={handleViewRestaurantDetails}
                />
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "dishes" && (
        <div className="row">
          <div className="col-12 mb-3">
            <button
              className="btn btn-success"
              onClick={() => setShowDishModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Dish
            </button>
          </div>
          {displayDishes.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-egg-fried display-1 text-muted"></i>
                <h3 className="text-muted mt-3">No dishes found</h3>
                <p className="text-muted">
                  {searchResults
                    ? "Try a different search term"
                    : "Start by adding your first dish"}
                </p>
              </div>
            </div>
          ) : (
            displayDishes.map((dish) => (
              <div key={dish._id} className="col-md-6 col-lg-4 mb-3">
                <DishCard
                  dish={dish}
                  onEdit={handleEditDish}
                  onDelete={handleDeleteDish}
                  onViewDetails={handleViewDishDetails}
                />
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "ratings" && (
        <div className="row">
          <div className="col-12 mb-3">
            <button
              className="btn btn-success"
              onClick={() => setShowRatingModal(true)}
            >
              <i className="bi bi-plus-circle me-2"></i>
              Add New Rating
            </button>
          </div>
          {displayRatings.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <i className="bi bi-star-fill display-1 text-muted"></i>
                <h3 className="text-muted mt-3">No ratings found</h3>
                <p className="text-muted">
                  {searchResults
                    ? "Try a different search term"
                    : "Start by adding your first rating"}
                </p>
              </div>
            </div>
          ) : (
            displayRatings.map((rating) => (
              <div key={rating._id} className="col-md-6 col-lg-4 mb-3">
                <RatingCard
                  rating={rating}
                  onEdit={handleEditRating}
                  onDelete={handleDeleteRating}
                />
              </div>
            ))
          )}
        </div>
      )}

      {state.error && (
        <div className="alert alert-danger" role="alert">
          {state.error}
        </div>
      )}

      <RestaurantModal
        isOpen={showRestaurantModal}
        onClose={handleCloseRestaurantModal}
        onSubmit={
          editingRestaurant ? handleUpdateRestaurant : handleCreateRestaurant
        }
        restaurant={editingRestaurant}
      />

      <DishModal
        isOpen={showDishModal}
        onClose={handleCloseDishModal}
        onSubmit={editingDish ? handleUpdateDish : handleCreateDish}
        dish={editingDish}
        restaurants={state.restaurants}
      />

      <RatingModal
        isOpen={showRatingModal}
        onClose={handleCloseRatingModal}
        onSubmit={editingRating ? handleUpdateRating : handleCreateRating}
        rating={editingRating}
        restaurants={state.restaurants}
        dishes={state.dishes}
      />
    </div>
  );
};

export default SavorScoreDashboard;
