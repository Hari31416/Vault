import axios from "axios";
import { SimilarWordSet, ImportResult } from "../types";

const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000/api";
const NV_API_BASE = `${API_BASE}/tools/nuancevault`;

// Auth headers (all routes protected currently)
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

export const nuanceService = {
  async list(q?: string): Promise<SimilarWordSet[]> {
    const url = q
      ? `${NV_API_BASE}/groups?q=${encodeURIComponent(q)}`
      : `${NV_API_BASE}/groups`;
    const res = await axios.get(url, getAuthHeaders());
    return res.data.data || [];
  },
  async get(id: string): Promise<SimilarWordSet> {
    const res = await axios.get(
      `${NV_API_BASE}/groups/${id}`,
      getAuthHeaders()
    );
    return res.data.data;
  },
  async create(
    payload: Omit<SimilarWordSet, "_id" | "createdAt" | "updatedAt">
  ): Promise<SimilarWordSet> {
    const res = await axios.post(
      `${NV_API_BASE}/groups`,
      payload,
      getAuthHeaders()
    );
    return res.data.data;
  },
  async update(
    id: string,
    payload: Partial<SimilarWordSet>
  ): Promise<SimilarWordSet> {
    const res = await axios.put(
      `${NV_API_BASE}/groups/${id}`,
      payload,
      getAuthHeaders()
    );
    return res.data.data;
  },
  async remove(id: string): Promise<void> {
    await axios.delete(`${NV_API_BASE}/groups/${id}`, getAuthHeaders());
  },
  async importSets(
    sets: Omit<SimilarWordSet, "_id" | "createdAt" | "updatedAt">[]
  ): Promise<ImportResult> {
    const res = await axios.post(
      `${NV_API_BASE}/import`,
      sets,
      getAuthHeaders()
    );
    return res.data;
  },
  async export(format: "json" | "csv" = "json"): Promise<Blob> {
    const res = await axios.get(
      `${NV_API_BASE}/export${format === "csv" ? "?format=csv" : ""}`,
      {
        ...getAuthHeaders(),
        responseType: "blob",
      }
    );
    return res.data;
  },
  async getGamification() {
    const res = await axios.get(
      `${NV_API_BASE}/gamification`,
      getAuthHeaders()
    );
    return res.data.data;
  },
  async recordPractice(setId: string, wasCorrect: boolean) {
    const res = await axios.post(
      `${NV_API_BASE}/gamification/practice`,
      { setId, wasCorrect },
      getAuthHeaders()
    );
    return res.data;
  },
  async resetGamification() {
    const res = await axios.post(
      `${NV_API_BASE}/gamification/reset`,
      {},
      getAuthHeaders()
    );
    return res.data;
  },
};
