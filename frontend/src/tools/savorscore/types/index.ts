export interface Restaurant {
  _id?: string;
  name: string;
  address?: string;
  cuisine?: string;
  priceRange?: "$" | "$$" | "$$$" | "$$$$";
  website?: string;
  phone?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RestaurantFormData {
  name: string;
  address?: string;
  cuisine?: string;
  priceRange?: "$" | "$$" | "$$$" | "$$$$";
  website?: string;
  phone?: string;
  notes?: string;
}

export interface Dish {
  _id?: string;
  restaurantId: string;
  name: string;
  description?: string;
  category:
    | "Appetizer"
    | "Soup"
    | "Salad"
    | "Main Course"
    | "Side Dish"
    | "Dessert"
    | "Beverage"
    | "Other";
  price?: number;
  isActive: boolean;
  notes?: string;
  restaurantName?: string; // Populated field
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DishFormData {
  restaurantId: string;
  name: string;
  description?: string;
  category:
    | "Appetizer"
    | "Soup"
    | "Salad"
    | "Main Course"
    | "Side Dish"
    | "Dessert"
    | "Beverage"
    | "Other";
  price?: number;
  isActive?: boolean;
  notes?: string;
}

export interface DishRating {
  _id?: string;
  restaurantId: string;
  dishId: string;
  overallFlavor: number;
  ingredientQuality: number;
  textureAndMouthfeel: number;
  executionAndCraftsmanship: number;
  valueForMoney: number;
  cravingAndReorderLikelihood: number;
  averageScore: number;
  dateVisited: Date;
  notes?: string;
  wouldOrderAgain: boolean;
  restaurantName?: string; // Populated field
  dishName?: string; // Populated field
  createdAt?: Date;
  updatedAt?: Date;
}

export interface DishRatingFormData {
  restaurantId: string;
  dishId: string;
  overallFlavor: number;
  ingredientQuality: number;
  textureAndMouthfeel: number;
  executionAndCraftsmanship: number;
  valueForMoney: number;
  cravingAndReorderLikelihood: number;
  dateVisited: Date;
  notes?: string;
  wouldOrderAgain?: boolean;
}

export interface SavorScoreState {
  restaurants: Restaurant[];
  dishes: Dish[];
  ratings: DishRating[];
  loading: boolean;
  error: string | null;
}

export interface Analytics {
  totalRatings: number;
  restaurantAverages: {
    _id: string;
    restaurantName: string;
    averageScore: number;
    totalRatings: number;
  }[];
  topDishes: DishRating[];
  recentRatings: DishRating[];
}
