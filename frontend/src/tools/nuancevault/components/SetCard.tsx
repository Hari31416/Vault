import React, { useMemo } from "react";
import { SimilarWordSet } from "../types";
import { useGamificationSafe } from "../context/GamificationContext";

interface Props {
  set: SimilarWordSet;
  onEdit: (set: SimilarWordSet) => void;
  onDelete: (id: string) => void;
}

const truncate = (s: string, n = 140) =>
  s.length > n ? s.slice(0, n) + "…" : s;

const SetCard: React.FC<Props> = ({ set, onEdit, onDelete }) => {
  const gamification = useGamificationSafe();
  const masteryFor = gamification?.masteryFor || (() => 0);
  const sets = gamification?.sets || {};
  const derivedKey = useMemo(
    () => set.words.slice().sort().join("|"),
    [set.words]
  );
  const key = set._id ?? derivedKey;
  const mastery = masteryFor(key);
  const stats = sets[key];
  const attempts = stats?.attempts || 0;

  const ring = (
    <div
      style={{ position: "relative", width: 48, height: 48 }}
      aria-label={`Mastery ${mastery}%`}
    >
      <svg viewBox="0 0 36 36" style={{ width: 48, height: 48 }}>
        <path
          d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={3.5}
          opacity={0.35}
        />
        <path
          d="M18 2 a 16 16 0 0 1 0 32 a 16 16 0 0 1 0 -32"
          fill="none"
          stroke="var(--primary-color)"
          strokeWidth={3.5}
          strokeDasharray={`${(mastery / 100) * 100} 100`}
          strokeDashoffset={25}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray .6s ease" }}
        />
        <text
          x="18"
          y="21"
          textAnchor="middle"
          fontSize={10}
          fontWeight={600}
          fill="var(--text-color)"
        >
          {mastery}%
        </text>
      </svg>
    </div>
  );

  return (
    <div
      className="card"
      style={{
        padding: 16,
        position: "relative",
        borderRadius: 18,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        gap: 8,
        background: "linear-gradient(145deg,var(--card-bg),var(--hover-bg))",
        border: "1px solid var(--border-color)",
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {ring}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontWeight: 600,
              marginBottom: 2,
              color: "var(--text-color)",
              lineHeight: 1.15,
              fontSize: 15,
              letterSpacing: ".25px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical" as const,
              overflow: "hidden",
            }}
          >
            {set.words.join(", ")}
          </div>
          <div
            style={{
              fontSize: 12,
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: ".5px",
              color: "var(--text-secondary)",
            }}
          >
            {attempts} attempt{attempts === 1 ? "" : "s"}
          </div>
        </div>
      </div>
      <div
        style={{
          fontSize: 13,
          color: "var(--text-secondary)",
          lineHeight: 1.35,
          flexGrow: 1,
        }}
      >
        {truncate(set.definition)}
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 4, flexWrap: "wrap" }}>
        <button className="btn tiny" onClick={() => onEdit(set)}>
          Edit
        </button>
        <button
          className="btn tiny outline"
          onClick={() => {
            const evt = new CustomEvent("nuancevault:practice", {
              detail: set,
            });
            window.dispatchEvent(evt);
          }}
        >
          Practice
        </button>
        {set._id && (
          <button
            className="btn tiny outline"
            onClick={() => set._id && onDelete(set._id!)}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default SetCard;
