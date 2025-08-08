import { Request, Response } from "express";
import Gamification from "../models/Gamification";
import { AuthRequest } from "../../../types";

const gainXP = (wasCorrect: boolean, streak: number) => {
  let xp = wasCorrect ? 10 : 2;
  if (wasCorrect && streak > 0) xp += Math.min(streak * 2, 20);
  return xp;
};

export const getGamification = async (req: AuthRequest, res: Response) => {
  try {
    const doc = await Gamification.findOne({ user: req.user!._id }).lean();
    res.json({ success: true, data: doc || null });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Failed to load gamification" });
  }
};

export const recordPractice = async (req: AuthRequest, res: Response) => {
  try {
    const { setId, wasCorrect } = req.body || {};
    if (!setId || typeof wasCorrect !== "boolean") {
      res
        .status(400)
        .json({ success: false, message: "setId and wasCorrect required" });
      return;
    }
    let doc = await Gamification.findOne({ user: req.user!._id });
    if (!doc) {
      doc = new Gamification({
        user: req.user!._id,
        totalXP: 0,
        dailyStreak: 0,
        sets: [],
      });
    }
    const today = new Date();
    const dayKey = today.toISOString().slice(0, 10);
    if (!doc.lastPracticeDay) doc.dailyStreak = 1;
    else if (doc.lastPracticeDay === dayKey) {
      // unchanged
    } else {
      const yesterday = new Date(today.getTime() - 86400000)
        .toISOString()
        .slice(0, 10);
      doc.dailyStreak =
        doc.lastPracticeDay === yesterday ? doc.dailyStreak + 1 : 1;
    }
    doc.lastPracticeDay = dayKey;

    const existing = doc.sets.find((s) => s.setId.toString() === setId);
    if (!existing) {
      doc.sets.push({ setId, attempts: 0, correct: 0, streak: 0 });
    }
    const target = doc.sets.find((s) => s.setId.toString() === setId)!;
    target.attempts += 1;
    if (wasCorrect) target.correct += 1;
    target.streak = wasCorrect ? target.streak + 1 : 0;
    target.lastAttempt = today;
    const xpGain = gainXP(wasCorrect, target.streak);
    doc.totalXP += xpGain;
    await doc.save();
    res.json({ success: true, data: doc, xpGain });
  } catch (e) {
    res
      .status(500)
      .json({ success: false, message: "Failed to record practice" });
  }
};

export const resetGamification = async (req: AuthRequest, res: Response) => {
  try {
    await Gamification.deleteOne({ user: req.user!._id });
    res.json({ success: true, message: "Gamification reset" });
  } catch (e) {
    res.status(500).json({ success: false, message: "Failed to reset" });
  }
};
