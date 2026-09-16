import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display", weight: ["400", "500"], style: ["normal", "italic"], display: "swap" });

export const metadata: Metadata = {
  title: "Ved Patel — Computer Science & Software Engineering",
  description: "Computer science student at UT Dallas building production APIs, computer vision systems, retrieval tools, and autonomous robotics software.",
  openGraph: { title: "Ved Patel — Computer Science & Software Engineering", description: "Selected work across production software, applied AI, and autonomous systems.", type: "website" },
};
export const viewport: Viewport = { themeColor: "#1c1613", colorScheme: "light dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" className={`${sans.variable} ${display.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
        <Script src="/_vercel/insights/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
