import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "双星时报 · 3D 全景数字报刊 (星洲日报 × 中国报)",
  description: "Awwwards-style 3D interactive digital newspaper aggregating real-time trending news from Sin Chew Daily and China Press (Twin Star Post).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&family=Noto+Serif+SC:wght@400;600;700;900&family=Noto+Serif+TC:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-paper text-ink font-sans-sc antialiased selection:bg-ink selection:text-paper">
        {children}
      </body>
    </html>
  );
}
