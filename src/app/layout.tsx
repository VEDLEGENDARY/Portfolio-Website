import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif" });
const sans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Ved Patel | Portfolio",
  description: "Portfolio of Ved Patel: retrieval systems, AI applications, and robotics software. Computer science student at UT Dallas.",
  applicationName: "Ved Patel Portfolio",
  openGraph: { title: "Ved Patel | Portfolio", description: "Retrieval systems, AI applications, and robotics software.", type: "website" },
};
export const viewport: Viewport = { themeColor: "#eeebe3" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'document.documentElement.classList.add("js")' }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
