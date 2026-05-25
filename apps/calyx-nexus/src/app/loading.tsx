"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-calyx-bg">
      <motion.div
        className="h-[1px] w-32 bg-calyx-turquoise"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="mt-4 font-mono text-[10px] text-calyx-slate tracking-[0.2em] uppercase">
        [ SYSTEM DEPLOYMENT IN PROGRESS ]
      </p>
    </div>
  );
}
