"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BaroqueFiligree } from "@/components/ui/BaroqueFiligree";
import { AnodicObsidian } from "@/components/ui/AnodicObsidian";
import { GlassCard } from "@/components/ui/GlassCard";
import { NarrativeStrata, STRATA_DATA } from "@/components/ui/NarrativeStrata";
import { HandshakeTerminal } from "@/components/ui/HandshakeTerminal";
import { useRouter } from "next/navigation";
import { Layers, Shield, Zap, Globe, Info, Mail, Download, ArrowRight, CheckCircle2 } from "lucide-react";

export default function GatewayPage() {
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showEmailOverlay, setShowEmailOverlay] = useState(false);
  const [email, setEmail] = useState("");
  const [ticker, setTicker] = useState(87);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTicker((prev) => (prev > 12 ? prev - (Math.random() > 0.9 ? 1 : 0) : prev));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInitiateHandshake = () => {
    setIsTerminalOpen(true);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setShowEmailOverlay(false);
    setIsVerifying(true);
    
    setTimeout(() => {
      localStorage.setItem("isFounder", "true");
      localStorage.setItem("founderEmail", email);
      router.push("/gateway/intel");
    }, 4500);
  };

  return (
    <main className="relative min-h-screen text-white flex flex-col items-center p-6 md:p-12">
      <AnodicObsidian />
      <BaroqueFiligree />

      <AnimatePresence>
        {isTerminalOpen && (
          <HandshakeTerminal onClose={() => setIsTerminalOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showEmailOverlay && (
          <EmailOverlay 
            email={email} 
            setEmail={setEmail} 
            onSubmit={handleEmailSubmit} 
            onClose={() => setShowEmailOverlay(false)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isVerifying ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative z-10 max-w-6xl w-full pb-32"
          >
            {/* ── 01_MANIFESTO ── */}
            <div id="manifesto" className="space-y-32 pt-32 pb-20">
              <header className="text-center space-y-8 pt-20">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[var(--calyx-accent)] font-mono text-[10px] tracking-[0.4em] uppercase"
                >
                  // Product Manifesto: The Nexus Developer Profile Aggregator
                </motion.div>
                <h1 className="text-6xl md:text-9xl font-['DM_Serif_Display'] leading-[0.85] tracking-tighter">
                  UNIFY THE <br />
                  <span className="text-white/30 italic">FRAGMENTED.</span>
                </h1>
                <p className="text-white/60 max-w-2xl mx-auto text-lg md:text-xl font-light font-['Outfit'] leading-relaxed">
                  The Calyx Nexus is not a portal. It is a high-fidelity engineering ledger—a cryptographic anchor for your professional identity in an age of fragmented codebases.
                </p>
              </header>

              <div className="grid md:grid-cols-3 gap-8">
                <GlassCard className="p-8 group">
                  <div className="space-y-6">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center">
                      <Layers className="w-5 h-5 text-white/40" />
                    </div>
                    <h3 className="text-2xl font-['DM_Serif_Display']">The Fragmented Stack</h3>
                    <p className="text-sm text-white/50 leading-relaxed font-['Outfit']">
                      Your proof-of-work is scattered across GitHub, Stack Overflow, private GitLab instances, and deep-learning repos. It is a chaotic trail of metadata.
                    </p>
                  </div>
                </GlassCard>

                <GlassCard className="p-8 group">
                  <div className="space-y-6">
                    <div className="w-10 h-10 bg-[var(--calyx-accent)]/10 border border-[var(--calyx-accent)]/20 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-[var(--calyx-accent)]" />
                    </div>
                    <h3 className="text-2xl font-['DM_Serif_Display']">The Unified Identity</h3>
                    <p className="text-sm text-white/50 leading-relaxed font-['Outfit']">
                      The Aggregator autonomously siphons, normalizes, and anchors your contributions into a single "Master Profile." An immutable, cryptographic ledger.
                    </p>
                  </div>
                </GlassCard>

                <GlassCard className="p-8 group">
                  <div className="space-y-6">
                    <div className="w-10 h-10 bg-white/5 border border-white/10 flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white/40" />
                    </div>
                    <h3 className="text-2xl font-['DM_Serif_Display']">Independent Lab</h3>
                    <p className="text-sm text-white/50 leading-relaxed font-['Outfit']">
                      Calyx Studios is an independent software architecture lab based in Vector-01 Core. Supporting this project funds high-fidelity R&D.
                    </p>
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* ── 02_ARCHITECTURE ── */}
            <div className="space-y-0">
              {STRATA_DATA.map((strata, idx) => (
                <section key={strata.id}>
                  <NarrativeStrata 
                    id={strata.id}
                    heading={strata.heading}
                    body={strata.desc}
                    imgSrc={strata.src}
                    reverse={idx % 2 !== 0}
                  />
                </section>
              ))}
            </div>

            {/* ── 03_TRINITY ── */}
            <section id="trinity" className="py-40">
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-6xl font-['DM_Serif_Display'] uppercase tracking-tight">THE COMMERCIAL TRINITY</h2>
                <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest">// SECURE LIFETIME ACCESS TO THE NEXUS ECOSYSTEM</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                <GlassCard className="p-10 flex flex-col h-full group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--calyx-accent)]/20 z-0" />
                  <div className="mb-8 relative z-10 pt-4">
                    <div className="font-mono text-[10px] text-white/40 mb-2 tracking-widest uppercase">TIER_01 // FOUNDER</div>
                    <h3 className="text-3xl font-['DM_Serif_Display'] mb-4">FOUNDER LICENSE</h3>
                    <div className="text-4xl font-['DM_Serif_Display'] text-white">$15.00</div>
                  </div>
                  <ul className="space-y-4 mb-12 flex-grow">
                    <li className="flex items-start gap-3 text-sm text-white/60 font-['Outfit']">
                      <CheckCircle2 className="w-4 h-4 text-[var(--calyx-accent)] mt-0.5 flex-shrink-0" />
                      Lifetime Nexus Aggregator Access
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60 font-['Outfit']">
                      <CheckCircle2 className="w-4 h-4 text-[var(--calyx-accent)] mt-0.5 flex-shrink-0" />
                      27 Micro-SaaS Intelligence Strata
                    </li>
                  </ul>
                  <button onClick={handleInitiateHandshake} className="relative z-10 w-full py-4 bg-white/[0.05] border border-white/10 hover:border-[var(--calyx-accent)] transition-all font-mono text-[10px] tracking-widest uppercase">
                    [ INITIATE_HANDSHAKE ]
                  </button>
                </GlassCard>

                <GlassCard className="p-10 flex flex-col h-full group relative overflow-hidden border-[var(--calyx-accent)]/30">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-[var(--calyx-accent)] z-0" />
                  <div className="mb-8 relative z-10 pt-4">
                    <div className="font-mono text-[10px] text-[var(--calyx-accent)] mb-2 tracking-widest uppercase">TIER_02 // ARCHITECT</div>
                    <h3 className="text-3xl font-['DM_Serif_Display'] mb-4">ARCHITECT LICENSE</h3>
                    <div className="text-4xl font-['DM_Serif_Display'] text-white">$25.00</div>
                  </div>
                  <ul className="space-y-4 mb-12 flex-grow">
                    <li className="flex items-start gap-3 text-sm text-white/60 font-['Outfit']">
                      <CheckCircle2 className="w-4 h-4 text-[var(--calyx-accent)] mt-0.5 flex-shrink-0" />
                      Everything in Founder License
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60 font-['Outfit']">
                      <CheckCircle2 className="w-4 h-4 text-[var(--calyx-accent)] mt-0.5 flex-shrink-0" />
                      Priority Beta: FOLIO & Omni-Ad
                    </li>
                  </ul>
                  <button onClick={handleInitiateHandshake} className="relative z-10 w-full py-4 bg-[var(--calyx-accent)]/10 border border-[var(--calyx-accent)]/40 hover:bg-[var(--calyx-accent)]/20 transition-all font-mono text-[10px] tracking-widest uppercase">
                    [ SECURE_ACCESS ]
                  </button>
                </GlassCard>

                <GlassCard className="p-10 flex flex-col h-full group relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-[3px] bg-white/20 z-0" />
                  <div className="mb-8 relative z-10 pt-4">
                    <div className="font-mono text-[10px] text-white/40 mb-2 tracking-widest uppercase">TIER_03 // PARTNER</div>
                    <h3 className="text-3xl font-['DM_Serif_Display'] mb-4">PARTNER LICENSE</h3>
                    <div className="text-4xl font-['DM_Serif_Display'] text-white">$35.00</div>
                  </div>
                  <ul className="space-y-4 mb-12 flex-grow">
                    <li className="flex items-start gap-3 text-sm text-white/60 font-['Outfit']">
                      <CheckCircle2 className="w-4 h-4 text-[var(--calyx-accent)] mt-0.5 flex-shrink-0" />
                      Everything in Architect License
                    </li>
                    <li className="flex items-start gap-3 text-sm text-white/60 font-['Outfit']">
                      <CheckCircle2 className="w-4 h-4 text-[var(--calyx-accent)] mt-0.5 flex-shrink-0" />
                      1-on-1 Architecture Consultation
                    </li>
                  </ul>
                  <button onClick={handleInitiateHandshake} className="relative z-10 w-full py-4 bg-white/5 border border-white/10 hover:border-white transition-all font-mono text-[10px] tracking-widest uppercase">
                    [ PARTNER_UP ]
                  </button>
                </GlassCard>
              </div>

              <div className="flex flex-col items-center gap-6 pt-24 border-t border-white/5">
                <div className="flex items-center gap-3 font-mono text-[10px] text-white/20 tracking-[0.4em] uppercase">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                  <span>{ticker}/100 SLOTS_REMAINING</span>
                </div>
                <div className="font-mono text-[9px] text-white/10 tracking-[0.3em] uppercase">
                  EST. 2026 // CALYX_STUDIOS // ROOT_STRATA
                </div>
              </div>
            </section>
          </motion.div>
        ) : (
          <VaultSequence key="vault" />
        )}
      </AnimatePresence>
    </main>
  );
}

function EmailOverlay({ email, setEmail, onSubmit, onClose }: { email: string; setEmail: (v: string) => void; onSubmit: (e: React.FormEvent) => void; onClose: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
    >
      <GlassCard className="max-w-md w-full p-12 relative overflow-hidden">
        <button onClick={onClose} className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors">
          <Info className="w-5 h-5 rotate-45" />
        </button>
        <div className="space-y-8 text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[var(--calyx-accent)]/10 border border-[var(--calyx-accent)]/30 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-[var(--calyx-accent)]" />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-['DM_Serif_Display']">Secure Handshake</h3>
            <p className="text-sm text-white/50 font-['Outfit']">Enter engineering credentials to sync the Founder's Artifact.</p>
          </div>
          <form onSubmit={onSubmit} className="space-y-6">
            <input 
              type="email" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="architect@nexus.network"
              className="w-full bg-white/[0.03] border border-white/10 p-4 rounded-none font-mono text-sm focus:outline-none focus:border-[var(--calyx-accent)] text-center"
            />
            <button type="submit" className="w-full py-4 bg-[var(--calyx-accent)] text-white font-mono text-[10px] tracking-[0.4em] uppercase hover:brightness-110 transition-all flex items-center justify-center gap-2 group">
              [ SYNC_IDENTITY ] <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </GlassCard>
    </motion.div>
  );
}

function VaultSequence() {
  const [logs, setLogs] = useState<string[]>([]);
  const sequence = [
    "INITIALIZING_IDENTITY_HASH...",
    "ESTABLISHING_ENCRYPTED_TUNNEL...",
    "Root_Handshake_Established.",
    "PARSING_AGGREGATOR_LICENSE_v1.0.4...",
    "VAULT_ROOT_AUTHORITY_SECURED.",
    "SYNCING_FOUNDER_ARTIFACT_VIA_SMTP...",
    "DELIVERY_PROTOCOL_COMPLETE.",
    "INJECTING_BONUS_INTEL_STRATA...",
    "WELCOME_FOUNDER.",
    "REDIRECTING_TO_INTERNAL_NEXUS..."
  ];

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < sequence.length) {
        setLogs((prev) => [...prev, sequence[i]]);
        i++;
      } else {
        clearInterval(interval);
      }
    }, 450);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
    >
      <div className="w-full max-w-xl font-mono text-sm text-[var(--calyx-accent)]">
      <div className="bg-black/80 backdrop-blur-xl p-8 border border-[var(--calyx-accent)]/20 shadow-[0_0_50px_rgba(var(--calyx-accent-rgb),0.1)]">
        <div className="flex items-center gap-2 mb-6 border-b border-[var(--calyx-accent)]/10 pb-4">
          <div className="w-2 h-2 bg-[var(--calyx-accent)] rounded-full animate-pulse" />
          <span className="uppercase tracking-widest text-xs">Identity Generator v1.0.4</span>
        </div>
        <div className="space-y-2 h-[300px] overflow-y-auto custom-scrollbar">
          {logs.map((log, idx) => (
            <motion.div key={idx} initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={log && (log.startsWith("WELCOME") || log.includes("COMPLETE")) ? "text-white mt-4 text-lg" : "opacity-70"}>
              <span className="mr-2 opacity-30">[{new Date().toLocaleTimeString()}]</span>
              {log}
            </motion.div>
          ))}
          <div className="animate-pulse">_</div>
        </div>
        </div>
      </div>
    </motion.div>
  );
}
