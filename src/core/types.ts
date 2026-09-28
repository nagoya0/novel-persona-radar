/** A run of plain text, or a base text with its ruby reading. */
export type Segment = string | { rb: string; rt: string };

export interface Paragraph {
  index: number;
  segments: Segment[];
  /** Length in characters of the base text, ruby readings excluded. */
  length: number;
  /** Narration is indented; lines starting with a quotation bracket are not. */
  indent: boolean;
}

export interface Trait {
  id: string;
  en: string;
  gloss: string;
  group: "positive" | "neutral" | "negative";
  ja: { formal: string; casual: string };
}

export interface Character {
  id: string;
  judged: boolean;
  name: string;
  names: string[];
  firstMention: number;
  firstOnStage: number;
  intro: string;
}

export interface Highlight {
  paragraph: number;
  title: string;
}

/** Who a paragraph's words belong to (ADR 0034); `subject` is a character id or "narrator". */
export interface Voice {
  kind: "narrative" | "speech" | "thoughts";
  subject: string;
}

export interface ParagraphAnnotation {
  index: number;
  voices: Voice[];
  onStage: string[];
  mentioned: string[];
  context?: string;
  /** For human review only; never sent to Jev. */
  reviewNote?: string;
}

export interface Annotation {
  id: string;
  title: string;
  author: string;
  narrator: { person: "first" | "third"; character: string | null };
  summary: string;
  source: { url: string; file: string; sha256: string; credits: string[] };
  excludedParagraphs: number[];
  characters: Character[];
  highlights: Highlight[];
  paragraphs: ParagraphAnnotation[];
}

/** [evidence, score] for one trait; evidence is 0–1, score is 0–4. */
export type TraitJudgment = [number, number];

/** Judgments by character id, then paragraph index, then trait id. */
export type Judgments = Record<string, Record<number, Record<string, TraitJudgment>>>;

export interface WorkData {
  id: string;
  title: string;
  author: string;
  summary: string;
  sourceUrl: string;
  credits: string[];
  paragraphs: Paragraph[];
  characters: Character[];
  highlights: Highlight[];
  traits: Trait[];
  judgments: Judgments;
}
