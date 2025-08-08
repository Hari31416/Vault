import React, { useState, useEffect } from "react";
import { SimilarWordSet } from "../types";
import { useGamification } from "../context/GamificationContext";

interface Props {
  set: SimilarWordSet | null;
  onClose: () => void;
}

// Practice a single similar word set (flashcard style)
const PracticeModal: React.FC<Props> = ({ set, onClose }) => {
  const { recordPractice } = useGamification();
  const [revealed, setRevealed] = useState(false);

  // Reset reveal state whenever a new set is opened (or closed then reopened)
  useEffect(() => {
    setRevealed(false);
  }, [set?._id]);
  if (!set) return null;
  const key = set._id || set.words.slice().sort().join("|");

  const handleResult = (correct: boolean) => {
    recordPractice(key, correct);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        zIndex: 1200,
      }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: "var(--card-bg)",
          color: "var(--text-color)",
          width: "100%",
          maxWidth: 520,
          borderRadius: 16,
          padding: 28,
          border: "1px solid var(--border-color)",
          boxShadow: "0 10px 30px -8px rgba(0,0,0,.4)",
          position: "relative",
        }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="btn tiny outline"
          style={{ position: "absolute", top: 12, right: 12 }}
        >
          ✕
        </button>
        <h3 style={{ margin: 0, fontSize: 20, lineHeight: 1.2 }}>Practice</h3>
        <p
          style={{ marginTop: 4, marginBottom: 16, fontSize: 13, opacity: 0.8 }}
        >
          Think about how these words differ, then reveal details and
          self‑assess.
        </p>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            fontSize: 14,
          }}
        >
          <div>
            <strong style={{ fontWeight: 600 }}>Words:</strong>{" "}
            {set.words.join(", ")}
          </div>
          <div
            style={{
              background: "var(--hover-bg)",
              padding: 12,
              borderRadius: 10,
            }}
          >
            <strong>Core Definition</strong>
            <div style={{ marginTop: 4 }}>{set.definition}</div>
          </div>
          {!revealed && (
            <button
              className="btn primary"
              style={{ alignSelf: "center", marginTop: 8 }}
              onClick={() => setRevealed(true)}
            >
              Reveal Nuances
            </button>
          )}
          {revealed && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div
                style={{
                  background: "var(--hover-bg)",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <strong>Subtle Difference</strong>
                <div style={{ marginTop: 4 }}>{set.subtleDifference}</div>
              </div>
              <div
                style={{
                  background: "var(--hover-bg)",
                  padding: 12,
                  borderRadius: 10,
                }}
              >
                <strong>Examples</strong>
                <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                  {set.exampleSentences.map((ex, i) => (
                    <li key={i}>{ex}</li>
                  ))}
                </ul>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 12,
                  justifyContent: "center",
                  marginTop: 4,
                }}
              >
                <button
                  className="btn outline"
                  onClick={() => handleResult(false)}
                >
                  Missed It
                </button>
                <button
                  className="btn primary"
                  onClick={() => handleResult(true)}
                >
                  I Knew It
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PracticeModal;
