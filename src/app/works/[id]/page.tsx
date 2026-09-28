import type { Metadata } from "next";
import WorkView from "@/components/WorkView";
import { listWorks, loadWork, workMetadata } from "@/lib/works";

// Only the works that exist at build time (static export, ADR 0023).
export const dynamicParams = false;

export function generateStaticParams() {
  return listWorks().map((w) => ({ id: w.id }));
}

export async function generateMetadata({ params }: PageProps<"/works/[id]">): Promise<Metadata> {
  const { id } = await params;
  return workMetadata(loadWork(id));
}

export default async function WorkPage({ params }: PageProps<"/works/[id]">) {
  const { id } = await params;
  const works = listWorks();
  return <WorkView work={loadWork(id)} works={works} />;
}
