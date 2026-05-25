"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download as DownloadIcon, Terminal as TerminalIcon, X as CloseIcon } from "lucide-react";

interface HandshakeTerminalProps {
  onClose: () => void;
}

export const HandshakeTerminal = ({ onClose }: HandshakeTerminalProps) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  const sequence = [
    "> INITIALIZING SECURE HANDSHAKE...",
    "> PINGING IND-NODE-01 (BHILAI)... [ OK ]",
    "> EXTRACTING CRYPTOGRAPHIC LEDGER...",
    "> GENERATING VAULT_KEY.CALYX...",
    "> HANDSHAKE PROTOCOL STABILIZED."
  ];

  useEffect(() => {
    setMounted(true);
    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs((prev) => [...prev, sequence[i]]);
        i++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(["CALYX_NEXUS_VAULT_KEY_v1.0.4\nSTATUS: AUTHORIZED\nIDENTITY_HASH: 0x7F...3B9A"], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "VAULT_KEY.calyx";
    document.body.appendChild(element);
    element.click();
  };

  if (!mounted) return null;

  const terminalContent = (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
      style={{ zIndex: 1000000 }}
    >
      <motion.div
        initial={{ scale: 1, opacity: 1, y: 0 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-[500px] bg-[#070E16]/95 border border-[#C8F135]/50 backdrop-blur-2xl p-8 relative shadow-[0_0_50px_rgba(200,241,53,0.15)]"
        style={{ zIndex: 1000001 }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/30 hover:text-[#C8F135] transition-colors"
        >
          <CloseIcon className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-8 border-b border-[#C8F135]/20 pb-4">
          <TerminalIcon className="w-4 h-4 text-[#C8F135]" />
          <span className="font-mono text-[10px] tracking-[0.3em] text-[#C8F135] uppercase">Verification Sequence // v1.0.4</span>
        </div>

        <div className="space-y-3 h-[200px] overflow-y-auto mb-8 custom-scrollbar">
          {logs.map((log, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-mono text-[13px] text-white/80 leading-relaxed"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {log}
            </motion.div>
          ))}
          {!isComplete && (
            <span className="inline-block w-2 h-4 bg-[#C8F135] animate-pulse ml-1 align-middle" />
          )}
        </div>

        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="p-4 bg-[#C8F135]/10 border border-[#C8F135]/30">
                <p className="font-mono text-[11px] text-[#C8F135]/80 uppercase leading-relaxed">
                  Verification Complete. Access token generated via IND-NODE-01. Secure the artifact below.
                </p>
              </div>

              <button
                onClick={handleDownload}
                className="w-full py-4 bg-[#C8F135] text-black font-mono text-[11px] tracking-[0.4em] uppercase hover:brightness-110 transition-all flex items-center justify-center gap-3 group"
              >
                <DownloadIcon className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                [ DOWNLOAD ACCESS KEY ]
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center">
          <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Auth: IND-NODE-01</span>
          <span className="font-mono text-[9px] text-white/20 uppercase tracking-widest">Port: 8080</span>
        </div>
      </motion.div>
    </motion.div>
  );

  const terminalPortal = document.getElementById("terminal-portal");
  return terminalPortal ? createPortal(terminalContent, terminalPortal) : terminalContent;
};
