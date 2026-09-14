import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500"], style: ["normal", "italic"], display: "swap" });

export const metadata: Metadata = {
  title: "Ved Patel — Software Engineer",
  description: "Software engineer building thoughtful products with AI, computer vision, full-stack development, and automation.",
  openGraph: { title: "Ved Patel — Software Engineer", description: "Selected work in intelligent systems and useful software.", type: "website" },
};
export const viewport: Viewport = { themeColor: "#f5f0e9", colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning><ThemeProvider>{children}</ThemeProvider></body>
    </html>
  );
}
