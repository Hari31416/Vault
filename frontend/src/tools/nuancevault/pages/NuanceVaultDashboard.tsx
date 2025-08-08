import React, { useEffect, useState } from "react";
import { useNuanceVault } from "../context/NuanceVaultContext";
import SetModal from "../components/SetModal";
import ImportExportBar from "../components/ImportExportBar";
import SetCard from "../components/SetCard";
import { SimilarWordSet } from "../types";

const NuanceVaultDashboard: React.FC = () => {
  const { state, fetchSets, createSet, updateSet, deleteSet } =
    useNuanceVault();
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<SimilarWordSet | null>(null);

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

  return (
    <div className="container" style={{ padding: 16 }}>
      <ImportExportBar onNew={onNew} />
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
