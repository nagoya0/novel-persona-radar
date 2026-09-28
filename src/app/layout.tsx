import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_JP({ variable: "--font-sans-jp", weight: ["400", "500", "700"], preload: false });
const serif = Noto_Serif_JP({ variable: "--font-serif-jp", weight: ["400", "600"], preload: false });

export const metadata: Metadata = {
  // Link previews need absolute URLs (ADR 0023); pages set them with workMetadata.
  metadataBase: new URL("https://novel-persona-radar.vercel.app"),
  title: "Novel Persona Radar",
  description: "Read a novel and watch its characters take shape.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ja" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="h-full">{children}</body>
    </html>
  );
}
