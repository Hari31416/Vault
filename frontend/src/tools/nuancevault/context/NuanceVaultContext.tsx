import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useCallback,
} from "react";
import { SimilarWordSet } from "../types";
import { nuanceService } from "../services/api";

interface State {
  sets: SimilarWordSet[];
  loading: boolean;
  error: string | null;
  query: string;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_SETS"; payload: SimilarWordSet[] }
  | { type: "ADD_SET"; payload: SimilarWordSet }
  | { type: "UPDATE_SET"; payload: SimilarWordSet }
  | { type: "DELETE_SET"; payload: string }
  | { type: "SET_QUERY"; payload: string };

const initialState: State = {
  sets: [],
  loading: false,
  error: null,
  query: "",
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, loading: false };
    case "SET_SETS":
      return { ...state, sets: action.payload, loading: false };
    case "ADD_SET":
      return { ...state, sets: [action.payload, ...state.sets] };
    case "UPDATE_SET":
      return {
        ...state,
        sets: state.sets.map((s) =>
          s._id === action.payload._id ? action.payload : s
        ),
      };
    case "DELETE_SET":
      return {
        ...state,
        sets: state.sets.filter((s) => s._id !== action.payload),
      };
    case "SET_QUERY":
      return { ...state, query: action.payload };
    default:
      return state;
  }
};

interface Ctx {
  state: State;
  fetchSets: (q?: string) => Promise<void>;
  createSet: (
    data: Omit<SimilarWordSet, "_id" | "createdAt" | "updatedAt">
  ) => Promise<SimilarWordSet>;
  updateSet: (
    id: string,
    data: Partial<SimilarWordSet>
  ) => Promise<SimilarWordSet>;
  deleteSet: (id: string) => Promise<void>;
  importSets: (
    sets: Omit<SimilarWordSet, "_id" | "createdAt" | "updatedAt">[]
  ) => Promise<void>;
  exportSets: (format: "json" | "csv") => Promise<void>;
  setQuery: (q: string) => void;
}

const NuanceVaultContext = createContext<Ctx | undefined>(undefined);

export const NuanceVaultProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const fetchSets = useCallback(
    async (q?: string) => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });
        const sets = await nuanceService.list(q || state.query || undefined);
        dispatch({ type: "SET_SETS", payload: sets });
      } catch (e) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load sets" });
      }
    },
    [state.query]
  );

  const createSet = async (
    data: Omit<SimilarWordSet, "_id" | "createdAt" | "updatedAt">
  ) => {
    const created = await nuanceService.create(data);
    dispatch({ type: "ADD_SET", payload: created });
    return created;
  };

  const updateSet = async (id: string, data: Partial<SimilarWordSet>) => {
    const updated = await nuanceService.update(id, data);
    dispatch({ type: "UPDATE_SET", payload: updated });
    return updated;
  };

  const deleteSet = async (id: string) => {
    await nuanceService.remove(id);
    dispatch({ type: "DELETE_SET", payload: id });
  };

  const importSets = async (
    sets: Omit<SimilarWordSet, "_id" | "createdAt" | "updatedAt">[]
  ) => {
    await nuanceService.importSets(sets);
    await fetchSets();
  };

  const exportSets = async (format: "json" | "csv") => {
    const blob = await nuanceService.export(format);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `similar_word_sets.${format === "csv" ? "csv" : "json"}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const setQuery = (q: string) => {
    dispatch({ type: "SET_QUERY", payload: q });
  };

  const value: Ctx = {
    state,
    fetchSets,
    createSet,
    updateSet,
    deleteSet,
    importSets,
    exportSets,
    setQuery,
  };

  return (
    <NuanceVaultContext.Provider value={value}>
      {children}
    </NuanceVaultContext.Provider>
  );
};

export const useNuanceVault = () => {
  const ctx = useContext(NuanceVaultContext);
  if (!ctx)
    throw new Error("useNuanceVault must be used within NuanceVaultProvider");
  return ctx;
};
