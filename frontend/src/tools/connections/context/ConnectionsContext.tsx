import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { Connection, Company, Position } from "../types";
import {
  connectionService,
  companyService,
  positionService,
} from "../services/api";

// State interface
interface ConnectionsState {
  connections: Connection[];
  companies: Company[];
  positions: Position[];
  loading: boolean;
  error: string | null;
}

// Action types
type ConnectionsAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_CONNECTIONS"; payload: Connection[] }
  | { type: "SET_COMPANIES"; payload: Company[] }
  | { type: "SET_POSITIONS"; payload: Position[] }
  | { type: "ADD_CONNECTION"; payload: Connection }
  | { type: "UPDATE_CONNECTION"; payload: Connection }
  | { type: "DELETE_CONNECTION"; payload: string }
  | { type: "ADD_COMPANY"; payload: Company }
  | { type: "UPDATE_COMPANY"; payload: Company }
  | { type: "DELETE_COMPANY"; payload: string }
  | { type: "ADD_POSITION"; payload: Position }
  | { type: "UPDATE_POSITION"; payload: Position }
  | { type: "DELETE_POSITION"; payload: string };

// Context interface
interface ConnectionsContextType {
  state: ConnectionsState;
  // Connection actions
  fetchConnections: () => Promise<void>;
  createConnection: (
    connection: Omit<Connection, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<Connection>;
  updateConnection: (
    id: string,
    connection: Partial<Connection>
  ) => Promise<Connection>;
  deleteConnection: (id: string) => Promise<void>;
  // Company actions
  fetchCompanies: () => Promise<void>;
  createCompany: (
    company: Omit<Company, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<Company>;
  updateCompany: (id: string, company: Partial<Company>) => Promise<Company>;
  deleteCompany: (id: string) => Promise<void>;
  // Position actions
  fetchPositions: () => Promise<void>;
  createPosition: (
    position: Omit<Position, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => Promise<Position>;
  updatePosition: (
    id: string,
    position: Partial<Position>
  ) => Promise<Position>;
  deletePosition: (id: string) => Promise<void>;
  // Utility functions
  getConnectionById: (id: string) => Connection | undefined;
  getCompanyById: (id: string) => Company | undefined;
  getPositionsByConnectionId: (connectionId: string) => Position[];
  getPositionsByCompanyId: (companyId: string) => Position[];
}

// Initial state
const initialState: ConnectionsState = {
  connections: [],
  companies: [],
  positions: [],
  loading: false,
  error: null,
};

// Reducer
const connectionsReducer = (
  state: ConnectionsState,
  action: ConnectionsAction
): ConnectionsState => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_CONNECTIONS":
      return { ...state, connections: action.payload, loading: false };
    case "SET_COMPANIES":
      return { ...state, companies: action.payload, loading: false };
    case "SET_POSITIONS":
      return { ...state, positions: action.payload, loading: false };
    case "ADD_CONNECTION":
      return { ...state, connections: [...state.connections, action.payload] };
    case "UPDATE_CONNECTION":
      return {
        ...state,
        connections: state.connections.map((conn) =>
          conn._id === action.payload._id ? action.payload : conn
        ),
      };
    case "DELETE_CONNECTION":
      return {
        ...state,
        connections: state.connections.filter(
          (conn) => conn._id !== action.payload
        ),
      };
    case "ADD_COMPANY":
      return { ...state, companies: [...state.companies, action.payload] };
    case "UPDATE_COMPANY":
      return {
        ...state,
        companies: state.companies.map((company) =>
          company._id === action.payload._id ? action.payload : company
        ),
      };
    case "DELETE_COMPANY":
      return {
        ...state,
        companies: state.companies.filter(
          (company) => company._id !== action.payload
        ),
      };
    case "ADD_POSITION":
      return { ...state, positions: [...state.positions, action.payload] };
    case "UPDATE_POSITION":
      return {
        ...state,
        positions: state.positions.map((position) =>
          position._id === action.payload._id ? action.payload : position
        ),
      };
    case "DELETE_POSITION":
      return {
        ...state,
        positions: state.positions.filter(
          (position) => position._id !== action.payload
        ),
      };
    default:
      return state;
  }
};

// Create context
const ConnectionsContext = createContext<ConnectionsContextType | undefined>(
  undefined
);

// Provider component
export const ConnectionsProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(connectionsReducer, initialState);

  // Connection actions
  const fetchConnections = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const connections = await connectionService.getAll();
      dispatch({ type: "SET_CONNECTIONS", payload: connections });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch connections" });
    }
  };

  const createConnection = async (
    connection: Omit<Connection, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newConnection = await connectionService.create(connection);
      dispatch({ type: "ADD_CONNECTION", payload: newConnection });
      return newConnection;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to create connection" });
      throw error;
    }
  };

  const updateConnection = async (
    id: string,
    connection: Partial<Connection>
  ) => {
    try {
      const updatedConnection = await connectionService.update(id, connection);
      dispatch({ type: "UPDATE_CONNECTION", payload: updatedConnection });
      return updatedConnection;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update connection" });
      throw error;
    }
  };

  const deleteConnection = async (id: string) => {
    try {
      await connectionService.delete(id);
      dispatch({ type: "DELETE_CONNECTION", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete connection" });
      throw error;
    }
  };

  // Company actions
  const fetchCompanies = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const companies = await companyService.getAll();
      dispatch({ type: "SET_COMPANIES", payload: companies });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch companies" });
    }
  };

  const createCompany = async (
    company: Omit<Company, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newCompany = await companyService.create(company);
      dispatch({ type: "ADD_COMPANY", payload: newCompany });
      return newCompany;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to create company" });
      throw error;
    }
  };

  const updateCompany = async (id: string, company: Partial<Company>) => {
    try {
      const updatedCompany = await companyService.update(id, company);
      dispatch({ type: "UPDATE_COMPANY", payload: updatedCompany });
      return updatedCompany;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update company" });
      throw error;
    }
  };

  const deleteCompany = async (id: string) => {
    try {
      await companyService.delete(id);
      dispatch({ type: "DELETE_COMPANY", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete company" });
      throw error;
    }
  };

  // Position actions
  const fetchPositions = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true });
      const positions = await positionService.getAll();
      dispatch({ type: "SET_POSITIONS", payload: positions });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to fetch positions" });
    }
  };

  const createPosition = async (
    position: Omit<Position, "_id" | "userId" | "createdAt" | "updatedAt">
  ) => {
    try {
      const newPosition = await positionService.create(position);
      dispatch({ type: "ADD_POSITION", payload: newPosition });
      return newPosition;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to create position" });
      throw error;
    }
  };

  const updatePosition = async (id: string, position: Partial<Position>) => {
    try {
      const updatedPosition = await positionService.update(id, position);
      dispatch({ type: "UPDATE_POSITION", payload: updatedPosition });
      return updatedPosition;
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update position" });
      throw error;
    }
  };

  const deletePosition = async (id: string) => {
    try {
      await positionService.delete(id);
      dispatch({ type: "DELETE_POSITION", payload: id });
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete position" });
      throw error;
    }
  };

  // Utility functions
  const getConnectionById = (id: string) =>
    state.connections.find((conn) => conn._id === id);
  const getCompanyById = (id: string) =>
    state.companies.find((company) => company._id === id);
  const getPositionsByConnectionId = (connectionId: string) =>
    state.positions.filter(
      (position) => position.connectionId === connectionId
    );
  const getPositionsByCompanyId = (companyId: string) =>
    state.positions.filter((position) => position.companyId === companyId);

  const value: ConnectionsContextType = {
    state,
    fetchConnections,
    createConnection,
    updateConnection,
    deleteConnection,
    fetchCompanies,
    createCompany,
    updateCompany,
    deleteCompany,
    fetchPositions,
    createPosition,
    updatePosition,
    deletePosition,
    getConnectionById,
    getCompanyById,
    getPositionsByConnectionId,
    getPositionsByCompanyId,
  };

  return (
    <ConnectionsContext.Provider value={value}>
      {children}
    </ConnectionsContext.Provider>
  );
};

// Hook to use the context
export const useConnections = (): ConnectionsContextType => {
  const context = useContext(ConnectionsContext);
  if (!context) {
    throw new Error("useConnections must be used within a ConnectionsProvider");
  }
  return context;
};
