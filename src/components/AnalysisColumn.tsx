import type { Part } from "@/core/parts";
import type { PartProfile } from "@/core/profile";
import type { WorkData } from "@/core/types";
import RadarChart from "./RadarChart";
import TimelineChart from "./TimelineChart";
import type { LabelStyle } from "./WorkView";

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

  // Choosing a trait already on another axis swaps the two, so no trait appears twice.
  const changeAxis = (index: number, trait: string) => {
    const next = [...axes];
    const other = next.indexOf(trait);
    if (other !== -1) next[other] = next[index];
    next[index] = trait;
    onAxes(next);
  };
  const random = () => {
    const ids = work.traits.map((t) => t.id);
    for (let i = ids.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [ids[i], ids[j]] = [ids[j], ids[i]];
    }
    onAxes(ids.slice(0, axes.length));
  };

  return (
    <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto bg-panel p-5">
      <h2 className="text-lg font-bold">Jev が抱いた印象</h2>

      <section>
        <h3 className="text-xs text-muted">人物</h3>
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
        <RadarChart
          axes={axes}
          traits={work.traits}
          label={label}
          current={profile[part].current}
          accumulated={profile[part].accumulated}
          emptyMessage={onStageYet ? null : `${current.name}はまだ登場していません`}
          hovered={hovered}
          onHover={onHover}
          onAxisChange={changeAxis}
          onRandom={random}
        />
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
        <div className="text-center text-[11px] text-muted">印象値の変遷</div>
      </section>

      <section className="mt-auto border-t border-line pt-3 text-xs leading-relaxed text-muted">
        <h3 className="mb-1 font-medium text-foreground">仕組み</h3>
        <ol className="list-decimal space-y-1 pl-4">
          <li>
            本文を段落ごとに判定 AI「
            <a href="https://typesafe.ai" target="_blank" rel="noreferrer" className="underline underline-offset-2">
              Jev
            </a>
            」に渡し、場面にいる人物ごとに、30の性格について「手がかりがあるか」と「どれくらい当てはまるか」を判定させています。
          </li>
          <li>
            判定を手がかりの強さで重み付けして積み上げ、古い場面ほど少しずつ薄れるようにしています。太い線が積み上げた人物像、点線がこのパートだけの印象です。
          </li>
          <li>登場人物の呼び名や、誰が話しているかといった注釈は、AI（Claude）が下書きし、人が確認しています。</li>
          <li>判定は事前に済ませてあり、このページを見るたびに AI を呼んでいるわけではありません。</li>
        </ol>
      </section>
    </aside>
  );
}
