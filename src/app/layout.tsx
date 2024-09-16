import "../styles/globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terminal Roguelike",
  description:
    "A terminal-style roguelike game built with Next.js and TailwindCSS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
