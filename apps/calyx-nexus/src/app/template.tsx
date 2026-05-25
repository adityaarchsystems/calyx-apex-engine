"use client";

import { motion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.main
      initial={{ y: 20, filter: "blur(4px)" }}
      animate={{ y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
    >
      {children}
    </motion.main>
  );
}
