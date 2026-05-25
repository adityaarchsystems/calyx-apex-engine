'use client';

import { useSystem } from "@/context/SystemContext";

export default function ScannerOverlay() {
  const { isDiagnosticsActive } = useSystem();

  if (!isDiagnosticsActive) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="scanner-line" />
      {/* Ambient Scanning Glow - Calibrated to 5% opacity */}
      <div className="absolute inset-0 bg-[var(--calyx-accent)]/5 animate-pulse pointer-events-none" />
    </div>
  );
}
