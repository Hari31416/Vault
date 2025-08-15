import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  hasAnyUsers: boolean | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  createUserByAdmin: (
    username: string,
    email: string,
    password: string,
    role: string
  ) => Promise<{ success: boolean; message: string }>;
  checkUsersExist: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Configure axios defaults using centralized API config
axios.defaults.baseURL = API_BASE_URL;

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [isLoading, setIsLoading] = useState(true);
  const [hasAnyUsers, setHasAnyUsers] = useState<boolean | null>(null);

  const checkUsersExist = async (): Promise<boolean> => {
    try {
      const response = await axios.get("/auth/users-exist");
      const usersExist = response.data.hasUsers;
      setHasAnyUsers(usersExist);
      return usersExist;
    } catch (error) {
      console.log("Error checking users exist:", error);
      // If endpoint doesn't exist or fails, assume users exist for safety
      setHasAnyUsers(true);
      return true;
    }
  };

  // Set axios header when token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Check if user is logged in on mount and if any users exist
  useEffect(() => {
    const checkAuth = async () => {
      // First check if any users exist
      await checkUsersExist();

      if (token) {
        try {
          const response = await axios.get("/auth/me");
          if (response.data.success) {
            setUser(response.data.data.user);
          } else {
            // Invalid token, remove it
            localStorage.removeItem("token");
            setToken(null);
          }
        } catch (error) {
          // Invalid token, remove it
          localStorage.removeItem("token");
          setToken(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [token]); // Include token dependency

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post("/auth/login", { email, password });

      if (response.data.success) {
        const { user, token } = response.data.data;
        setUser(user);
        setToken(token);
        localStorage.setItem("token", token);
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post("/auth/register", {
        username,
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        setUser(user);
        setToken(token);
        localStorage.setItem("token", token);
        // Update hasAnyUsers since we just registered
        setHasAnyUsers(true);
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  const createUserByAdmin = async (
    username: string,
    email: string,
    password: string,
    role: string
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await axios.post("/auth/create-user", {
        username,
        email,
        password,
        role,
      });

      if (response.data.success) {
        // Update hasAnyUsers if this was the first user
        if (hasAnyUsers === false) {
          setHasAnyUsers(true);
        }
        return { success: true, message: response.data.message };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || "User creation failed",
      };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        hasAnyUsers,
        login,
        register,
        logout,
        createUserByAdmin,
        checkUsersExist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
