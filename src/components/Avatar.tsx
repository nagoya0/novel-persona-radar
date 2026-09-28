// Muted backgrounds that read well behind a light silhouette.
const BACKGROUNDS = ["#c97b63", "#6b8fb3", "#7fa37a", "#b08bbb", "#d1a35a", "#5f9e9a", "#c7798f", "#8c8f5a", "#8a7fc2", "#b8866b"];

/** A stable colour per character: looks arbitrary, but never changes between visits. */
function backgroundFor(id: string): string {
  let h = 0;
  for (const ch of id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return BACKGROUNDS[h % BACKGROUNDS.length];
}

// Colour and opacity changes animate with CSS, so a character stepping on stage fades from the
// grey "？" to their own colour. Reduced motion turns the transition off (see globals.css).
const FADE = "fill 0.8s ease, fill-opacity 0.8s ease, opacity 0.8s ease";

/**
 * A generic head-and-shoulders silhouette. Characters only heard of so far are dimmed and
 * marked "？" (ADR 0032).
 */
export default function Avatar({ id, unknown = false, size = 56 }: { id: string; unknown?: boolean; size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} className="avatar block rounded-full" aria-hidden>
      <rect width="64" height="64" style={{ fill: unknown ? "#cfc8bc" : backgroundFor(id), transition: FADE }} />
      <g style={{ fill: "#fffdf8", fillOpacity: unknown ? 0.55 : 0.9, transition: FADE }}>
        <circle cx="32" cy="25" r="11" />
        <path d="M10 64c0-13 10-22 22-22s22 9 22 22z" />
      </g>
      <text
        x="32"
        y="34"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="30"
        fontWeight="700"
        fill="#6f665b"
        style={{ opacity: unknown ? 1 : 0, transition: FADE }}
      >
        ？
      </text>
    </svg>
  );
}
