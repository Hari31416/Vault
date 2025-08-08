import React, { useState, useEffect } from "react";
import { Restaurant, Dish, DishFormData } from "../types";

interface DishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DishFormData) => void;
  dish?: Dish;
  restaurants: Restaurant[];
}

const DishModal: React.FC<DishModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  dish,
  restaurants,
}) => {
  const [formData, setFormData] = useState<DishFormData>({
    restaurantId: "",
    name: "",
    description: "",
    category: "Other",
    price: undefined,
    isActive: true,
    notes: "",
  });

  useEffect(() => {
    if (dish) {
      setFormData({
        restaurantId: dish.restaurantId,
        name: dish.name,
        description: dish.description || "",
        category: dish.category,
        price: dish.price,
        isActive: dish.isActive,
        notes: dish.notes || "",
      });
    } else {
      setFormData({
        restaurantId: "",
        name: "",
        description: "",
        category: "Other",
        price: undefined,
        isActive: true,
        notes: "",
      });
    }
  }, [dish, isOpen]);

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
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else if (name === "price") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : parseFloat(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" tabIndex={-1}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              {dish ? "Edit Dish" : "Add New Dish"}
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
                    onChange={handleChange}
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
                  <label htmlFor="name" className="form-label">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-8 mb-3">
                  <label htmlFor="category" className="form-label">
                    Category
                  </label>
                  <select
                    className="form-select"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    <option value="Appetizer">Appetizer</option>
                    <option value="Soup">Soup</option>
                    <option value="Salad">Salad</option>
                    <option value="Main Course">Main Course</option>
                    <option value="Side Dish">Side Dish</option>
                    <option value="Dessert">Dessert</option>
                    <option value="Beverage">Beverage</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="col-md-4 mb-3">
                  <label htmlFor="price" className="form-label">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="description" className="form-label">
                  Description
                </label>
                <textarea
                  className="form-control"
                  id="description"
                  name="description"
                  rows={3}
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label htmlFor="notes" className="form-label">
                  Notes
                </label>
                <textarea
                  className="form-control"
                  id="notes"
                  name="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={handleChange}
                />
              </div>

              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                />
                <label className="form-check-label" htmlFor="isActive">
                  This dish is still available
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
                {dish ? "Update Dish" : "Add Dish"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DishModal;
