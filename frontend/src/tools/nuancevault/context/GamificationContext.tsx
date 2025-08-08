import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { nuanceService } from "../services/api";

// Local-only gamification stats; does not affect backend schema.
export interface SetStats {
  id: string; // _id or derived key
  attempts: number;
  correct: number;
  lastAttempt?: string; // ISO timestamp
  streak: number; // per-set streak
}

interface GamificationState {
  totalXP: number;
  level: number; // derived
  nextLevelXP: number; // xp remaining to next level
  dailyStreak: number; // consecutive days with a practice
  lastPracticeDay?: string; // yyyy-mm-dd
  sets: Record<string, SetStats>;
}

interface GamificationContextValue extends GamificationState {
  recordPractice: (setKey: string, wasCorrect: boolean) => Promise<void>;
  resetProgress: () => Promise<void>;
  syncFromServer: () => Promise<void>;
  masteryFor: (setKey: string) => number; // 0-100 mastery score
  syncing: boolean;
  optimistic: boolean;
  error: string | null;
}

const STORAGE_KEY = "nuancevault_gamification_v1";

const baseState: GamificationState = {
  totalXP: 0,
  level: 1,
  nextLevelXP: 100,
  dailyStreak: 0,
  lastPracticeDay: undefined,
  sets: {},
};

const GamificationContext = createContext<GamificationContextValue | undefined>(
  undefined
);

// XP gain formula with streak bonus.
const gainXP = (wasCorrect: boolean, streak: number) => {
  let xp = wasCorrect ? 10 : 2; // base xp even on miss keeps user engaged
  if (wasCorrect && streak > 0) xp += Math.min(streak * 2, 20); // cap bonus
  return xp;
};

const calcLevelInfo = (xp: number) => {
  // Level thresholds: cumulative = (n(n+1)/2)*100
  let n = 1;
  while (((n * (n + 1)) / 2) * 100 <= xp) n++;
  const level = n;
  const prevThreshold = (((level - 1) * level) / 2) * 100;
  const nextThreshold = ((level * (level + 1)) / 2) * 100;
  return {
    level,
    nextLevelXP: nextThreshold - xp,
    progressInLevel: xp - prevThreshold,
    levelSpan: nextThreshold - prevThreshold,
  };
};

export const GamificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<GamificationState>(baseState);
  const [syncing, setSyncing] = useState(false);
  const [optimistic, setOptimistic] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load local first, then server
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GamificationState;
        setState((prev) => ({ ...prev, ...parsed }));
      }
    } catch (_) {
      // ignore
    }
    // async server sync
    syncFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      // ignore
    }
  }, [state]);

  const isMongoId = (v: string) => /^[a-f\d]{24}$/i.test(v);

  const mergeServer = (remote: any) => {
    if (!remote) return;
    const setsRecord: GamificationState["sets"] = {};
    (remote.sets || []).forEach((s: any) => {
      setsRecord[s.setId] = {
        id: s.setId,
        attempts: s.attempts,
        correct: s.correct,
        streak: s.streak,
        lastAttempt: s.lastAttempt
          ? new Date(s.lastAttempt).toISOString()
          : undefined,
      };
    });
    setState((prev) => ({
      ...prev,
      totalXP: remote.totalXP ?? prev.totalXP,
      dailyStreak: remote.dailyStreak ?? prev.dailyStreak,
      lastPracticeDay: remote.lastPracticeDay ?? prev.lastPracticeDay,
      sets: { ...prev.sets, ...setsRecord },
    }));
  };

  const syncFromServer = async () => {
    setSyncing(true);
    setError(null);
    try {
      const remote = await nuanceService.getGamification();
      mergeServer(remote);
    } catch (e) {
      setError("Failed to sync gamification");
    } finally {
      setSyncing(false);
    }
  };

  const recordPractice = async (setKey: string, wasCorrect: boolean) => {
    setOptimistic(true);
    setError(null);
    // Optimistic update
    const today = new Date();
    const dayKey = today.toISOString().slice(0, 10);
    setState((prev) => {
      let dailyStreak = prev.dailyStreak;
      if (!prev.lastPracticeDay) dailyStreak = 1;
      else if (prev.lastPracticeDay === dayKey) {
        // unchanged
      } else {
        const yesterday = new Date(today.getTime() - 86400000)
          .toISOString()
          .slice(0, 10);
        dailyStreak =
          prev.lastPracticeDay === yesterday ? prev.dailyStreak + 1 : 1;
      }
      const existing = prev.sets[setKey] || {
        id: setKey,
        attempts: 0,
        correct: 0,
        streak: 0,
      };
      const newStreak = wasCorrect ? existing.streak + 1 : 0;
      const xpGain = gainXP(wasCorrect, newStreak);
      const update: SetStats = {
        ...existing,
        attempts: existing.attempts + 1,
        correct: existing.correct + (wasCorrect ? 1 : 0),
        streak: newStreak,
        lastAttempt: today.toISOString(),
      };
      return {
        ...prev,
        totalXP: prev.totalXP + xpGain,
        sets: { ...prev.sets, [setKey]: update },
        dailyStreak,
        lastPracticeDay: dayKey,
      };
    });
    if (isMongoId(setKey)) {
      try {
        const resp = await nuanceService.recordPractice(setKey, wasCorrect);
        mergeServer(resp.data);
      } catch (e) {
        setError("Practice sync failed");
      }
    }
    setOptimistic(false);
  };

  const resetProgress = async () => {
    setState(baseState);
    try {
      await nuanceService.resetGamification();
    } catch (_) {
      // ignore
    }
  };

  const masteryFor = (setKey: string) => {
    const s = state.sets[setKey];
    if (!s || s.attempts === 0) return 0;
    return Math.round((s.correct / s.attempts) * 100);
  };

  const { level, nextLevelXP, progressInLevel, levelSpan } = useMemo(
    () => calcLevelInfo(state.totalXP),
    [state.totalXP]
  );

  const value: GamificationContextValue = {
    ...state,
    level,
    nextLevelXP,
    recordPractice,
    resetProgress,
    masteryFor,
    syncing,
    optimistic,
    error,
    syncFromServer,
  } as GamificationContextValue & {
    progressInLevel?: number;
    levelSpan?: number;
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const ctx = useContext(GamificationContext);
  if (!ctx)
    throw new Error("useGamification must be used within GamificationProvider");
  return ctx;
};

// Optional variant that returns undefined instead of throwing if provider missing.
export const useGamificationSafe = () => useContext(GamificationContext);
