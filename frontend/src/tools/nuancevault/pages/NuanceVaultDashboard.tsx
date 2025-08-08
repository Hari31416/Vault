import React, { useEffect, useState } from "react";
import { useNuanceVault } from "../context/NuanceVaultContext";
import SetModal from "../components/SetModal";
import ImportExportBar from "../components/ImportExportBar";
import SetCard from "../components/SetCard";
import PracticeModal from "../components/PracticeModal";
import { useGamification } from "../context/GamificationContext";
import { SimilarWordSet } from "../types";

const NuanceVaultDashboard: React.FC = () => {
  const { state, fetchSets, createSet, updateSet, deleteSet } =
    useNuanceVault();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SimilarWordSet | null>(null);
  const [practicing, setPracticing] = useState<SimilarWordSet | null>(null);
  const { level, totalXP, nextLevelXP, dailyStreak } = useGamification();

  useEffect(() => {
    fetchSets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async (
    data: Omit<SimilarWordSet, "_id" | "createdAt" | "updatedAt">,
    id?: string
  ) => {
    if (id) await updateSet(id, data);
    else await createSet(data);
    setShowModal(false);
    setEditing(null);
  };

  const onNew = () => {
    // Reset editing then open modal on next tick to guarantee re-render
    setEditing(null);
    setShowModal(true);
  };

  const onEdit = (s: SimilarWordSet) => {
    setEditing(s);
    setShowModal(true);
  };

  const onDelete = async (id: string) => {
    if (window.confirm("Delete this set?")) {
      await deleteSet(id);
    }
  };

  const empty = !state.loading && state.sets.length === 0;

  React.useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<SimilarWordSet>;
      setPracticing(custom.detail);
    };
    window.addEventListener("nuancevault:practice", handler);
    return () => window.removeEventListener("nuancevault:practice", handler);
  }, []);

  const gamifiedHeader = (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        marginTop: 12,
        alignItems: "stretch",
      }}
    >
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          padding: "12px 16px",
          borderRadius: 14,
          flex: "1 1 180px",
          minWidth: 180,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: ".5px",
            opacity: 0.7,
          }}
        >
          LEVEL
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{level}</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>
          Next in {nextLevelXP} XP
        </div>
      </div>
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          padding: "12px 16px",
          borderRadius: 14,
          flex: "1 1 220px",
          minWidth: 220,
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: ".5px",
            opacity: 0.7,
          }}
        >
          XP
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{totalXP}</div>
        <div
          style={{
            height: 8,
            background: "var(--hover-bg)",
            borderRadius: 6,
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              width: `${Math.min(100, ((100 - nextLevelXP) / 100) * 100)}%`,
              background:
                "linear-gradient(90deg,var(--primary-color),var(--secondary-color))",
              transition: "width .6s ease",
            }}
          />
        </div>
      </div>
      <div
        style={{
          background: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          padding: "12px 16px",
          borderRadius: 14,
          flex: "1 1 180px",
          minWidth: 180,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: ".5px",
            opacity: 0.7,
          }}
        >
          DAILY STREAK
        </div>
        <div style={{ fontSize: 22, fontWeight: 700 }}>{dailyStreak} 🔥</div>
        <div style={{ fontSize: 12, opacity: 0.8 }}>Keep it going</div>
      </div>
    </div>
  );

  return (
    <div className="container" style={{ padding: 16 }}>
      <ImportExportBar onNew={onNew} />
      {gamifiedHeader}
      {state.loading && <p>Loading...</p>}
      {state.error && <div className="error-box">{state.error}</div>}
      {empty && (
        <div style={{ textAlign: "center", marginTop: 80 }}>
          <p style={{ fontSize: 18 }}>No similar word sets yet</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <button className="btn primary" onClick={() => onNew()}>
              Create Set
            </button>
            <button
              className="btn outline"
              onClick={() =>
                document
                  .querySelector<HTMLInputElement>('input[type="file"]')
                  ?.click()
              }
            >
              Import
            </button>
          </div>
        </div>
      )}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
          gap: 16,
          marginTop: 16,
        }}
      >
        {state.sets.map((s) => (
          <SetCard key={s._id} set={s} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </div>
      <PracticeModal set={practicing} onClose={() => setPracticing(null)} />
      <SetModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditing(null);
        }}
        onSave={handleSave}
        editing={editing}
      />
    </div>
  );
};

export default NuanceVaultDashboard;
