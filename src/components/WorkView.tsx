"use client";

import { MotionConfig, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { packParts, partOfParagraph } from "@/core/parts";
import { buildProfile } from "@/core/profile";
import { revealParts } from "@/core/reveal";
import type { WorkData } from "@/core/types";
import type { WorkSummary } from "@/lib/works";
import AnalysisColumn from "./AnalysisColumn";
import Copyright from "./Copyright";
import TextColumn from "./TextColumn";
import WorkColumn from "./WorkColumn";

const PART_BUDGET = 400; // characters per part (ADR 0015)
const DEFAULT_AXES = ["suspicious", "trusting", "forgiving", "passionate", "idealistic", "guileless"];
export type LabelStyle = "casual" | "formal";
export type Typeface = "serif" | "sans";

function Toggle<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  // A segmented switch: the selected option sits on a thumb that slides between options. The
  // options name themselves, so the label is for screen readers only.
  return (
    <div className="flex items-center">
      <div role="radiogroup" aria-label={label} className="flex rounded-full bg-line p-0.5">
        {options.map(([v, text]) => (
          <button
            key={v}
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className={`relative rounded-full px-3 py-0.5 transition-colors ${value === v ? "text-foreground" : "text-muted hover:text-foreground"}`}
          >
            {value === v && (
              <motion.span
                layoutId={`${label}-thumb`}
                className="absolute inset-0 rounded-full bg-panel shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span className="relative">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function WorkView({ work, works }: { work: WorkData; works: WorkSummary[] }) {
  const parts = useMemo(() => packParts(work.paragraphs, PART_BUDGET), [work]);
  const [part, setPart] = useState(0);
  const [character, setCharacter] = useState("melos");
  const [axes, setAxes] = useState<string[]>(DEFAULT_AXES);
  // Trait labels are always the casual ones; the formal labels stay in the dictionary.
  const labelStyle: LabelStyle = "casual";
  const [typeface, setTypeface] = useState<Typeface>("serif");

  const go = useCallback((i: number) => setPart(Math.max(0, Math.min(parts.length - 1, i))), [parts.length]);

  // Autoplay (ADR 0018). Turning pages by hand stops it; it stops by itself after the last page.
  const [playing, setPlaying] = useState(false);
  const turn = useCallback(
    (i: number) => {
      setPlaying(false);
      go(i);
    },
    [go],
  );
  const advance = useCallback(() => {
    if (part >= parts.length - 1) setPlaying(false);
    else go(part + 1);
  }, [go, part, parts.length]);
  const togglePlay = () => {
    // Playing from the last page starts over from the first.
    if (!playing && part === parts.length - 1) go(0);
    setPlaying(!playing);
  };

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
      // Leave arrow keys to the page slider and the axis dropdowns while they have focus.
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, select, textarea")) return;
      if (e.key === "ArrowLeft") turn(part + 1);
      if (e.key === "ArrowRight") turn(part - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [turn, part]);

  const fullest = useMemo(
    () => ({
      chars: Math.max(...parts.map((p) => p.chunks.reduce((n, c) => n + c.length, 0))),
      paragraphs: Math.max(...parts.map((p) => p.chunks.length)),
    }),
    [parts],
  );
  const reveal = useMemo(() => revealParts(parts, work.characters), [parts, work]);
  // Only characters already on stage can be analysed. If the chosen one has not appeared yet at
  // this point (after jumping back), show the first who has; the choice returns once they appear.
  const onStage = work.characters.filter((c) => c.judged && reveal[c.id].onStage <= part);
  const shown = onStage.some((c) => c.id === character) ? character : (onStage[0]?.id ?? character);
  const traitIds = work.traits.map((t) => t.id);
  const profile = useMemo(
    () => buildProfile(work.judgments, shown, parts, traitIds),
    // traitIds is derived from work
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [work, shown, parts],
  );

  return (
    // Follows the operating system's reduce-motion setting (ADR 0021).
    <MotionConfig reducedMotion="user">
      <div className="flex h-full flex-col min-[1280px]:hidden items-center justify-center p-8 text-center">
        <p className="text-lg">このデモはパソコンのブラウザ向けです。</p>
        <p className="mt-2 text-muted">横幅 1280px 以上の画面でご覧ください。</p>
      </div>
      <div className="hidden h-full min-[1280px]:flex flex-col">
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-line bg-panel px-5">
          <span className="font-bold tracking-wide">Novel Persona Radar</span>
          <div className="flex items-center gap-6 text-sm">
            <Toggle
              label="書体"
              value={typeface}
              options={[
                ["serif", "明朝"],
                ["sans", "ゴシック"],
              ]}
              onChange={setTypeface}
            />
            <Copyright />
          </div>
        </header>
        <main className="grid min-h-0 flex-1 grid-cols-[clamp(240px,16vw,320px)_minmax(0,1fr)_clamp(420px,27vw,520px)]">
          <WorkColumn
            work={work}
            works={works}
            part={part}
            reveal={reveal}
            onJump={(paragraph) => turn(partOfParagraph(parts, paragraph))}
          />
          <TextColumn
            part={parts[part]}
            index={part}
            total={parts.length}
            budget={fullest.chars}
            maxParagraphs={fullest.paragraphs}
            onNext={() => turn(part + 1)}
            onPrev={() => turn(part - 1)}
            onJump={turn}
            typeface={typeface}
            playing={playing}
            onTogglePlay={togglePlay}
            onAdvance={advance}
          />
          <AnalysisColumn
            work={work}
            part={part}
            reveal={reveal}
            profile={profile}
            character={shown}
            onCharacter={setCharacter}
            axes={axes}
            onAxes={setAxes}
            labelStyle={labelStyle}
          />
        </main>
      </div>
    </MotionConfig>
  );
}
