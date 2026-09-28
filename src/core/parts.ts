import type { Paragraph, Segment } from "./types";

/** A paragraph, or a sentence-aligned slice of one that is too long to show whole. */
export interface Chunk {
  paragraph: number;
  segments: Segment[];
  length: number;
  indent: boolean;
  /** True for the chunk that starts its paragraph. */
  startsParagraph: boolean;
}

export interface Part {
  chunks: Chunk[];
  /**
   * Paragraphs that start in this part. A paragraph's judgments take effect where it starts,
   * so a part that opens a long, split paragraph is never empty (ADR 0015).
   */
  starts: number[];
  /** Every paragraph with any text in this part, including the continuation of a split one. */
  shows: number[];
  firstParagraph: number;
  lastParagraph: number;
}

const segLength = (s: Segment) => (typeof s === "string" ? s.length : s.rb.length);

/** Split a paragraph's segments into sentences, ending after each 。 outside ruby. */
function sentences(segments: Segment[]): Segment[][] {
  const out: Segment[][] = [];
  let current: Segment[] = [];
  for (const seg of segments) {
    if (typeof seg !== "string") {
      current.push(seg);
      continue;
    }
    let rest = seg;
    let cut: number;
    while ((cut = rest.indexOf("。")) !== -1) {
      current.push(rest.slice(0, cut + 1));
      out.push(current);
      current = [];
      rest = rest.slice(cut + 1);
    }
    if (rest) current.push(rest);
  }
  if (current.length) out.push(current);
  return out;
}

function toChunks(p: Paragraph, budget: number): Chunk[] {
  if (p.length <= budget) {
    return [{ paragraph: p.index, segments: p.segments, length: p.length, indent: p.indent, startsParagraph: true }];
  }
  const chunks: Chunk[] = [];
  let segs: Segment[] = [];
  let len = 0;
  for (const sentence of sentences(p.segments)) {
    const sLen = sentence.reduce((n, s) => n + segLength(s), 0);
    if (len && len + sLen > budget) {
      chunks.push({ paragraph: p.index, segments: segs, length: len, indent: chunks.length === 0 && p.indent, startsParagraph: chunks.length === 0 });
      segs = [];
      len = 0;
    }
    segs = segs.concat(sentence);
    len += sLen;
  }
  chunks.push({ paragraph: p.index, segments: segs, length: len, indent: chunks.length === 0 && p.indent, startsParagraph: chunks.length === 0 });
  return chunks;
}

/**
 * Pack paragraphs into parts of at most `budget` characters (ADR 0015). Whole paragraphs are
 * kept together; a paragraph longer than the budget is split at sentence ends.
 */
export function packParts(paragraphs: Paragraph[], budget: number): Part[] {
  const parts: Part[] = [];
  let chunks: Chunk[] = [];
  let len = 0;
  const flush = () => {
    if (!chunks.length) return;
    parts.push({
      chunks,
      starts: chunks.filter((c) => c.startsParagraph).map((c) => c.paragraph),
      shows: [...new Set(chunks.map((c) => c.paragraph))],
      firstParagraph: chunks[0].paragraph,
      lastParagraph: chunks[chunks.length - 1].paragraph,
    });
    chunks = [];
    len = 0;
  };
  for (const p of paragraphs) {
    for (const c of toChunks(p, budget)) {
      if (len && len + c.length > budget) flush();
      chunks.push(c);
      len += c.length;
    }
  }
  flush();
  return parts;
}

/** Index of the part in which a paragraph starts. */
export function partOfParagraph(parts: Part[], paragraph: number): number {
  const i = parts.findIndex((p) => p.chunks.some((c) => c.paragraph === paragraph));
  return i === -1 ? 0 : i;
}
