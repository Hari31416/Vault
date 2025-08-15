import {
  Restaurant,
  RestaurantFormData,
  Dish,
  DishFormData,
  DishRating,
  DishRatingFormData,
  Analytics,
} from "../types";
import { API_BASE_URL } from "../../../config/api";

const API_BASE = `${API_BASE_URL}/tools/savorscore`;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Create headers with auth token
const createHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

// Handle API response
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Something went wrong");
  }
  return response.json();
};

// Restaurant API
export const restaurantApi = {
  getAll: async (): Promise<Restaurant[]> => {
    const response = await fetch(`${API_BASE}/restaurants`, {
      headers: createHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  getById: async (id: string): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE}/restaurants/${id}`, {
      headers: createHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  create: async (restaurantData: RestaurantFormData): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE}/restaurants`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(restaurantData),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  update: async (
    id: string,
    restaurantData: RestaurantFormData
  ): Promise<Restaurant> => {
    const response = await fetch(`${API_BASE}/restaurants/${id}`, {
      method: "PUT",
      headers: createHeaders(),
      body: JSON.stringify(restaurantData),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/restaurants/${id}`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    await handleResponse(response);
  },

  search: async (query: string): Promise<Restaurant[]> => {
    const response = await fetch(
      `${API_BASE}/restaurants/search?q=${encodeURIComponent(query)}`,
      {
        headers: createHeaders(),
      }
    );
    const data = await handleResponse(response);
    return data.data;
  },
};

// Dish API
export const dishApi = {
  getAll: async (): Promise<Dish[]> => {
    const response = await fetch(`${API_BASE}/dishes`, {
      headers: createHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  getById: async (id: string): Promise<Dish> => {
    const response = await fetch(`${API_BASE}/dishes/${id}`, {
      headers: createHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  getByRestaurant: async (restaurantId: string): Promise<Dish[]> => {
    const response = await fetch(
      `${API_BASE}/dishes/restaurant/${restaurantId}`,
      {
        headers: createHeaders(),
      }
    );
    const data = await handleResponse(response);
    return data.data;
  },

  create: async (dishData: DishFormData): Promise<Dish> => {
    const response = await fetch(`${API_BASE}/dishes`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(dishData),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  update: async (id: string, dishData: DishFormData): Promise<Dish> => {
    const response = await fetch(`${API_BASE}/dishes/${id}`, {
      method: "PUT",
      headers: createHeaders(),
      body: JSON.stringify(dishData),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/dishes/${id}`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    await handleResponse(response);
  },

  search: async (query: string): Promise<Dish[]> => {
    const response = await fetch(
      `${API_BASE}/dishes/search?q=${encodeURIComponent(query)}`,
      {
        headers: createHeaders(),
      }
    );
    const data = await handleResponse(response);
    return data.data;
  },
};

// Rating API
export const ratingApi = {
  getAll: async (): Promise<DishRating[]> => {
    const response = await fetch(`${API_BASE}/ratings`, {
      headers: createHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  getById: async (id: string): Promise<DishRating> => {
    const response = await fetch(`${API_BASE}/ratings/${id}`, {
      headers: createHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  getByRestaurant: async (restaurantId: string): Promise<DishRating[]> => {
    const response = await fetch(
      `${API_BASE}/ratings/restaurant/${restaurantId}`,
      {
        headers: createHeaders(),
      }
    );
    const data = await handleResponse(response);
    return data.data;
  },

  getByDish: async (dishId: string): Promise<DishRating[]> => {
    const response = await fetch(`${API_BASE}/ratings/dish/${dishId}`, {
      headers: createHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  create: async (ratingData: DishRatingFormData): Promise<DishRating> => {
    const response = await fetch(`${API_BASE}/ratings`, {
      method: "POST",
      headers: createHeaders(),
      body: JSON.stringify(ratingData),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  update: async (
    id: string,
    ratingData: DishRatingFormData
  ): Promise<DishRating> => {
    const response = await fetch(`${API_BASE}/ratings/${id}`, {
      method: "PUT",
      headers: createHeaders(),
      body: JSON.stringify(ratingData),
    });
    const data = await handleResponse(response);
    return data.data;
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/ratings/${id}`, {
      method: "DELETE",
      headers: createHeaders(),
    });
    await handleResponse(response);
  },

  getAnalytics: async (): Promise<Analytics> => {
    const response = await fetch(`${API_BASE}/ratings/analytics`, {
      headers: createHeaders(),
    });
    const data = await handleResponse(response);
    return data.data;
  },
};
