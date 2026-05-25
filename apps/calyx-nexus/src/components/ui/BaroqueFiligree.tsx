"use client";

import React from "react";
import { motion } from "framer-motion";

export const BaroqueFiligree = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      <motion.div 
        animate={{ 
          x: [0, 15, 0, -15, 0],
          y: [0, -15, 0, 15, 0]
        }}
        transition={{ 
          duration: 20, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className="relative w-full h-full"
      >
        {/* Top Left Filigree */}
        <svg
          className="absolute top-[-50px] left-[-50px] w-[500px] h-[500px]"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="brass-grad-high" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37" />
              <stop offset="25%" stopColor="#8A6623" />
              <stop offset="50%" stopColor="#F9F6EE" />
              <stop offset="75%" stopColor="#8A6623" />
              <stop offset="100%" stopColor="#D4AF37" />
            </linearGradient>
            
            {/* Added a secondary specular filter for more luster */}
            <filter id="specular-glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path
            d="M50 50 C 150 50, 50 150, 150 150 S 250 50, 350 150 M100 100 Q 150 50, 200 100 T 300 100"
            stroke="url(#brass-grad-high)"
            strokeWidth="0.75"
            fill="none"
            filter="url(#specular-glow)"
          />
          <path
            d="M0 200 C 100 200, 200 100, 200 0 M50 150 Q 100 100, 150 150 T 250 150"
            stroke="url(#brass-grad-high)"
            strokeWidth="0.75"
            fill="none"
            filter="url(#specular-glow)"
          />
          <circle cx="50" cy="50" r="2.5" fill="url(#brass-grad-high)" filter="url(#specular-glow)" />
        </svg>

        {/* Bottom Right Filigree */}
        <svg
          className="absolute bottom-[-100px] right-[-100px] w-[600px] h-[600px] rotate-180"
          viewBox="0 0 500 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 100 C 300 100, 100 300, 300 300 S 500 100, 700 300"
            stroke="url(#brass-grad-high)"
            strokeWidth="0.75"
            fill="none"
            filter="url(#specular-glow)"
          />
          <path
            d="M0 500 C 200 500, 500 200, 500 0"
            stroke="url(#brass-grad-high)"
            strokeWidth="0.5"
            fill="none"
            filter="url(#specular-glow)"
          />
        </svg>
        
        {/* Center Ornamental */}
        <svg
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M300 100 Q 350 200, 300 300 T 300 500 M100 300 Q 200 350, 300 300 T 500 300"
            stroke="url(#brass-grad-high)"
            strokeWidth="0.5"
            filter="url(#specular-glow)"
          />
          <circle cx="300" cy="300" r="180" stroke="url(#brass-grad-high)" strokeWidth="0.25" strokeDasharray="10 10" filter="url(#specular-glow)" />
        </svg>
      </motion.div>
    </div>
  );
};
