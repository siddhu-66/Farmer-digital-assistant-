"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function BusinessMarketBackground() {
  // Check for reduced motion preference
  const shouldReduceMotion = useReducedMotion();
  
  // Memoize static elements to prevent re-renders
  const tradeLines = React.useMemo(() => [
    { id: 1, path: "M10,50 Q30,30 50,50 T90,50", delay: 0 },
    { id: 2, path: "M5,70 Q25,50 45,70 T85,70", delay: 1 },
    { id: 3, path: "M15,30 Q35,10 55,30 T95,30", delay: 2 },
  ], []);

  const movingDots = React.useMemo(() => [
    { id: 1, path: "M10,50 Q30,30 50,50 T90,50", delay: 0 },
    { id: 2, path: "M10,50 Q30,30 50,50 T90,50", delay: 2 },
    { id: 3, path: "M5,70 Q25,50 45,70 T85,70", delay: 4 },
    { id: 4, path: "M15,30 Q35,10 55,30 T95,30", delay: 6 },
    { id: 5, path: "M5,70 Q25,50 45,70 T85,70", delay: 8 },
    { id: 6, path: "M15,30 Q35,10 55,30 T95,30", delay: 10 },
  ], []);

  const marketIcons = React.useMemo(() => [
    { id: 1, x: 20, y: 25, type: 'box' },
    { id: 2, x: 50, y: 45, type: 'crop' },
    { id: 3, x: 80, y: 35, type: 'market' },
    { id: 4, x: 35, y: 65, type: 'order' },
    { id: 5, x: 65, y: 55, type: 'payment' },
  ], []);

  // Static render for reduced motion
  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50 to-green-50" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true" style={{ willChange: 'transform' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-emerald-50 to-green-50 opacity-100" />
      
      {/* Trade flow lines */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="tradeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.06" />
            <stop offset="50%" stopColor="#34d399" stopOpacity="0.04" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        
        {/* Static trade lines */}
        {tradeLines.map((line) => (
          <motion.path
            key={line.id}
            d={line.path}
            stroke="url(#tradeGradient)"
            strokeWidth="0.5"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ 
              duration: 4, 
              delay: line.delay,
              ease: "easeInOut"
            }}
            style={{ willChange: 'opacity' }}
          />
        ))}

        {/* Moving dots along trade paths - limited to 3 for performance */}
        {movingDots.slice(0, 3).map((dot) => (
          <motion.circle
            key={dot.id}
            r="0.6"
            fill="#10b981"
            fillOpacity="0.08"
            animate={{
              pathLength: [0, 1],
            }}
            transition={{
              duration: 12,
              delay: dot.delay,
              repeat: Infinity,
              ease: "linear",
            }}
            style={{ willChange: 'transform' }}
          >
            <motion.path
              d={dot.path}
              stroke="transparent"
              strokeWidth="0.1"
              fill="none"
            />
          </motion.circle>
        ))}

        {/* Faint market icons - limited to 3 for performance */}
        {marketIcons.slice(0, 3).map((icon) => (
          <motion.g
            key={icon.id}
            transform={`translate(${icon.x}, ${icon.y})`}
            animate={{
              opacity: [0.02, 0.06, 0.02],
              scale: [0.95, 1.05, 0.95],
            }}
            transition={{
              duration: 6,
              delay: icon.id * 0.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: 'transform, opacity' }}
          >
            {icon.type === 'box' && (
              <rect x="-3" y="-3" width="6" height="6" fill="#10b981" fillOpacity="0.04" rx="0.5" />
            )}
            {icon.type === 'crop' && (
              <circle cx="0" cy="0" r="3" fill="#10b981" fillOpacity="0.04" />
            )}
            {icon.type === 'market' && (
              <path d="M-3,-1 L0,-3 L3,-1 L3,2 L-3,2 Z" fill="#10b981" fillOpacity="0.04" />
            )}
            {icon.type === 'order' && (
              <rect x="-2" y="-2" width="4" height="4" fill="#10b981" fillOpacity="0.04" rx="1" />
            )}
            {icon.type === 'payment' && (
              <path d="M-2,0 L2,0 M0,-2 L0,2" stroke="#10b981" strokeWidth="0.5" fillOpacity="0.04" />
            )}
          </motion.g>
        ))}
      </svg>

      {/* Subtle grid pattern - larger cells for performance */}
      <div 
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(0deg, #10b981 1px, transparent 1px),
            linear-gradient(90deg, #10b981 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Accessibility: Screen reader announcement */}
      <span className="sr-only">Animated background with subtle market flow lines</span>
    </div>
  );
}
