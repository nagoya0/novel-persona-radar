/** Load a work's annotation and its pinned source (ADR 0033), and the trait dictionary. */
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import type { Annotation, Paragraph, Trait } from "../../src/core/types";
import { parseAozora } from "./aozora";

export const ROOT = path.resolve(import.meta.dirname, "..", "..");
export const WORKS = path.join(ROOT, "data", "works");

export function loadDictionary(): Trait[] {
  const file = path.join(ROOT, "data", "traits", "dictionary.json");
  return (JSON.parse(readFileSync(file, "utf8")) as { traits: Trait[] }).traits;
}

/** The annotation and every paragraph of the source, excluded ones included, by index. */
export function loadWork(id: string): { dir: string; annotation: Annotation; paragraphs: Paragraph[] } {
  const dir = path.join(WORKS, id);
  const annotation = JSON.parse(readFileSync(path.join(dir, "annotation.json"), "utf8")) as Annotation;
  const raw = readFileSync(path.join(dir, annotation.source.file));
  const hash = createHash("sha256").update(raw).digest("hex");
  if (hash !== annotation.source.sha256) {
    throw new Error(`${id}: source hash ${hash} does not match the annotation (ADR 0033)`);
  }
  const paragraphs = parseAozora(new TextDecoder("shift_jis").decode(raw));
  if (paragraphs.length !== annotation.paragraphs.length + annotation.excludedParagraphs.length) {
    throw new Error(`${id}: ${paragraphs.length} paragraphs in the source, annotation does not cover them`);
  }
  return { dir, annotation, paragraphs };
}
