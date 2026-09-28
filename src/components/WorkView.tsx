"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { packParts, partOfParagraph } from "@/core/parts";
import { buildProfile } from "@/core/profile";
import type { WorkData } from "@/core/types";
import type { WorkSummary } from "@/lib/works";
import AnalysisColumn from "./AnalysisColumn";
import TextColumn from "./TextColumn";
import WorkColumn from "./WorkColumn";

const PART_BUDGET = 400; // characters per part (ADR 0015)
const DEFAULT_AXES = ["suspicious", "trusting", "forgiving", "passionate", "idealistic", "guileless"];
export type LabelStyle = "casual" | "formal";

export default function WorkView({ work, works }: { work: WorkData; works: WorkSummary[] }) {
  const parts = useMemo(() => packParts(work.paragraphs, PART_BUDGET), [work]);
  const [part, setPart] = useState(0);
  const [character, setCharacter] = useState("melos");
  const [axes, setAxes] = useState<string[]>(DEFAULT_AXES);
  const [labelStyle, setLabelStyle] = useState<LabelStyle>("casual");
  const [hovered, setHovered] = useState<string | null>(null);

  const go = useCallback((i: number) => setPart(Math.max(0, Math.min(parts.length - 1, i))), [parts.length]);

  // Deep links: ?part=12&character=king opens a given place (parts are 1-based in the URL).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const p = Number(q.get("part"));
    const c = q.get("character");
    // Reading the URL once after mount; the page itself is static.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (p > 0) go(p - 1);
    if (c && work.characters.some((x) => x.id === c && x.judged)) setCharacter(c);
  }, [go, work]);

  // Vertical text reads right to left: ← is next, → is previous (ADR 0021).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(part + 1);
      if (e.key === "ArrowRight") go(part - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, part]);

  const fullest = useMemo(
    () => ({
      chars: Math.max(...parts.map((p) => p.chunks.reduce((n, c) => n + c.length, 0))),
      paragraphs: Math.max(...parts.map((p) => p.chunks.length)),
    }),
    [parts],
  );
  const position = parts[part].lastParagraph;
  const traitIds = work.traits.map((t) => t.id);
  const profile = useMemo(
    () => buildProfile(work.judgments, character, parts, traitIds),
    // traitIds is derived from work
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [work, character, parts],
  );

  return (
    <>
      <div className="flex h-full flex-col min-[1280px]:hidden items-center justify-center p-8 text-center">
        <p className="text-lg">このデモはパソコンのブラウザ向けです。</p>
        <p className="mt-2 text-muted">横幅 1280px 以上の画面でご覧ください。</p>
      </div>
      <div className="hidden h-full min-[1280px]:flex flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-line bg-panel px-5">
          <span className="font-bold tracking-wide">Novel Persona Radar</span>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-muted">表記</span>
            {(["casual", "formal"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setLabelStyle(s)}
                className={`rounded px-2 py-0.5 ${labelStyle === s ? "bg-foreground text-panel" : "text-muted hover:text-foreground"}`}
              >
                {s === "casual" ? "くだけた" : "堅い"}
              </button>
            ))}
          </div>
        </header>
        <main className="grid min-h-0 flex-1 grid-cols-[clamp(240px,16vw,320px)_minmax(0,1fr)_clamp(420px,27vw,520px)]">
          <WorkColumn
            work={work}
            works={works}
            position={position}
            onJump={(paragraph) => go(partOfParagraph(parts, paragraph))}
          />
          <TextColumn
            part={parts[part]}
            index={part}
            total={parts.length}
            budget={fullest.chars}
            maxParagraphs={fullest.paragraphs}
            onNext={() => go(part + 1)}
            onPrev={() => go(part - 1)}
          />
          <AnalysisColumn
            work={work}
            parts={parts}
            part={part}
            position={position}
            profile={profile}
            character={character}
            onCharacter={setCharacter}
            axes={axes}
            onAxes={setAxes}
            labelStyle={labelStyle}
            hovered={hovered}
            onHover={setHovered}
            onJumpPart={go}
          />
        </main>
      </div>
    </>
  );
}
