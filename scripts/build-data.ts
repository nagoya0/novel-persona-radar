/**
 * Compile each work's pinned source, annotation and stored judgments into the JSON the page
 * loads (ADR 0027). Runs before every build; needs no network and no API key.
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import type { Character, Judgments, Paragraph, Segment, Trait, WorkData } from "../src/core/types";

const ROOT = path.resolve(import.meta.dirname, "..");
const WORKS = path.join(ROOT, "data", "works");
const OUT = path.join(ROOT, "src", "generated", "works");

interface Annotation {
  id: string;
  title: string;
  author: string;
  summary: string;
  source: { url: string; file: string; sha256: string; credits: string[] };
  excludedParagraphs: number[];
  characters: Character[];
  highlights: { paragraph: number; title: string }[];
}

const decodeEntities = (s: string) =>
  s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');

/** Parse Aozora Bunko XHTML into paragraphs, keeping ruby. */
function parseAozora(html: string): Paragraph[] {
  const main = html.match(/<div class="main_text">([\s\S]*?)<div class="bibliographical_information">/);
  if (!main) throw new Error("main_text not found");
  const lines = main[1].split(/<br\s*\/>/);
  const paragraphs: Paragraph[] = [];
  for (const raw of lines) {
    const segments: Segment[] = [];
    const re = /<ruby><rb>([\s\S]*?)<\/rb><rp>[\s\S]*?<\/rp><rt>([\s\S]*?)<\/rt><rp>[\s\S]*?<\/rp><\/ruby>/g;
    let last = 0;
    let m: RegExpExecArray | null;
    const pushText = (t: string) => {
      const text = decodeEntities(t.replace(/<[^>]+>/g, "")).replace(/[\r\n]/g, "");
      if (text) segments.push(text);
    };
    while ((m = re.exec(raw))) {
      pushText(raw.slice(last, m.index));
      segments.push({ rb: decodeEntities(m[1]), rt: decodeEntities(m[2]) });
      last = re.lastIndex;
    }
    pushText(raw.slice(last));
    // Drop the leading full-width space used for indentation; indentation is styling.
    if (typeof segments[0] === "string") segments[0] = segments[0].replace(/^　+/, "");
    const cleaned = segments.filter((s) => typeof s !== "string" || s.trim() !== "");
    if (!cleaned.length) continue;
    const length = cleaned.reduce((n, s) => n + (typeof s === "string" ? s.length : s.rb.length), 0);
    const first = typeof cleaned[0] === "string" ? cleaned[0] : cleaned[0].rb;
    paragraphs.push({ index: paragraphs.length, segments: cleaned, length, indent: !/^[「『（(]/.test(first) });
  }
  return paragraphs;
}

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

const dictionary = JSON.parse(readFileSync(path.join(ROOT, "data", "traits", "dictionary.json"), "utf8")) as {
  traits: Trait[];
};
const traitIds = new Set(dictionary.traits.map((t) => t.id));
mkdirSync(OUT, { recursive: true });
const index: { id: string; title: string; author: string }[] = [];

for (const id of readdirSync(WORKS)) {
  const dir = path.join(WORKS, id);
  const ann = JSON.parse(readFileSync(path.join(dir, "annotation.json"), "utf8")) as Annotation;
  const raw = readFileSync(path.join(dir, ann.source.file));
  const hash = createHash("sha256").update(raw).digest("hex");
  if (hash !== ann.source.sha256) {
    throw new Error(`${id}: source hash ${hash} does not match the annotation (ADR 0033)`);
  }
  const all = parseAozora(new TextDecoder("shift_jis").decode(raw));
  const excluded = new Set(ann.excludedParagraphs);
  const data: WorkData = {
    id,
    title: ann.title,
    author: ann.author,
    summary: ann.summary,
    sourceUrl: ann.source.url,
    credits: ann.source.credits,
    paragraphs: all.filter((p) => !excluded.has(p.index)),
    characters: ann.characters,
    highlights: ann.highlights,
    traits: dictionary.traits,
    judgments: readJudgments(path.join(dir, "judgments.screening.jsonl"), traitIds),
  };
  writeFileSync(path.join(OUT, `${id}.json`), JSON.stringify(data));
  index.push({ id, title: ann.title, author: ann.author });
  console.log(`${id}: ${data.paragraphs.length} paragraphs, ${Object.keys(data.judgments).length} judged characters`);
}
writeFileSync(path.join(OUT, "index.json"), JSON.stringify(index));
