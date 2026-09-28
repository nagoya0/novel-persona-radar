import { readFileSync } from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
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

/** A screenshot of the first page of Run, Melos!, at the 1200 × 630 size link previews use. */
const PREVIEW_IMAGE = {
  url: "/og-image.png",
  width: 1200,
  height: 630,
  alt: "Novel Persona Radar: Run, Melos! in vertical text, with a radar chart and a ranking of the traits Jev saw in Melos",
};

/**
 * Title and description for a work's page, repeated for link previews (ADR 0023). The image is
 * set here, not by the opengraph-image file convention: a page's own openGraph replaces the
 * parent's, image included.
 */
export function workMetadata(work: WorkData): Metadata {
  const title = `${work.title} — Novel Persona Radar`;
  return {
    title,
    description: work.summary,
    openGraph: {
      title,
      description: work.summary,
      siteName: "Novel Persona Radar",
      type: "website",
      images: [PREVIEW_IMAGE],
    },
    twitter: { card: "summary_large_image", images: [PREVIEW_IMAGE] },
  };
}
