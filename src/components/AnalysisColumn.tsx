import type { Part } from "@/core/parts";
import type { PartProfile } from "@/core/profile";
import type { WorkData } from "@/core/types";
import RadarChart from "./RadarChart";
import TimelineChart from "./TimelineChart";
import type { LabelStyle } from "./WorkView";


import { AXIS_COLORS } from "./colors";
const MIN_AXES = 3;
const MAX_AXES = 8;

export default function AnalysisColumn({
  work,
  parts,
  part,
  position,
  profile,
  character,
  onCharacter,
  axes,
  onAxes,
  labelStyle,
  hovered,
  onHover,
  onJumpPart,
}: {
  work: WorkData;
  parts: Part[];
  part: number;
  position: number;
  profile: PartProfile[];
  character: string;
  onCharacter: (id: string) => void;
  axes: string[];
  onAxes: (axes: string[]) => void;
  labelStyle: LabelStyle;
  hovered: string | null;
  onHover: (id: string | null) => void;
  onJumpPart: (part: number) => void;
}) {
  const traits = new Map(work.traits.map((t) => [t.id, t]));
  const label = (id: string) => traits.get(id)!.ja[labelStyle];
  const selectable = work.characters.filter((c) => c.judged && c.firstMention <= position);
  const current = work.characters.find((c) => c.id === character)!;
  const onStageYet = current.firstOnStage <= position;

  const toggle = (id: string) => {
    if (axes.includes(id)) {
      if (axes.length > MIN_AXES) onAxes(axes.filter((a) => a !== id));
    } else if (axes.length < MAX_AXES) {
      onAxes([...axes, id]);
    }
  };
  const draw = () => {
    const ids = work.traits.map((t) => t.id).sort(() => Math.random() - 0.5);
    onAxes(ids.slice(0, axes.length));
  };

  return (
    <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto bg-panel p-5">
      <section>
        <h2 className="text-xs text-muted">人物</h2>
        <div className="mt-1 flex flex-wrap gap-1">
          {selectable.map((c) => (
            <button
              key={c.id}
              onClick={() => onCharacter(c.id)}
              className={`rounded-full border px-3 py-0.5 text-sm ${
                c.id === character ? "border-foreground bg-foreground text-panel" : "border-line hover:border-foreground"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded border border-line bg-background/40 p-2">
        {onStageYet ? (
          <RadarChart
            axes={axes}
            label={label}
            current={profile[part].current}
            accumulated={profile[part].accumulated}
            hovered={hovered}
            onHover={onHover}
          />
        ) : (
          <div className="flex h-[340px] items-center justify-center text-sm text-muted">
            {current.name}はまだ登場していません
          </div>
        )}
        <div className="flex justify-center gap-4 text-[11px] text-muted">
          <span>━ ここまでの人物像</span>
          <span>┄ このパートの印象</span>
        </div>
      </section>

      <section className="rounded border border-line bg-background/40 p-2">
        <TimelineChart
          axes={axes}
          label={label}
          profile={profile}
          part={part}
          highlights={work.highlights.map((h) => ({
            ...h,
            part: parts.findIndex((p) => p.chunks.some((c) => c.paragraph === h.paragraph)),
          }))}
          hovered={hovered}
          onHover={onHover}
          onJumpPart={onJumpPart}
        />
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-xs text-muted">
            分析の軸（{axes.length}／{MIN_AXES}〜{MAX_AXES}）
          </h2>
          <button onClick={draw} className="rounded border border-line px-2 py-0.5 text-xs hover:border-foreground">
            ランダムに引き直す
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {work.traits.map((t) => {
            const i = axes.indexOf(t.id);
            return (
              <button
                key={t.id}
                onClick={() => toggle(t.id)}
                className="rounded border px-2 py-0.5 text-xs"
                style={
                  i >= 0
                    ? { borderColor: AXIS_COLORS[i], color: AXIS_COLORS[i], fontWeight: 600 }
                    : { borderColor: "var(--line)", color: "var(--muted)" }
                }
              >
                {t.ja[labelStyle]}
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
}
