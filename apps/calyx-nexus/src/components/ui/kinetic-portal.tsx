"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function KineticPortal({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <motion.div 
      className={cn("relative w-full h-full", className)}
      whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
      whileHover={{ y: -4, boxShadow: "0px 10px 30px -10px rgba(78, 138, 120, 0.25)" }}
    >
      {children}
    </motion.div>
  );
}
