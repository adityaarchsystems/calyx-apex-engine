"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export const STRATA_DATA = [
  {
    id: "dashboard",
    heading: "// MODULE_01: APEX_AGGREGATION",
    desc: "The Nexus autonomously siphons fragmented professional data into a single, high-fidelity profile. Every commit, deployment, and documentation shard is normalized into a unified cryptographic ledger.",
    src: "/dashboard-real.png"
  },
  {
    id: "matrix",
    heading: "// MODULE_02: METADATA_EXTRACTION",
    desc: "GraphQL-driven extraction monitors commit velocity, PR turnaround, and impact scores. Our engine normalizes frequency and complexity across multi-source repositories to calculate an authoritative 98.4 Calyx Impact Score.",
    src: "/matrix-real.png"
  },
  {
    id: "cloud",
    heading: "// MODULE_03: LIVE_INFRASTRUCTURE",
    desc: "Nexus operations are powered by a serverless container orchestration layer on GCP. Real-time telemetry manages L7 load balancing and 4,291 REQ/MIN traffic volume with 99.9% uptime for your profile.",
    src: "/cloud-real.png"
  },
  {
    id: "ecosystem",
    heading: "// MODULE_04: COMPUTE_ECOSYSTEM",
    desc: "Integrated intelligence strata leverage Hugging Face inference endpoints and Google Developer environments to synthesize real-time engineering insights and predictive contribution mapping.",
    src: "/ecosystem-real.png"
  }
];

interface StrataProps {
  id: string;
  heading: string;
  body: string;
  imgSrc: string;
  reverse?: boolean;
}

export const NarrativeStrata = ({ id, heading, body, imgSrc, reverse }: StrataProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      id={id}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative w-full flex flex-col md:flex-row items-center gap-16 py-32 ${
        reverse ? "md:flex-row-reverse" : ""
      }`}
    >
      {/* Side-A: Media */}
      <motion.div
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex-1 aspect-[16/10] w-full group overflow-hidden"
      >
        <div className="relative w-full h-full">
          <Image
            src={imgSrc}
            alt={heading}
            fill
            sizes="(max-width: 1280px) 100vw, 800px"
            className="object-cover brightness-[0.80] transition-all duration-700"
          />
        </div>
      </motion.div>

      {/* Side-B: Intelligence */}
      <div className="flex-1 space-y-6 max-w-xl">
        <motion.div
          initial={{ opacity: 0, x: reverse ? 20 : -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-4"
        >
          <div className="font-mono text-[12px] tracking-[0.2em] text-[#C8F135] uppercase">
            {heading}
          </div>
          <p className="font-mono text-[14px] leading-relaxed text-white/60 tracking-tight" style={{ fontFamily: "'DM Mono', monospace" }}>
            {body}
          </p>
        </motion.div>
        
        {/* Measurement Line */}
        <div className="w-full h-px bg-gradient-to-r from-[#C8F135]/20 via-white/5 to-transparent relative">
            <div className="absolute left-0 -top-1 w-px h-2 bg-[#C8F135]/40" />
        </div>
      </div>
    </div>
  );
};
