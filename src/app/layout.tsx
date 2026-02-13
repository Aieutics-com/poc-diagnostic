import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "POC Lifecycle Diagnostic — Aieutics",
  description:
    "A self-assessment tool for founders navigating proof of concept to contract. Identify where your POC is at risk before it costs you.",
  openGraph: {
    title: "POC Lifecycle Diagnostic — Aieutics",
    description:
      "Identify where your proof of concept is at risk — across 5 critical dimensions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Almarai:wght@300;400;700&family=IBM+Plex+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
          {children}
          <Analytics />
          <SpeedInsights />
        </body>
    </html>
  );
}
