import axios from "axios";
import { Connection, Company, Position } from "../types";
import { API_BASE_URL } from "../../../config/api";

const CONNECTIONS_API_BASE = `${API_BASE_URL}/tools/connections`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

// Connection API calls
export const connectionService = {
  async getAll(): Promise<Connection[]> {
    const response = await axios.get(
      `${CONNECTIONS_API_BASE}/connections`,
      getAuthHeaders()
    );
    return response.data.data || [];
  },

  async getById(id: string): Promise<Connection> {
    const response = await axios.get(
      `${CONNECTIONS_API_BASE}/connections/${id}`,
      getAuthHeaders()
    );
    return response.data.data;
  },

  async create(
    connection: Omit<Connection, "_id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Connection> {
    const response = await axios.post(
      `${CONNECTIONS_API_BASE}/connections`,
      connection,
      getAuthHeaders()
    );
    return response.data.data;
  },

  async update(
    id: string,
    connection: Partial<Connection>
  ): Promise<Connection> {
    const response = await axios.put(
      `${CONNECTIONS_API_BASE}/connections/${id}`,
      connection,
      getAuthHeaders()
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(
      `${CONNECTIONS_API_BASE}/connections/${id}`,
      getAuthHeaders()
    );
  },

  async search(query: string): Promise<Connection[]> {
    const response = await axios.get(
      `${CONNECTIONS_API_BASE}/connections/search?q=${encodeURIComponent(
        query
      )}`,
      getAuthHeaders()
    );
    return response.data.data || [];
  },
};

// Company API calls
export const companyService = {
  async getAll(): Promise<Company[]> {
    const response = await axios.get(
      `${CONNECTIONS_API_BASE}/companies`,
      getAuthHeaders()
    );
    return response.data.data || [];
  },

  async getById(id: string): Promise<Company> {
    const response = await axios.get(
      `${CONNECTIONS_API_BASE}/companies/${id}`,
      getAuthHeaders()
    );
    return response.data.data;
  },

  async create(
    company: Omit<Company, "_id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Company> {
    const response = await axios.post(
      `${CONNECTIONS_API_BASE}/companies`,
      company,
      getAuthHeaders()
    );
    return response.data.data;
  },

  async update(id: string, company: Partial<Company>): Promise<Company> {
    const response = await axios.put(
      `${CONNECTIONS_API_BASE}/companies/${id}`,
      company,
      getAuthHeaders()
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(
      `${CONNECTIONS_API_BASE}/companies/${id}`,
      getAuthHeaders()
    );
  },

  async search(query: string): Promise<Company[]> {
    const response = await axios.get(
      `${CONNECTIONS_API_BASE}/companies/search?q=${encodeURIComponent(query)}`,
      getAuthHeaders()
    );
    return response.data.data || [];
  },
};

// Position API calls
export const positionService = {
  async getAll(): Promise<Position[]> {
    const response = await axios.get(
      `${CONNECTIONS_API_BASE}/positions`,
      getAuthHeaders()
    );
    return response.data.data || [];
  },

  async getById(id: string): Promise<Position> {
    const response = await axios.get(
      `${CONNECTIONS_API_BASE}/positions/${id}`,
      getAuthHeaders()
    );
    return response.data.data;
  },

  async getByConnectionId(connectionId: string): Promise<Position[]> {
    const response = await axios.get(
      `${CONNECTIONS_API_BASE}/positions/connection/${connectionId}`,
      getAuthHeaders()
    );
    return response.data.data || [];
  },

  async getByCompanyId(companyId: string): Promise<Position[]> {
    const response = await axios.get(
      `${CONNECTIONS_API_BASE}/positions/company/${companyId}`,
      getAuthHeaders()
    );
    return response.data.data || [];
  },

  async create(
    position: Omit<Position, "_id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<Position> {
    const response = await axios.post(
      `${CONNECTIONS_API_BASE}/positions`,
      position,
      getAuthHeaders()
    );
    return response.data.data;
  },

  async update(id: string, position: Partial<Position>): Promise<Position> {
    const response = await axios.put(
      `${CONNECTIONS_API_BASE}/positions/${id}`,
      position,
      getAuthHeaders()
    );
    return response.data.data;
  },

  async delete(id: string): Promise<void> {
    await axios.delete(
      `${CONNECTIONS_API_BASE}/positions/${id}`,
      getAuthHeaders()
    );
  },
};
