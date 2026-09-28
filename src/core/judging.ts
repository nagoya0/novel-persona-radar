/**
 * Build Jev requests from the annotation and read the answers back (docs/judging.md).
 * One request per paragraph and judged on-stage character (ADR 0032), two questions per trait
 * (ADR 0003), no previous paragraphs (ADR 0030).
 */
import type { Annotation, Character, ParagraphAnnotation, Trait, TraitJudgment, Voice } from "./types";

export const SCORE_LEVELS = ["not at all", "slightly", "moderately", "very", "extremely"];

export type Question =
  | { type: "noul"; instructions: string }
  | { type: "score"; instructions: string; criteria: string[] };

export interface JudgeState {
  work: string;
  paragraph: string;
  voices: Voice[];
  characters_on_stage: string[];
  characters_mentioned: string[];
  context?: string;
}

export interface JudgeRequest {
  state: JudgeState;
  questions: Record<string, Question>;
}

export interface Job {
  paragraph: ParagraphAnnotation;
  character: string;
}

/** Every paragraph and judged character on stage in it, in reading order. */
export function judgingJobs(annotation: Annotation): Job[] {
  const judged = new Set(annotation.characters.filter((c) => c.judged).map((c) => c.id));
  const excluded = new Set(annotation.excludedParagraphs);
  return annotation.paragraphs
    .filter((p) => !excluded.has(p.index))
    .flatMap((p) => p.onStage.filter((c) => judged.has(c)).map((character) => ({ paragraph: p, character })));
}

/** How a question names a character: `ディオニス王 (also called ディオニス, 王, …)`. */
export function characterLabel(c: Character): string {
  const others = c.names.filter((n) => n !== c.name);
  return others.length ? `${c.name} (also called ${others.join(", ")})` : c.name;
}

export function describeWork(a: Annotation, byId: Map<string, Character>): string {
  const teller =
    a.narrator.person === "third" || !a.narrator.character
      ? "told by a third-person narrator"
      : `told in the first person by ${byId.get(a.narrator.character)?.name ?? a.narrator.character}`;
  return `${a.title} by ${a.author}, ${teller}`;
}

export function buildRequest(
  annotation: Annotation,
  traits: Trait[],
  job: Job,
  /** The paragraph as plain text: ruby readings dropped, full-width spaces removed. */
  text: string,
): JudgeRequest {
  const byId = new Map(annotation.characters.map((c) => [c.id, c]));
  const name = (id: string) => {
    const c = byId.get(id);
    if (!c) throw new Error(`paragraph ${job.paragraph.index}: unknown character ${id}`);
    return c.name;
  };
  const p = job.paragraph;
  const state: JudgeState = {
    work: describeWork(annotation, byId),
    paragraph: text,
    voices: p.voices.map((v) => ({ kind: v.kind, subject: v.subject === "narrator" ? "narrator" : name(v.subject) })),
    characters_on_stage: p.onStage.map(name),
    characters_mentioned: p.mentioned.map(name),
  };
  if (p.context) state.context = p.context;

  const who = characterLabel(byId.get(job.character)!);
  const questions: Record<string, Question> = {};
  for (const t of traits) {
    const label = `${t.en} (${t.gloss})`;
    questions[`${t.id}.ev`] = {
      type: "noul",
      instructions: `Does this paragraph itself give any evidence about whether ${who} is ${label}?`,
    };
    questions[`${t.id}.sc`] = {
      type: "score",
      instructions: `Judging from this paragraph, how ${label} is ${who}?`,
      criteria: SCORE_LEVELS,
    };
  }
  return { state, questions };
}

const round2 = (x: number) => Math.round(x * 100) / 100;

/** Pair each trait's two answers as [evidence, score], rounded to two decimals. */
export function readAnswers(answers: Record<string, number>, traits: Trait[]): Record<string, TraitJudgment> {
  const out: Record<string, TraitJudgment> = {};
  for (const t of traits) {
    const ev = answers[`${t.id}.ev`];
    const sc = answers[`${t.id}.sc`];
    if (typeof ev !== "number" || typeof sc !== "number") throw new Error(`missing answer for ${t.id}`);
    out[t.id] = [round2(ev), round2(sc)];
  }
  return out;
}
