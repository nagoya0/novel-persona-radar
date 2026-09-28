/**
 * Compile each work's pinned source, annotation and stored judgments into the JSON the page
 * loads (ADR 0027). Runs before every build; needs no network and no API key.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Judgments, WorkData } from "../src/core/types";
import { loadDictionary, loadWork, ROOT, WORKS } from "./lib/work";

const OUT = path.join(ROOT, "src", "generated", "works");

function readJudgments(file: string, traitIds: Set<string>): Judgments {
  const out: Judgments = {};
  if (!existsSync(file)) return out;
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue;
    const r = JSON.parse(line) as { paragraph: number; character: string; traits: Record<string, [number, number]> };
    const traits: Record<string, [number, number]> = {};
    for (const [t, v] of Object.entries(r.traits)) if (traitIds.has(t)) traits[t] = v;
    (out[r.character] ??= {})[r.paragraph] = traits;
  }
  return out;
}

const traits = loadDictionary();
const traitIds = new Set(traits.map((t) => t.id));
mkdirSync(OUT, { recursive: true });
const index: { id: string; title: string; author: string }[] = [];

for (const id of readdirSync(WORKS)) {
  const { dir, annotation: ann, paragraphs } = loadWork(id);
  const excluded = new Set(ann.excludedParagraphs);
  const data: WorkData = {
    id,
    title: ann.title,
    author: ann.author,
    summary: ann.summary,
    sourceUrl: ann.source.url,
    credits: ann.source.credits,
    paragraphs: paragraphs.filter((p) => !excluded.has(p.index)),
    characters: ann.characters,
    highlights: ann.highlights,
    traits,
    judgments: readJudgments(path.join(dir, "judgments.jsonl"), traitIds),
  };
  writeFileSync(path.join(OUT, `${id}.json`), JSON.stringify(data));
  index.push({ id, title: ann.title, author: ann.author });
  console.log(`${id}: ${data.paragraphs.length} paragraphs, ${Object.keys(data.judgments).length} judged characters`);
}
writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index));
