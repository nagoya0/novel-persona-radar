import type { Part } from "./parts";
import type { Character, Segment } from "./types";

export interface Reveal {
  /** First part in which the character is mentioned. */
  mention: number;
  /** First part in which the character is on stage. */
  onStage: number;
}

const text = (segments: Segment[]) => segments.map((s) => (typeof s === "string" ? s : s.rb)).join("");

/**
 * The part in which a character's first mention and first appearance on stage actually show
 * (ADR 0032). The annotation gives paragraphs; when that paragraph is split across parts, the
 * character is revealed in the part whose text contains one of their names, falling back to the
 * part where the paragraph starts.
 */
function partFor(parts: Part[], paragraph: number, names: string[]): number {
  let start = -1;
  for (let i = 0; i < parts.length; i++) {
    for (const c of parts[i].chunks) {
      if (c.paragraph !== paragraph) continue;
      if (start === -1) start = i;
      const t = text(c.segments);
      if (names.some((n) => t.includes(n))) return i;
    }
  }
  return Math.max(start, 0);
}

export function revealParts(parts: Part[], characters: Character[]): Record<string, Reveal> {
  const out: Record<string, Reveal> = {};
  for (const c of characters) {
    out[c.id] = {
      mention: partFor(parts, c.firstMention, c.names),
      onStage: partFor(parts, c.firstOnStage, c.names),
    };
  }
  return out;
}
