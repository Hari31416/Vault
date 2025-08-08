import { Request, Response } from "express";
import SimilarWordSet from "../models/SimilarWordSet";
import { Types } from "mongoose";

// Utility validation replicating schema logic (for bulk import pre-insert clarity)
const validateSet = (data: any) => {
  const errors: string[] = [];
  if (!Array.isArray(data.words) || data.words.length < 2) {
    errors.push("words must have at least 2 items");
  } else {
    const cleaned = data.words
      .map((w: any) => (w || "").trim())
      .filter(Boolean);
    const lower = cleaned.map((w: string) => w.toLowerCase());
    if (cleaned.length !== data.words.length)
      errors.push("words contain empty entries");
    if (new Set(lower).size !== lower.length)
      errors.push("words must be unique (case-insensitive)");
  }
  const definition = (data.definition || "").trim();
  if (!definition || definition.length > 300)
    errors.push("definition invalid (1-300 chars)");
  const subtle = (data.subtleDifference || "").trim();
  if (!subtle || subtle.length > 400)
    errors.push("subtleDifference invalid (1-400 chars)");
  if (
    !Array.isArray(data.exampleSentences) ||
    data.exampleSentences.length < 1 ||
    data.exampleSentences.length > 5
  ) {
    errors.push("exampleSentences must have 1-5 items");
  } else if (
    !data.exampleSentences.every(
      (s: any) =>
        typeof s === "string" && s.trim().length > 0 && s.trim().length <= 140
    )
  ) {
    errors.push("each example sentence must be 1-140 chars");
  }
  return errors;
};

// GET /groups
export const listGroups = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    let filter: any = {};
    if (q && typeof q === "string" && q.trim()) {
      const term = q.trim();
      filter = {
        $or: [
          { words: { $regex: term, $options: "i" } },
          { definition: { $regex: term, $options: "i" } },
          { subtleDifference: { $regex: term, $options: "i" } },
        ],
      };
    }
    const sets = await SimilarWordSet.find(filter)
      .sort({ updatedAt: -1 })
      .lean();
    res.json({ success: true, data: sets });
  } catch (err) {
    console.error("Error listing groups", err);
    res.status(500).json({ success: false, message: "Error listing groups" });
  }
};

// GET /groups/:id
export const getGroup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid id" });
      return;
    }
    const set = await SimilarWordSet.findById(id).lean();
    if (!set) {
      res.status(404).json({ success: false, message: "Not found" });
      return;
    }
    res.json({ success: true, data: set });
  } catch (err) {
    console.error("Error fetching group", err);
    res.status(500).json({ success: false, message: "Error fetching group" });
  }
};

// POST /groups
export const createGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { words, definition, subtleDifference, exampleSentences } = req.body;
    const errors = validateSet({
      words,
      definition,
      subtleDifference,
      exampleSentences,
    });
    if (errors.length) {
      res
        .status(400)
        .json({ success: false, message: "Validation failed", errors });
      return;
    }

    const doc = new SimilarWordSet({
      words,
      definition,
      subtleDifference,
      exampleSentences,
    });
    await doc.save();
    res
      .status(201)
      .json({ success: true, data: doc, message: "Group created" });
  } catch (err: any) {
    console.error("Error creating group", err);
    res.status(500).json({ success: false, message: "Error creating group" });
  }
};

// PUT /groups/:id
export const updateGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid id" });
      return;
    }
    const payload: any = {};
    ["words", "definition", "subtleDifference", "exampleSentences"].forEach(
      (k) => {
        if (req.body[k] !== undefined) payload[k] = req.body[k];
      }
    );

    const errors = validateSet({
      ...payload,
      words: payload.words ?? ["a", "b"],
      definition: payload.definition ?? "x",
      subtleDifference: payload.subtleDifference ?? "y",
      exampleSentences: payload.exampleSentences ?? ["ex"],
    });
    if (errors.length && Object.keys(payload).length) {
      res
        .status(400)
        .json({ success: false, message: "Validation failed", errors });
      return;
    }

    const updated = await SimilarWordSet.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      res.status(404).json({ success: false, message: "Not found" });
      return;
    }
    res.json({ success: true, data: updated, message: "Group updated" });
  } catch (err) {
    console.error("Error updating group", err);
    res.status(500).json({ success: false, message: "Error updating group" });
  }
};

// DELETE /groups/:id
export const deleteGroup = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id || !Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid id" });
      return;
    }
    const deleted = await SimilarWordSet.findByIdAndDelete(id);
    if (!deleted) {
      res.status(404).json({ success: false, message: "Not found" });
      return;
    }
    res.json({ success: true, message: "Group deleted" });
  } catch (err) {
    console.error("Error deleting group", err);
    res.status(500).json({ success: false, message: "Error deleting group" });
  }
};

// POST /import
export const importGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const body = req.body;
    if (!Array.isArray(body)) {
      res
        .status(400)
        .json({ success: false, message: "Body must be an array" });
      return;
    }
    // Size limit ~200KB already enforced by global JSON limit (10mb) but we can check length
    const results: any[] = [];
    const errors: any[] = [];

    for (let i = 0; i < body.length; i++) {
      const item = body[i];
      const itemErrors = validateSet(item);
      if (itemErrors.length) {
        errors.push({ index: i, errors: itemErrors });
        continue;
      }
      results.push(item);
    }

    if (!results.length) {
      res
        .status(400)
        .json({ success: false, message: "No valid records", errors });
      return;
    }

    const inserted = await SimilarWordSet.insertMany(results);
    res
      .status(201)
      .json({
        success: true,
        data: inserted,
        errors,
        message: `Imported ${inserted.length} sets`,
      });
  } catch (err) {
    console.error("Error importing groups", err);
    res.status(500).json({ success: false, message: "Error importing groups" });
  }
};

// GET /export
export const exportGroups = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { format } = req.query;
    const sets = await SimilarWordSet.find({}).sort({ updatedAt: -1 }).lean();

    if (format === "csv") {
      const header = "words,definition,subtleDifference,exampleSentences";
      const rows = sets.map((s) => {
        const words = '"' + s.words.join(";") + '"';
        const def = '"' + (s.definition || "").replace(/"/g, '""') + '"';
        const subtle =
          '"' + (s.subtleDifference || "").replace(/"/g, '""') + '"';
        const examples =
          '"' +
          (s.exampleSentences || [])
            .map((e: string) => e.replace(/"/g, '""'))
            .join("|") +
          '"';
        return [words, def, subtle, examples].join(",");
      });
      const csv = [header, ...rows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=similar_word_sets.csv"
      );
      res.send(csv);
      return;
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=similar_word_sets.json"
    );
    res.json(sets);
  } catch (err) {
    console.error("Error exporting groups", err);
    res.status(500).json({ success: false, message: "Error exporting groups" });
  }
};
