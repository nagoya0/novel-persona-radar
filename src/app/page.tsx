import type { Metadata } from "next";
import WorkView from "@/components/WorkView";
import { listWorks, loadWork, workMetadata } from "@/lib/works";

// No table of contents: the site opens on the first work, and works are switched in the work
// column. A static export cannot redirect, so the root renders that work itself.
function firstWork() {
  const works = listWorks();
  return { works, work: loadWork(works[0].id) };
}

export function generateMetadata(): Metadata {
  return workMetadata(firstWork().work);
}

export default function Home() {
  const { works, work } = firstWork();
  return <WorkView work={work} works={works} />;
}
