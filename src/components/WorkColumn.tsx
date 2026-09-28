import Link from "next/link";
import type { WorkData } from "@/core/types";
import type { WorkSummary } from "@/lib/works";

export default function WorkColumn({
  work,
  works,
  position,
  onJump,
}: {
  work: WorkData;
  works: WorkSummary[];
  position: number;
  onJump: (paragraph: number) => void;
}) {
  // Characters appear from their first mention; their introduction stays hidden until they
  // appear on stage (ADR 0032).
  const known = work.characters.filter((c) => c.firstMention <= position);
  return (
    <aside className="flex min-h-0 flex-col gap-5 overflow-y-auto border-r border-line bg-panel p-5">
      <section>
        <label className="text-xs text-muted">作品</label>
        <div className="mt-1 flex flex-col gap-1">
          {works.map((w) => (
            <Link
              key={w.id}
              href={`/works/${w.id}`}
              className={`rounded px-2 py-1 text-sm ${w.id === work.id ? "bg-foreground text-panel" : "hover:bg-line"}`}
            >
              {w.title}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h1 className="font-serif text-xl font-semibold">{work.title}</h1>
        <p className="text-sm text-muted">{work.author}</p>
        <p className="mt-3 text-sm leading-relaxed">{work.summary}</p>
      </section>

      <section>
        <h2 className="text-xs text-muted">見どころ</h2>
        <ul className="mt-1 space-y-0.5">
          {work.highlights.map((h) => (
            <li key={h.paragraph}>
              <button onClick={() => onJump(h.paragraph)} className="text-left text-sm hover:underline">
                {h.title}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xs text-muted">登場人物</h2>
        <ul className="mt-2 space-y-3">
          {known.map((c) => {
            const met = c.firstOnStage <= position;
            return (
              <li key={c.id}>
                <div className="text-sm font-medium">{c.name}</div>
                <p className={`text-xs leading-relaxed ${met ? "" : "text-muted"}`}>{met ? c.intro : "？"}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-auto border-t border-line pt-3 text-[10px] leading-relaxed text-muted">
        <p>
          本文：
          <a href={work.sourceUrl} className="underline" target="_blank" rel="noreferrer">
            青空文庫
          </a>
        </p>
        {work.credits.map((c) => (
          <p key={c}>{c}</p>
        ))}
        <p className="mt-2">{work.judgmentsNote}</p>
      </section>
    </aside>
  );
}
