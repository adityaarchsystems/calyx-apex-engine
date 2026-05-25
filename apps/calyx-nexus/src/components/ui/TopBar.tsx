"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

const ANCHORS = [
  { id: "manifesto", label: "01_MANIFESTO" },
  { id: "dashboard", label: "02_DASHBOARD" },
  { id: "matrix", label: "03_MATRIX" },
  { id: "cloud", label: "04_CLOUD" },
  { id: "ecosystem", label: "05_ECOSYSTEM" },
  { id: "trinity", label: "06_TRINITY" },
];

const NavItem = ({ anchor, active, progress, onScroll }: { anchor: any; active: boolean; progress: number; onScroll: (id: string) => void }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.button
      onClick={() => onScroll(anchor.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ scale: 1.02 }}
      className="relative flex flex-col items-center justify-center h-full px-4 group"
    >
      <motion.span
        animate={{
          color: (active || hovered) ? "#C8F135" : "rgba(255, 255, 255, 0.35)",
          letterSpacing: hovered ? "0.35em" : "0.2em",
          textShadow: (active || hovered) ? "0 0 12px rgba(200, 241, 53, 0.6)" : "none",
        }}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
        className="font-mono text-[11px] uppercase whitespace-nowrap"
        style={{ fontFamily: "'DM Mono', monospace" }}
      >
        {anchor.label}
      </motion.span>

      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 border-[0.5px] border-[#C8F135]/20 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {active && (
        <motion.div
          layoutId="nav-active-lock"
          className="absolute -bottom-[0.3px] h-[1.5px] bg-[#C8F135] w-full left-0 z-10"
          transition={{ type: "spring", stiffness: 400, damping: 35 }}
        />
      )}

      <div className="absolute bottom-0 left-0 w-full h-[0.3px] bg-white/5 overflow-hidden">
        <motion.div
          className="h-full bg-[#C8F135]/40"
          initial={{ width: 0 }}
          animate={{ width: active ? `${progress * 100}%` : 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
    </motion.button>
  );
};

export const TopBar = () => {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState("manifesto");
  const [sectionProgress, setSectionProgress] = useState<{ [key: string]: number }>({});
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    const handleScrollTelemetry = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollY > 10); // Mandate 4: 10px trigger
      
      const newProgress: { [key: string]: number } = {};
      const viewTop = 44; 
      
      ANCHORS.forEach((a) => {
        const el = document.getElementById(a.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const height = el.offsetHeight;
          
          let p = 0;
          if (rect.top <= viewTop && rect.bottom >= viewTop) {
            p = Math.min(1, Math.max(0, (viewTop - rect.top) / height));
          } else if (rect.bottom < viewTop) {
            p = 1;
          }
          newProgress[a.id] = p;
        }
      });
      setSectionProgress(newProgress);
    };

    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      // Winner-Takes-All Telemetry with high-res "Trigger Line"
      const activeEntries = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (activeEntries.length > 0) {
        setActiveSection(activeEntries[0].target.id);
      }
    };

    const observerOptions = {
      root: null,
      // Mandate 3: Razor-thin "Trigger Line" in the horizontal center
      rootMargin: "-45% 0px -45% 0px", 
      threshold: 0, 
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);
    ANCHORS.forEach((a) => {
      const el = document.getElementById(a.id);
      if (el) observer.observe(el);
    });

    window.addEventListener("scroll", handleScrollTelemetry, { passive: true });
    handleScrollTelemetry(); 

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScrollTelemetry);
    };
  }, []);

  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      if (id === "manifesto") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        el.scrollIntoView({ 
          behavior: "smooth", 
          block: "center" 
        });
      }
    }
  };

  if (!mounted || pathname !== "/gateway") return null;

  const content = (
    <header
      className="fixed top-0 left-0 right-0 z-[999999] flex items-center justify-center pointer-events-auto"
      style={{ 
        height: "44px",
        transition: "background-color 0.4s ease, backdrop-filter 0.4s ease",
        backgroundColor: isScrolled ? "rgba(7, 14, 22, 0.95)" : "transparent",
        backdropFilter: isScrolled ? "blur(24px)" : "blur(0px)",
        borderBottom: "0.3px solid rgba(200, 241, 53, 0.22)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999999,
      }}
    >
      <div className="flex h-full">
        {ANCHORS.map((a) => (
          <NavItem
            key={a.id}
            anchor={a}
            active={activeSection === a.id}
            progress={sectionProgress[a.id] || 0}
            onScroll={handleScrollTo}
          />
        ))}
      </div>
    </header>
  );

  const portalRoot = document.getElementById("portal-root");
  return portalRoot ? createPortal(content, portalRoot) : content;
};
