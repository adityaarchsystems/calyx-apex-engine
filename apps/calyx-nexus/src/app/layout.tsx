import type { Metadata, Viewport } from "next";
import { Inter, Geist_Mono, Geist, DM_Serif_Display, DM_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import Navigator from "@/components/Navigator";
import { SystemProvider } from "@/context/SystemContext";
import ScannerOverlay from "@/components/ScannerOverlay";
import { TopBar } from "@/components/ui/TopBar";
import { CanvasProvider } from "@/context/CanvasContext";
import StudioCanvasOverlay from "@/components/canvas/StudioCanvasOverlay";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const dmSerif = DM_Serif_Display({ variable: "--font-dm-serif", weight: "400", subsets: ["latin"], display: "swap" });
const dmMono = DM_Mono({ variable: "--font-dm-mono", weight: ["300", "400", "500"], subsets: ["latin"], display: "swap" });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "Calyx Nexus — Developer Profile Aggregator",
  description: "Ultra-high-fidelity developer profile aggregation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark", inter.variable, geistMono.variable, dmSerif.variable, dmMono.variable, "font-sans", geist.variable)}
      suppressHydrationWarning
    >
      <body className="bg-calyx-bg text-calyx-slate antialiased touch-action-none" suppressHydrationWarning>
        <SystemProvider>
          <CanvasProvider>
            <div id="portal-root" className="relative z-[999999]" />
            <div id="terminal-portal" className="relative z-[1000000]" />
            <TopBar />
            <ScannerOverlay />
            <Navigator />
            <StudioCanvasOverlay />
            {children}
          </CanvasProvider>
        </SystemProvider>
      </body>
    </html>
  );
}
