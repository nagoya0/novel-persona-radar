import type { PartProfile } from "@/core/profile";
import type { Reveal } from "@/core/reveal";
import type { WorkData } from "@/core/types";
import RadarChart from "./RadarChart";
import TraitRanking from "./TraitRanking";
import type { LabelStyle } from "./WorkView";

export default function AnalysisColumn({
  work,
  part,
  reveal,
  profile,
  character,
  onCharacter,
  axes,
  onAxes,
  labelStyle,
}: {
  work: WorkData;
  part: number;
  reveal: Record<string, Reveal>;
  profile: PartProfile[];
  character: string;
  onCharacter: (id: string) => void;
  axes: string[];
  onAxes: (axes: string[]) => void;
  labelStyle: LabelStyle;
}) {
  const traits = new Map(work.traits.map((t) => [t.id, t]));
  const label = (id: string) => traits.get(id)!.ja[labelStyle];
  const selectable = work.characters.filter((c) => c.judged && reveal[c.id].onStage <= part);

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
          onAxisChange={changeAxis}
          onRandom={random}
        />
        <div className="text-center text-[11px] text-muted">このパートの印象</div>
      </section>

      <section>
        <h3 className="mb-2 text-xs text-muted">ここまでの人物像ランキング</h3>
        <TraitRanking traits={work.traits} label={label} accumulated={profile[part].accumulated} />
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
            判定を手がかりの強さで重み付けして積み上げ、古い場面ほど少しずつ薄れるようにしています。レーダーチャートはこのパートだけの印象、ランキングは積み上げた人物像です。
          </li>
          <li>登場人物の呼び名や、誰が話しているかといった注釈は、AI（Claude）が下書きし、人が確認しています。</li>
          <li>判定は事前に済ませてあり、このページを見るたびに AI を呼んでいるわけではありません。</li>
        </ol>
      </section>
    </aside>
  );
}
