import Link from "next/link";
import Copyright from "@/components/Copyright";
import { listWorks } from "@/lib/works";

export default function Home() {
  const works = listWorks();
  return (
    <main className="mx-auto max-w-xl px-8 py-16">
      <h1 className="text-2xl font-bold">Novel Persona Radar</h1>
      <p className="mt-2 text-muted">読み進めるほど、登場人物の人物像が見えてくる。</p>
      <ul className="mt-8 space-y-2">
        {works.map((w) => (
          <li key={w.id}>
            <Link href={`/works/${w.id}`} className="text-lg underline underline-offset-4">
              {w.title}
            </Link>
            <span className="ml-2 text-sm text-muted">{w.author}</span>
          </li>
        ))}
      </ul>
      <Copyright className="mt-16" />
    </main>
  );
}
