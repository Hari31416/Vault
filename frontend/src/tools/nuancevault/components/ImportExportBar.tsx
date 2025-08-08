import React, { useRef } from "react";
import { useNuanceVault } from "../context/NuanceVaultContext";
import { SimilarWordSet } from "../types";

interface Props {
  onNew: () => void;
}

const ImportExportBar: React.FC<Props> = ({ onNew }) => {
  const { importSets, exportSets, state, setQuery, fetchSets } =
    useNuanceVault();
  const fileInput = useRef<HTMLInputElement | null>(null);

  const handleFile = async (file: File) => {
    const text = await file.text();
    let parsed: any;
    if (file.name.endsWith(".json")) {
      parsed = JSON.parse(text);
    } else if (file.name.endsWith(".csv")) {
      parsed = csvToJson(text);
    } else {
      alert("Unsupported file type");
      return;
    }
    await importSets(
      parsed as Omit<SimilarWordSet, "_id" | "createdAt" | "updatedAt">[]
    );
  };

  const csvToJson = (csv: string) => {
    const lines = csv.trim().split(/\r?\n/);
    const header = lines.shift();
    if (!header) return [];
    return lines.map((line) => {
      // naive CSV parse (commas inside quotes escaped earlier by backend using double quotes)
      const parts = line.match(/(?:\"(?:.|\n)*?\"|[^,])+/g) || [];
      const [wordsRaw, definitionRaw, subtleRaw, examplesRaw] = parts as (
        | string
        | undefined
      )[];
      const unquote = (v?: string) =>
        (v || "").replace(/^"|"$/g, "").replace(/""/g, '"');
      return {
        words: unquote(wordsRaw)
          .split(";")
          .map((w) => w.trim())
          .filter(Boolean),
        definition: unquote(definitionRaw),
        subtleDifference: unquote(subtleRaw),
        exampleSentences: unquote(examplesRaw)
          .split("|")
          .map((e) => e.trim())
          .filter(Boolean),
      };
    });
  };

  const handleImportClick = () => fileInput.current?.click();

  return (
    <div
      className="toolbar"
      style={{
        display: "flex",
        gap: 8,
        flexWrap: "wrap",
        alignItems: "center",
      }}
    >
      <h1 style={{ margin: 0, fontSize: 22 }}>NuanceVault</h1>
      <div style={{ flex: 1 }} />
      <input
        type="text"
        placeholder="Search..."
        value={state.query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && fetchSets()}
        style={{
          padding: "6px 10px",
          minWidth: 180,
          background: "var(--input-bg)",
          color: "var(--text-color)",
          border: "1px solid var(--border-color)",
          borderRadius: 6,
          font: "inherit",
          lineHeight: 1.2,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04) inset",
        }}
      />
      <button className="btn" onClick={() => fetchSets()}>
        Search
      </button>
      <button className="btn outline" onClick={handleImportClick}>
        Import
      </button>
      <button className="btn outline" onClick={() => exportSets("json")}>
        Export JSON
      </button>
      <button className="btn outline" onClick={() => exportSets("csv")}>
        Export CSV
      </button>
      <button className="btn primary" onClick={onNew}>
        New Set
      </button>
      <input
        ref={fileInput}
        type="file"
        accept=".json,.csv"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
};

export default ImportExportBar;
