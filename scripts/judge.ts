/**
 * Judge a work with Jev and append the answers to data/works/<id>/judgments.jsonl (ADR 0027).
 * Resumes where it stopped: a paragraph and character already stored is never requested again.
 *
 *   pnpm judge <work-id> [--route official|vercel] [--limit N] [--dry-run]
 */
import { appendFileSync, existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";
import { buildRequest, judgingJobs, readAnswers } from "../src/core/judging";
import { plainText } from "./lib/aozora";
import { jev, type Route } from "./lib/jev";
import { loadDictionary, loadWork } from "./lib/work";

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    route: { type: "string", default: "official" },
    limit: { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
});
const [workId] = positionals;
if (!workId) throw new Error("usage: pnpm judge <work-id> [--route official|vercel] [--limit N] [--dry-run]");
const route = values.route as Route;
if (route !== "official" && route !== "vercel") throw new Error(`unknown route ${route}`);

const traits = loadDictionary();
const { dir, annotation, paragraphs } = loadWork(workId);
const out = path.join(dir, "judgments.jsonl");

const done = new Set<string>();
if (existsSync(out)) {
  for (const line of readFileSync(out, "utf8").split("\n")) {
    if (!line.trim()) continue;
    const r = JSON.parse(line) as { paragraph: number; character: string };
    done.add(`${r.paragraph}/${r.character}`);
  }
}
const jobs = judgingJobs(annotation);
const todo = jobs.filter((j) => !done.has(`${j.paragraph.index}/${j.character}`));
const limited = values.limit ? todo.slice(0, Number(values.limit)) : todo;
console.log(`${workId}: ${jobs.length} requests, ${done.size} stored, ${limited.length} to send`);

const request = (j: (typeof jobs)[number]) =>
  buildRequest(annotation, traits, j, plainText(paragraphs[j.paragraph.index]));

async function run() {
  const judge = jev(route);
  let tokens = 0;
  const started = Date.now();
  for (const [n, j] of limited.entries()) {
    const result = await judge.judge(request(j));
    tokens += result.inputTokens;
    const record = {
      paragraph: j.paragraph.index,
      character: j.character,
      model: result.model,
      traits: readAnswers(result.answers, traits),
    };
    appendFileSync(out, JSON.stringify(record) + "\n");
    if ((n + 1) % 10 === 0 || n + 1 === limited.length) {
      console.log(`${n + 1}/${limited.length}  ${Math.round((Date.now() - started) / 1000)}s  ${tokens} input tokens`);
    }
  }
}

if (values["dry-run"]) {
  if (limited.length) console.log(JSON.stringify(request(limited[0]), null, 2));
} else {
  run().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
