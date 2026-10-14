import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", axes: ["opsz"] });
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Ved Patel | Full-stack developer",
  description: "Portfolio of Ved Patel: web products, AI tooling, and robotics software.",
  openGraph: {
    title: "Ved Patel | Full-stack developer",
    description: "Web products, AI tooling, and robotics software.",
    type: "website",
  },
};

export const viewport: Viewport = { themeColor: "#e9eef5" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
