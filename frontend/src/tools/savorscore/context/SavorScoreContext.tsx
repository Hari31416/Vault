import React, { createContext, useContext, useReducer, ReactNode } from "react";
import {
  Restaurant,
  RestaurantFormData,
  Dish,
  DishFormData,
  DishRating,
  DishRatingFormData,
  SavorScoreState,
  Analytics,
} from "../types";
import { restaurantApi, dishApi, ratingApi } from "../services/api";

// Action types
type SavorScoreAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_RESTAURANTS"; payload: Restaurant[] }
  | { type: "ADD_RESTAURANT"; payload: Restaurant }
  | { type: "UPDATE_RESTAURANT"; payload: Restaurant }
  | { type: "DELETE_RESTAURANT"; payload: string }
  | { type: "SET_DISHES"; payload: Dish[] }
  | { type: "ADD_DISH"; payload: Dish }
  | { type: "UPDATE_DISH"; payload: Dish }
  | { type: "DELETE_DISH"; payload: string }
  | { type: "SET_RATINGS"; payload: DishRating[] }
  | { type: "ADD_RATING"; payload: DishRating }
  | { type: "UPDATE_RATING"; payload: DishRating }
  | { type: "DELETE_RATING"; payload: string };

// Initial state
const initialState: SavorScoreState = {
  restaurants: [],
  dishes: [],
  ratings: [],
  loading: false,
  error: null,
};

// Reducer
const savorScoreReducer = (
  state: SavorScoreState,
  action: SavorScoreAction
): SavorScoreState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_RESTAURANTS":
      return { ...state, restaurants: action.payload, loading: false };
    case "ADD_RESTAURANT":
      return {
        ...state,
        restaurants: [...state.restaurants, action.payload],
        loading: false,
      };
    case "UPDATE_RESTAURANT":
      return {
        ...state,
        restaurants: state.restaurants.map((restaurant) =>
          restaurant._id === action.payload._id ? action.payload : restaurant
        ),
        loading: false,
      };
    case "DELETE_RESTAURANT":
      return {
        ...state,
        restaurants: state.restaurants.filter(
          (restaurant) => restaurant._id !== action.payload
        ),
        loading: false,
      };
    case "SET_DISHES":
      return { ...state, dishes: action.payload, loading: false };
    case "ADD_DISH":
      return {
        ...state,
        dishes: [...state.dishes, action.payload],
        loading: false,
      };
    case "UPDATE_DISH":
      return {
        ...state,
        dishes: state.dishes.map((dish) =>
          dish._id === action.payload._id ? action.payload : dish
        ),
        loading: false,
      };
    case "DELETE_DISH":
      return {
        ...state,
        dishes: state.dishes.filter((dish) => dish._id !== action.payload),
        loading: false,
      };
    case "SET_RATINGS":
      return { ...state, ratings: action.payload, loading: false };
    case "ADD_RATING":
      return {
        ...state,
        ratings: [...state.ratings, action.payload],
        loading: false,
      };
    case "UPDATE_RATING":
      return {
        ...state,
        ratings: state.ratings.map((rating) =>
          rating._id === action.payload._id ? action.payload : rating
        ),
        loading: false,
      };
    case "DELETE_RATING":
      return {
        ...state,
        ratings: state.ratings.filter(
          (rating) => rating._id !== action.payload
        ),
        loading: false,
      };
    default:
      return state;
  }
};

// Context type
interface SavorScoreContextType {
  state: SavorScoreState;

  // Restaurant actions
  fetchRestaurants: () => Promise<void>;
  createRestaurant: (data: RestaurantFormData) => Promise<void>;
  updateRestaurant: (id: string, data: RestaurantFormData) => Promise<void>;
  deleteRestaurant: (id: string) => Promise<void>;
  getRestaurantById: (id: string) => Restaurant | undefined;

  // Dish actions
  fetchDishes: () => Promise<void>;
  createDish: (data: DishFormData) => Promise<void>;
  updateDish: (id: string, data: DishFormData) => Promise<void>;
  deleteDish: (id: string) => Promise<void>;
  getDishById: (id: string) => Dish | undefined;
  getDishesByRestaurant: (restaurantId: string) => Dish[];

  // Rating actions
  fetchRatings: () => Promise<void>;
  createRating: (data: DishRatingFormData) => Promise<void>;
  updateRating: (id: string, data: DishRatingFormData) => Promise<void>;
  deleteRating: (id: string) => Promise<void>;
  getRatingById: (id: string) => DishRating | undefined;
  getRatingsByRestaurant: (restaurantId: string) => DishRating[];
  getRatingsByDish: (dishId: string) => DishRating[];
  getAnalytics: () => Promise<Analytics>;
}

const SavorScoreContext = createContext<SavorScoreContextType | undefined>(
  undefined
);

// Provider component
export const SavorScoreProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(savorScoreReducer, initialState);

  // Utility function to handle async actions
  const handleAsync = async (asyncFn: () => Promise<void>) => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });
      await asyncFn();
    } catch (error) {
      dispatch({
        type: "SET_ERROR",
        payload: error instanceof Error ? error.message : "An error occurred",
      });
    }
  };

  // Restaurant actions
  const fetchRestaurants = async () => {
    await handleAsync(async () => {
      const restaurants = await restaurantApi.getAll();
      dispatch({ type: "SET_RESTAURANTS", payload: restaurants });
    });
  };

  const createRestaurant = async (data: RestaurantFormData) => {
    await handleAsync(async () => {
      const restaurant = await restaurantApi.create(data);
      dispatch({ type: "ADD_RESTAURANT", payload: restaurant });
    });
  };

  const updateRestaurant = async (id: string, data: RestaurantFormData) => {
    await handleAsync(async () => {
      const restaurant = await restaurantApi.update(id, data);
      dispatch({ type: "UPDATE_RESTAURANT", payload: restaurant });
    });
  };

  const deleteRestaurant = async (id: string) => {
    await handleAsync(async () => {
      await restaurantApi.delete(id);
      dispatch({ type: "DELETE_RESTAURANT", payload: id });
    });
  };

  const getRestaurantById = (id: string) => {
    return state.restaurants.find((restaurant) => restaurant._id === id);
  };

  // Dish actions
  const fetchDishes = async () => {
    await handleAsync(async () => {
      const dishes = await dishApi.getAll();
      dispatch({ type: "SET_DISHES", payload: dishes });
    });
  };

  const createDish = async (data: DishFormData) => {
    await handleAsync(async () => {
      const dish = await dishApi.create(data);
      dispatch({ type: "ADD_DISH", payload: dish });
    });
  };

  const updateDish = async (id: string, data: DishFormData) => {
    await handleAsync(async () => {
      const dish = await dishApi.update(id, data);
      dispatch({ type: "UPDATE_DISH", payload: dish });
    });
  };

  const deleteDish = async (id: string) => {
    await handleAsync(async () => {
      await dishApi.delete(id);
      dispatch({ type: "DELETE_DISH", payload: id });
    });
  };

  const getDishById = (id: string) => {
    return state.dishes.find((dish) => dish._id === id);
  };

  const getDishesByRestaurant = (restaurantId: string) => {
    return state.dishes.filter((dish) => dish.restaurantId === restaurantId);
  };

  // Rating actions
  const fetchRatings = async () => {
    await handleAsync(async () => {
      const ratings = await ratingApi.getAll();
      dispatch({ type: "SET_RATINGS", payload: ratings });
    });
  };

  const createRating = async (data: DishRatingFormData) => {
    await handleAsync(async () => {
      const rating = await ratingApi.create(data);
      dispatch({ type: "ADD_RATING", payload: rating });
    });
  };

  const updateRating = async (id: string, data: DishRatingFormData) => {
    await handleAsync(async () => {
      const rating = await ratingApi.update(id, data);
      dispatch({ type: "UPDATE_RATING", payload: rating });
    });
  };

  const deleteRating = async (id: string) => {
    await handleAsync(async () => {
      await ratingApi.delete(id);
      dispatch({ type: "DELETE_RATING", payload: id });
    });
  };

  const getRatingById = (id: string) => {
    return state.ratings.find((rating) => rating._id === id);
  };

  const getRatingsByRestaurant = (restaurantId: string) => {
    return state.ratings.filter(
      (rating) => rating.restaurantId === restaurantId
    );
  };

  const getRatingsByDish = (dishId: string) => {
    return state.ratings.filter((rating) => rating.dishId === dishId);
  };

  const getAnalytics = async (): Promise<Analytics> => {
    return await ratingApi.getAnalytics();
  };

  const value: SavorScoreContextType = {
    state,
    fetchRestaurants,
    createRestaurant,
    updateRestaurant,
    deleteRestaurant,
    getRestaurantById,
    fetchDishes,
    createDish,
    updateDish,
    deleteDish,
    getDishById,
    getDishesByRestaurant,
    fetchRatings,
    createRating,
    updateRating,
    deleteRating,
    getRatingById,
    getRatingsByRestaurant,
    getRatingsByDish,
    getAnalytics,
  };

  return (
    <SavorScoreContext.Provider value={value}>
      {children}
    </SavorScoreContext.Provider>
  );
};

// Hook to use the context
export const useSavorScore = (): SavorScoreContextType => {
  const context = useContext(SavorScoreContext);
  if (context === undefined) {
    throw new Error("useSavorScore must be used within a SavorScoreProvider");
  }
  return context;
};
