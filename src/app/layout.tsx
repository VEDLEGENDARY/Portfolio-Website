import type { Metadata } from "next";
import { Inter, Bricolage_Grotesque } from "next/font/google";
import Script from "next/script";
import { ThemeProvider } from "@/components/theme-provider";
import { LenisProvider } from "@/providers/lenis-provider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["600", "700", "800"],
  display: "swap",
});

// Inline SVG matching your logo styling (rounded corners, accent background, bold VP text)
const faviconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="8" fill="#9de84d" />
  <text 
    x="50%" 
    y="55%" 
    dominant-baseline="middle" 
    text-anchor="middle" 
    fill="#000000" 
    font-family="system-ui, -apple-system, sans-serif" 
    font-weight="medium" 
    font-size="18"
  >VP</text>
</svg>
`.trim();

const faviconDataUrl = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

export const metadata: Metadata = {
  title: "Ved Patel",
  description:
    "Motivated Software Engineer and Full Stack Developer building Artificial Intelligent systems, Computer Vision systems, Automated Pipelines, and Production RESTful APIs in Fintech. Ready to learn and grow.",
  icons: {
    icon: faviconDataUrl,
  },
  openGraph: {
    title: "Ved Patel — Software Engineer",
    description:
      "SWE, Full Stack, AI Systems, Automation, much more...",
    type: "website",
  },
};

export const viewport = {
  themeColor: "#080808",
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${bricolage.variable} antialiased`}
      style={{ backgroundColor: "var(--color-background)", color: "var(--color-foreground)" }}
      suppressHydrationWarning
    >
      <body 
        className="min-h-full font-sans bg-[var(--color-background)] text-[var(--color-foreground)]"
        suppressHydrationWarning
      >
        <Script
          src="https://mcp.figma.com/mcp/html-to-design/capture.js"
          strategy="afterInteractive"
        />
        <LenisProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </LenisProvider>
      </body>
    </html>
  );
}