import React, { useState, useEffect } from "react";
import { Restaurant, Dish, DishRating, DishRatingFormData } from "../types";

interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DishRatingFormData) => void;
  rating?: DishRating;
  restaurants: Restaurant[];
  dishes: Dish[];
}

const RatingModal: React.FC<RatingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  rating,
  restaurants,
  dishes,
}) => {
  const [formData, setFormData] = useState<DishRatingFormData>({
    restaurantId: "",
    dishId: "",
    overallFlavor: 3,
    ingredientQuality: 3,
    textureAndMouthfeel: 3,
    executionAndCraftsmanship: 3,
    valueForMoney: 3,
    cravingAndReorderLikelihood: 3,
    dateVisited: new Date(),
    notes: "",
    wouldOrderAgain: false,
  });

  const [availableDishes, setAvailableDishes] = useState<Dish[]>([]);

  useEffect(() => {
    if (rating) {
      setFormData({
        restaurantId: rating.restaurantId,
        dishId: rating.dishId,
        overallFlavor: rating.overallFlavor,
        ingredientQuality: rating.ingredientQuality,
        textureAndMouthfeel: rating.textureAndMouthfeel,
        executionAndCraftsmanship: rating.executionAndCraftsmanship,
        valueForMoney: rating.valueForMoney,
        cravingAndReorderLikelihood: rating.cravingAndReorderLikelihood,
        dateVisited: new Date(rating.dateVisited),
        notes: rating.notes || "",
        wouldOrderAgain: rating.wouldOrderAgain,
      });
    } else {
      setFormData({
        restaurantId: "",
        dishId: "",
        overallFlavor: 3,
        ingredientQuality: 3,
        textureAndMouthfeel: 3,
        executionAndCraftsmanship: 3,
        valueForMoney: 3,
        cravingAndReorderLikelihood: 3,
        dateVisited: new Date(),
        notes: "",
        wouldOrderAgain: false,
      });
    }
  }, [rating, isOpen]);

  useEffect(() => {
    if (formData.restaurantId) {
      const filtered = dishes.filter(
        (dish) => dish.restaurantId === formData.restaurantId
      );
      setAvailableDishes(filtered);
    } else {
      // If no restaurant selected show all dishes (decoupled scenario)
      setAvailableDishes(dishes);
    }
  }, [formData.restaurantId, dishes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: target.checked }));
    } else if (type === "date" || name === "dateVisited") {
      setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
    } else if (type === "number" || type === "range") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleRestaurantChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      restaurantId: e.target.value,
      dishId: "", // Reset dish when restaurant changes
    }));
  };

  const formatDateForInput = (date: Date) => {
    return date.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {rating ? "Edit Rating" : "Add New Rating"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="restaurantId" className="form-label">
                    Restaurant *
                  </label>
                  <select
                    className="form-select"
                    id="restaurantId"
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleRestaurantChange}
                    required
                  >
                    <option value="">Select a restaurant</option>
                    {restaurants.map((restaurant) => (
                      <option key={restaurant._id} value={restaurant._id}>
                        {restaurant.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="dishId" className="form-label">
                    Dish *
                  </label>
                  <select
                    className="form-select"
                    id="dishId"
                    name="dishId"
                    value={formData.dishId}
                    onChange={handleChange}
                    required
                    disabled={!availableDishes.length}
                  >
                    <option value="">
                      {availableDishes.length
                        ? "Select a dish"
                        : "No dishes available"}
                    </option>
                    {availableDishes.map((dish) => (
                      <option key={dish._id} value={dish._id}>
                        {dish.name}
                      </option>
                    ))}
                  </select>
                  {!availableDishes.length && (
                    <small className="text-muted">
                      No dishes found for selected restaurant. Create one first.
                    </small>
                  )}
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="dateVisited" className="form-label">
                  Date Visited *
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="dateVisited"
                  name="dateVisited"
                  value={formatDateForInput(formData.dateVisited)}
                  onChange={handleChange}
                  required
                />
              </div>

              <h6>Rating Criteria (1-5 scale)</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="overallFlavor" className="form-label">
                    Overall Flavor: {formData.overallFlavor}
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="5"
                    id="overallFlavor"
                    name="overallFlavor"
                    value={formData.overallFlavor}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="ingredientQuality" className="form-label">
                    Ingredient Quality: {formData.ingredientQuality}
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="5"
                    id="ingredientQuality"
                    name="ingredientQuality"
                    value={formData.ingredientQuality}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="textureAndMouthfeel" className="form-label">
                    Texture & Mouthfeel: {formData.textureAndMouthfeel}
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="5"
                    id="textureAndMouthfeel"
                    name="textureAndMouthfeel"
                    value={formData.textureAndMouthfeel}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="executionAndCraftsmanship"
                    className="form-label"
                  >
                    Execution & Craftsmanship:{" "}
                    {formData.executionAndCraftsmanship}
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="5"
                    id="executionAndCraftsmanship"
                    name="executionAndCraftsmanship"
                    value={formData.executionAndCraftsmanship}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="valueForMoney" className="form-label">
                    Value for Money: {formData.valueForMoney}
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="5"
                    id="valueForMoney"
                    name="valueForMoney"
                    value={formData.valueForMoney}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label
                    htmlFor="cravingAndReorderLikelihood"
                    className="form-label"
                  >
                    Craving & Reorder Likelihood:{" "}
                    {formData.cravingAndReorderLikelihood}
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="5"
                    id="cravingAndReorderLikelihood"
                    name="cravingAndReorderLikelihood"
                    value={formData.cravingAndReorderLikelihood}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Share your thoughts about this dish..."
                />
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="wouldOrderAgain"
                  name="wouldOrderAgain"
                  checked={formData.wouldOrderAgain}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="wouldOrderAgain">
                  I would order this dish again
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {rating ? "Update Rating" : "Add Rating"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
