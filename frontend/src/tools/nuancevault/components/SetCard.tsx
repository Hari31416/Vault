import React from "react";
import { SimilarWordSet } from "../types";

interface Props {
  set: SimilarWordSet;
  onEdit: (set: SimilarWordSet) => void;
  onDelete: (id: string) => void;
}

const truncate = (s: string, n = 140) =>
  s.length > n ? s.slice(0, n) + "…" : s;

const SetCard: React.FC<Props> = ({ set, onEdit, onDelete }) => {
  return (
    <div className="card" style={{ padding: 16, position: "relative" }}>
      <div
        style={{
          fontWeight: 600,
          marginBottom: 4,
          color: "var(--text-color)",
          lineHeight: 1.15,
          fontSize: 15,
          letterSpacing: ".25px",
        }}
      >
        {set.words.join(", ")}
      </div>
      <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>
        {truncate(set.definition)}
      </div>
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button className="btn tiny" onClick={() => onEdit(set)}>
          Edit
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
