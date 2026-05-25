"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";

const SLIDES = [
  {
    src: "/aggregator_dashboard_crop.png",
    alt: "Aggregator Dashboard",
    module: "0x99A_STRATA",
    node: "PRIMARY_VECTOR_01",
    label: "The Aggregator",
    sub: "Real-time multi-platform contribution normalization",
  },
  {
    src: "/github_matrix_crop.png",
    alt: "GitHub Matrix",
    module: "0xB4C_MATRIX",
    node: "GITHUB_SIPHON_02",
    label: "GitHub Matrix",
    sub: "Dense metadata extraction from global repositories",
  },
  {
    src: "/impact_globe_crop.png",
    alt: "Impact Globe",
    module: "0xF7E_GLOBE",
    node: "SPATIAL_VECTOR_03",
    label: "Impact Globe",
    sub: "Cryptographic footprint visualized across the ecosystem",
  },
];

const wrap = (min: number, max: number, v: number) =>
  ((((v - min) % (max - min)) + (max - min)) % (max - min)) + min;

export const IndustrialCarousel = () => {
  const [[page, dir], setPage] = useState([0, 0]);
  const [hovered, setHovered] = useState(false);

  const idx = wrap(0, SLIDES.length, page);
  const slide = SLIDES[idx];

  const paginate = (d: number) => setPage([page + d, d]);

  const dragX = useMotionValue(0);
  const dragOpacity = useTransform(dragX, [-200, 0, 200], [0.4, 1, 0.4]);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative w-full max-w-5xl mx-auto bg-transparent"
    >
      {/* Emerald aura */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 600px 400px at 50% 50%, rgba(200,241,53,0.06) 0%, transparent 70%)",
        }}
      />

      {/* Viewport — hover rise applied here */}
      <motion.div
        animate={{ y: hovered ? -4 : 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden"
        style={{ aspectRatio: "16/9", cursor: "grab" }}
      >
        <AnimatePresence initial={false} custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: "easeInOut" }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.12}
            style={{ x: dragX, opacity: dragOpacity }}
            onDragEnd={(_, info) => {
              if (info.offset.x < -60) paginate(1);
              else if (info.offset.x > 60) paginate(-1);
              else dragX.set(0);
            }}
            className="absolute inset-0"
          >
            {/* Image */}
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="(max-width: 1280px) 100vw, 1024px"
              className="object-cover brightness-[0.80] select-none"
              draggable={false}
              priority
            />

            {/* Drifting scanline */}
            <motion.div
              className="absolute left-0 right-0 pointer-events-none"
              style={{ height: 1, background: "rgba(255,255,255,0.05)" }}
              animate={{ top: ["0%", "100%"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
            />

            {/* Bottom gradient + label */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070E16]/85 via-[#070E16]/20 to-transparent" />

            {/* Bottom-left label */}
            <div className="absolute bottom-6 left-6 space-y-1">
              <div
                className="font-mono text-[11px] tracking-[0.12em] text-white/80"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {slide.label}
              </div>
              <div
                className="font-mono text-[10px] tracking-[0.1em] text-white/35"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                {slide.sub}
              </div>
            </div>

            {/* Top metadata brackets */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
              <div
                className="space-y-0.5"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                <div className="font-mono text-[10px] tracking-[0.12em] text-[#C8F135]/60">
                  MODULE: {slide.module}
                </div>
                <div className="font-mono text-[10px] tracking-[0.12em] text-white/30">
                  NODE: {slide.node}
                </div>
              </div>
              <div
                className="font-mono text-[10px] tracking-[0.12em] text-[#C8F135]/50"
                style={{ fontFamily: "'DM Mono', monospace" }}
              >
                STATUS: VERIFIED
              </div>
            </div>

            {/* Slide counter — bottom right */}
            <div
              className="absolute bottom-6 right-6 font-mono text-[10px] tracking-[0.14em] text-white/25"
              style={{ fontFamily: "'DM Mono', monospace" }}
            >
              {String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        {(["prev", "next"] as const).map((side) => (
          <button
            key={side}
            onClick={() => paginate(side === "next" ? 1 : -1)}
            className="absolute top-1/2 -translate-y-1/2 z-20 w-8 h-8 flex items-center justify-center text-white/30 hover:text-[#C8F135] transition-colors"
            style={{ [side === "prev" ? "left" : "right"]: "1rem" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              {side === "prev" ? (
                <polyline points="9,2 4,7 9,12" stroke="currentColor" strokeWidth="0.3" />
              ) : (
                <polyline points="5,2 10,7 5,12" stroke="currentColor" strokeWidth="0.3" />
              )}
            </svg>
          </button>
        ))}
      </motion.div>

      {/* Pip indicators */}
      <div className="flex justify-center gap-3 mt-5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > idx ? 1 : -1])}
            className="transition-all duration-300"
            style={{
              width: i === idx ? 20 : 4,
              height: 4,
              background: i === idx ? "#C8F135" : "rgba(255,255,255,0.15)",
            }}
          />
        ))}
      </div>
    </div>
  );
};
