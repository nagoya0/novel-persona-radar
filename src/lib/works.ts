import { readFileSync } from "node:fs";
import path from "node:path";
import type { WorkData } from "@/core/types";

// Build-time only: these read the files written by scripts/build-data.ts.
const DIR = path.join(process.cwd(), "src", "generated", "works");

export interface WorkSummary {
  id: string;
  title: string;
  author: string;
}

export function listWorks(): WorkSummary[] {
  return JSON.parse(readFileSync(path.join(DIR, "index.json"), "utf8"));
}

export function loadWork(id: string): WorkData {
  return JSON.parse(readFileSync(path.join(DIR, `${id}.json`), "utf8"));
}
