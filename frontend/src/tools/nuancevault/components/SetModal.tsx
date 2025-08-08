import React, { useState, useEffect } from "react";
import { SimilarWordSet } from "../types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<SimilarWordSet, "_id" | "createdAt" | "updatedAt">,
    id?: string
  ) => Promise<void>;
  editing?: SimilarWordSet | null;
}

const SetModal: React.FC<Props> = ({ isOpen, onClose, onSave, editing }) => {
  const [wordsInput, setWordsInput] = useState("");
  const [definition, setDefinition] = useState("");
  const [subtleDifference, setSubtleDifference] = useState("");
  const [examplesInput, setExamplesInput] = useState("");
  const [errors, setErrors] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setWordsInput(editing.words.join("; "));
      setDefinition(editing.definition);
      setSubtleDifference(editing.subtleDifference);
      setExamplesInput(editing.exampleSentences.join("\n"));
    } else if (isOpen) {
      setWordsInput("");
      setDefinition("");
      setSubtleDifference("");
      setExamplesInput("");
      setErrors([]);
    }
  }, [editing, isOpen]);

  if (!isOpen) return null;

  const parseWords = () => {
    return wordsInput
      .split(/[;\n]/)
      .map((w) => w.trim())
      .filter(Boolean)
      .filter(
        (v, i, arr) =>
          arr.findIndex((x) => x.toLowerCase() === v.toLowerCase()) === i
      );
  };
  const parseExamples = () => {
    return examplesInput
      .split(/\n/)
      .map((e) => e.trim())
      .filter(Boolean);
  };

  const validate = () => {
    const errs: string[] = [];
    const words = parseWords();
    const examples = parseExamples();
    if (words.length < 2) errs.push("At least 2 words");
    if (!definition.trim() || definition.length > 300)
      errs.push("Definition 1-300 chars");
    if (!subtleDifference.trim() || subtleDifference.length > 400)
      errs.push("Subtle difference 1-400 chars");
    if (examples.length < 1 || examples.length > 5)
      errs.push("1-5 example sentences");
    if (!examples.every((e) => e.length <= 140))
      errs.push("Examples max 140 chars each");
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave(
        {
          words: parseWords(),
          definition: definition.trim(),
          subtleDifference: subtleDifference.trim(),
          exampleSentences: parseExamples(),
        },
        editing?._id
      );
    } catch (err) {
      setErrors(["Failed to save set"]);
    } finally {
      setSaving(false);
    }
  };

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    zIndex: 1000,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    overflowY: "auto",
    padding: "56px 16px 32px",
  };
  const panelStyle: React.CSSProperties = {
    background: "var(--card-bg)",
    color: "var(--text-color)",
    width: "100%",
    maxWidth: 720,
    borderRadius: 12,
    boxShadow: "0 4px 18px rgba(0,0,0,0.4)",
    padding: 24,
    border: "1px solid var(--border-color)",
    backdropFilter: "blur(4px)",
  };
  const gridStyle: React.CSSProperties = {
    display: "grid",
    gap: 16,
  };
  const labelStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  };

  return (
    <div
      style={overlayStyle}
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        // close when clicking outside panel
        if (e.target === e.currentTarget && !saving) onClose();
      }}
    >
      <div style={panelStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 22 }}>
            {editing ? "Edit Similar Word Set" : "New Similar Word Set"}
          </h2>
          <button
            type="button"
            aria-label="Close"
            className="btn outline"
            onClick={onClose}
            disabled={saving}
            style={{ lineHeight: 1 }}
          >
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} style={gridStyle}>
          <label style={labelStyle}>
            <span style={{ fontWeight: 500 }}>
              Words (semicolon or newline separated)
            </span>
            <textarea
              value={wordsInput}
              onChange={(e) => setWordsInput(e.target.value)}
              rows={2}
              required
              autoFocus
              placeholder="ask; inquire; question"
              style={{
                background: "var(--input-bg)",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                borderRadius: 6,
                padding: 8,
                fontFamily: "inherit",
              }}
            />
          </label>
          <label style={labelStyle}>
            <span style={{ fontWeight: 500 }}>
              Definition (shared core sense)
            </span>
            <textarea
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              rows={2}
              required
              maxLength={300}
              placeholder="Different verbs used to request information — vary by formality and nuance."
              style={{
                background: "var(--input-bg)",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                borderRadius: 6,
                padding: 8,
                fontFamily: "inherit",
              }}
            />
          </label>
          <label style={labelStyle}>
            <span style={{ fontWeight: 500 }}>Subtle Difference</span>
            <textarea
              value={subtleDifference}
              onChange={(e) => setSubtleDifference(e.target.value)}
              rows={3}
              required
              maxLength={400}
              placeholder="'Ask' is general and informal; 'inquire' is formal; 'question' implies doubt..."
              style={{
                background: "var(--input-bg)",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                borderRadius: 6,
                padding: 8,
                fontFamily: "inherit",
              }}
            />
          </label>
          <label style={labelStyle}>
            <span style={{ fontWeight: 500 }}>
              Example Sentences (one per line)
            </span>
            <textarea
              value={examplesInput}
              onChange={(e) => setExamplesInput(e.target.value)}
              rows={4}
              required
              placeholder={`Can I ask you a quick favor?\nWe will inquire about the status...\nShe questioned the accuracy of the report.`}
              style={{
                background: "var(--input-bg)",
                color: "var(--text-color)",
                border: "1px solid var(--border-color)",
                borderRadius: 6,
                padding: 8,
                fontFamily: "inherit",
                whiteSpace: "pre-wrap",
              }}
            />
          </label>
          {errors.length > 0 && (
            <div
              className="error-box"
              role="alert"
              style={{
                background: "var(--danger-bg)",
                color: "var(--danger-color)",
                padding: 12,
                borderRadius: 8,
                border: "1px solid var(--danger-border)",
              }}
            >
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {errors.map((er, i) => (
                  <li key={i}>{er}</li>
                ))}
              </ul>
            </div>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 12,
              marginTop: 4,
            }}
          >
            <button
              type="button"
              className="btn"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={saving}>
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetModal;
