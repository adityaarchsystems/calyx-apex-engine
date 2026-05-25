"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FRAGMENTS = [
  "git_ref_0x42",
  "id_fragment_alpha",
  "sig_block_0xBF",
  "raw_meta_0x7D",
  "trace_vec_beta",
  "uid_shard_0xC1",
];

const HASH_BASE = "0x8X99A_B2F_001";

const Fragment = ({ label, delay }: { label: string; delay: number }) => (
  <motion.span
    className="block font-mono text-[11px] tracking-[0.12em] text-[#C8F135]/35 whitespace-nowrap absolute left-0"
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: ["-5%", "115%"], opacity: [0, 0.7, 0.7, 0] }}
    transition={{ duration: 5, delay, repeat: Infinity, ease: "linear", times: [0, 0.15, 0.8, 1] }}
  >
    {label}
  </motion.span>
);

export const IdentityDecryptor = () => {
  const [hash, setHash] = useState(HASH_BASE);
  const [proof, setProof] = useState("--.-");
  const [stack, setStack] = useState("...");
  const [hovered, setHovered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const t1 = setTimeout(() => setProof("98.4"), 2200);
    const t2 = setTimeout(() => setStack("RUST / TS / GO"), 3600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  useEffect(() => {
    if (!hovered) { setHash(HASH_BASE); return; }
    const iv = setInterval(() => {
      setHash(`0x${Math.random().toString(16).slice(2, 10).toUpperCase()}`);
    }, 140);
    return () => clearInterval(iv);
  }, [hovered]);

  const rise = { y: hovered ? -4 : 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const } };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full max-w-5xl flex items-center justify-between gap-6 bg-transparent"
      style={{ minHeight: 340 }}
    >
      {/* ── STAGE 01: RAW INGEST ───────────────────────────── */}
      <div className="relative w-[180px] h-[320px] overflow-hidden flex-shrink-0">
        <div className="absolute top-2 left-0 font-mono text-[9px] text-white/15 tracking-[0.18em] uppercase">Stage.01 // Ingest</div>
        {FRAGMENTS.map((f, i) => (
          <Fragment key={f} label={f} delay={i * 0.85} />
        ))}
        {/* right fade */}
        <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-r from-transparent to-[#070E16]" />
      </div>

      {/* ── FLOW CONNECTOR: left → prism ───────────────────── */}
      <svg width="48" height="2" className="flex-shrink-0 opacity-30" style={{ overflow: "visible" }}>
        <line x1="0" y1="1" x2="48" y2="1" stroke="#C8F135" strokeWidth="0.3" strokeDasharray="4 3" />
        <polygon points="46,−3 52,1 46,5" fill="#C8F135" opacity="0.5" />
      </svg>

      {/* ── STAGE 02: SCANNING PRISM ───────────────────────── */}
      <motion.div animate={rise} className="relative flex-shrink-0" style={{ width: 72, height: 320 }}>
        {/* Emerald aura behind */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 120px 200px at 50% 50%, rgba(200,241,53,0.06) 0%, transparent 75%)",
            transform: "scale(2.2)",
          }}
        />
        {/* Glass conduit */}
        <div
          className="absolute inset-0 backdrop-blur-md overflow-hidden"
          style={{
            border: "0.3px solid rgba(200,241,53,0.22)",
            background: "rgba(255,255,255,0.015)",
          }}
        >
          {/* Scanning beam */}
          <motion.div
            className="absolute w-full"
            style={{ height: 1, background: "linear-gradient(90deg, transparent, #C8F135 40%, #C8F135, transparent)", boxShadow: "0 0 12px 2px #C8F135" }}
            animate={{ y: [-2, 320] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "linear" }}
          />
          {/* Processing label */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <span className="font-mono text-[9px] text-[#C8F135]/50 tracking-[0.18em] uppercase">PRISM</span>
          </div>
        </div>
        <div className="absolute top-2 left-0 right-0 flex justify-center">
          <span className="font-mono text-[9px] text-white/15 tracking-[0.14em] uppercase">Stage.02</span>
        </div>
      </motion.div>

      {/* ── FLOW CONNECTOR: prism → profile ────────────────── */}
      <svg width="48" height="2" className="flex-shrink-0 opacity-30" style={{ overflow: "visible" }}>
        <line x1="0" y1="1" x2="48" y2="1" stroke="#C8F135" strokeWidth="0.3" strokeDasharray="4 3" />
        <polygon points="46,−3 52,1 46,5" fill="#C8F135" opacity="0.5" />
      </svg>

      {/* ── STAGE 03: MASTER PROFILE ───────────────────────── */}
      <motion.div
        animate={rise}
        className="flex-1 h-[320px] flex flex-col justify-center gap-6 p-6"
        style={{ border: "0.3px solid rgba(255,255,255,0.09)", background: "rgba(255,255,255,0.01)", backdropFilter: "blur(12px)" }}
      >
        <div className="font-mono text-[10px] text-[#C8F135]/70 tracking-[0.18em] uppercase border-b pb-3" style={{ borderColor: "rgba(200,241,53,0.12)" }}>
          MASTER_PROFILE // VECTOR-01
        </div>
        <div className="absolute top-2 right-4 font-mono text-[9px] text-white/15 tracking-[0.14em] uppercase">Stage.03</div>

        {/* IDENTITY_HASH */}
        <div className="space-y-1">
          <div className="font-mono text-[9px] text-white/20 tracking-[0.14em] uppercase">IDENTITY_HASH</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={hash}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              className="font-mono text-[11px] tracking-[0.12em] text-white/85"
            >
              {hash}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* PROOF_OF_WORK */}
        <div className="space-y-1">
          <div className="font-mono text-[9px] text-white/20 tracking-[0.14em] uppercase">PROOF_OF_WORK</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={proof}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="font-mono text-[11px] tracking-[0.12em] text-[#C8F135]"
            >
              {proof}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* NORMALIZED_STACK */}
        <div className="space-y-1">
          <div className="font-mono text-[9px] text-white/20 tracking-[0.14em] uppercase">NORMALIZED_STACK</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={stack}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35 }}
              className="font-mono text-[11px] tracking-[0.12em] text-white/55"
            >
              {stack}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};
