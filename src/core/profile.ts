import type { Part } from "./parts";
import type { Judgments } from "./types";

export interface TraitValue {
  /** Evidence-weighted score, 0–4; null when there is too little evidence to say. */
  value: number | null;
  /** Accumulated evidence behind the value. */
  evidence: number;
}

export interface PartProfile {
  /** From the paragraphs that start in this part only (the thin radar line). */
  current: Record<string, TraitValue>;
  /** From everything up to and including this part, older evidence fading (the thick line). */
  accumulated: Record<string, TraitValue>;
}

export interface ProfileOptions {
  /** Weight kept by earlier evidence each time the character appears on stage (ADR 0004). */
  decay: number;
  /** Below this much evidence a value is unknown. */
  unknownBelow: number;
}

export const DEFAULT_PROFILE_OPTIONS: ProfileOptions = { decay: 0.85, unknownBelow: 0.8 };

/**
 * Build a character's profile part by part (ADR 0002, 0003, 0004). Only paragraphs where the
 * character is on stage have judgments (ADR 0032); each counts in the part where it starts.
 */
export function buildProfile(
  judgments: Judgments,
  character: string,
  parts: Part[],
  traitIds: string[],
  options: ProfileOptions = DEFAULT_PROFILE_OPTIONS,
): PartProfile[] {
  const byParagraph = judgments[character] ?? {};
  const num: Record<string, number> = {};
  const den: Record<string, number> = {};
  for (const t of traitIds) num[t] = den[t] = 0;

  return parts.map((part) => {
    const curNum: Record<string, number> = {};
    const curDen: Record<string, number> = {};
    for (const t of traitIds) curNum[t] = curDen[t] = 0;

    for (const p of part.starts) {
      const j = byParagraph[p];
      if (!j) continue;
      for (const t of traitIds) {
        const [ev, sc] = j[t] ?? [0, 0];
        num[t] = num[t] * options.decay + ev * sc;
        den[t] = den[t] * options.decay + ev;
        curNum[t] += ev * sc;
        curDen[t] += ev;
      }
    }

    const value = (n: number, d: number): TraitValue => ({
      value: d >= options.unknownBelow ? n / d : null,
      evidence: d,
    });
    const current: Record<string, TraitValue> = {};
    const accumulated: Record<string, TraitValue> = {};
    for (const t of traitIds) {
      current[t] = value(curNum[t], curDen[t]);
      accumulated[t] = value(num[t], den[t]);
    }
    return { current, accumulated };
  });
}
