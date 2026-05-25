"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function AdminAnalyticsBackground() {
  // Check for reduced motion preference
  const shouldReduceMotion = useReducedMotion();
  
  // Memoize static elements to prevent re-renders
  const dataNodes = React.useMemo(() => [
    { id: 1, x: 15, y: 20, size: 3, delay: 0 },
    { id: 2, x: 35, y: 35, size: 4, delay: 0.5 },
    { id: 3, x: 55, y: 25, size: 2.5, delay: 1 },
    { id: 4, x: 75, y: 40, size: 3.5, delay: 1.5 },
    { id: 5, x: 25, y: 60, size: 3, delay: 2 },
    { id: 6, x: 45, y: 70, size: 2, delay: 2.5 },
    { id: 7, x: 65, y: 65, size: 4, delay: 3 },
    { id: 8, x: 85, y: 55, size: 2.5, delay: 3.5 },
  ], []);

  const chartLines = React.useMemo(() => [
    { id: 1, path: "M15,20 L35,35 L55,25 L75,40", delay: 0 },
    { id: 2, path: "M25,60 L45,70 L65,65 L85,55", delay: 1 },
    { id: 3, path: "M15,20 L25,60", delay: 2 },
    { id: 4, path: "M35,35 L45,70", delay: 2.5 },
    { id: 5, path: "M55,25 L65,65", delay: 3 },
    { id: 6, path: "M75,40 L85,55", delay: 3.5 },
  ], []);

  // Static render for reduced motion
  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true" style={{ willChange: 'transform' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-emerald-50 opacity-100" />
      
      {/* Grid pattern - larger cells for performance */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#94a3b8" strokeWidth="0.3" opacity="0.02"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
      </svg>

      {/* Analytics visualization */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="nodeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.06" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Chart connection lines - limited to 4 for performance */}
        {chartLines.slice(0, 4).map((line) => (
          <motion.path
            key={line.id}
            d={line.path}
            stroke="url(#lineGradient)"
            strokeWidth="0.6"
            fill="none"
            strokeDasharray="2,2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{ 
              duration: 3, 
              delay: line.delay,
              ease: "easeInOut"
            }}
            style={{ willChange: 'opacity' }}
          />
        ))}

        {/* Data nodes - limited to 6 for performance */}
        {dataNodes.slice(0, 6).map((node) => (
          <motion.g
            key={node.id}
            transform={`translate(${node.x}, ${node.y})`}
            animate={{
              opacity: [0.04, 0.08, 0.04],
              scale: [0.95, 1.08, 0.95],
            }}
            transition={{
              duration: 5,
              delay: node.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{ willChange: 'transform, opacity' }}
          >
            {/* Outer glow - slower animation */}
            <motion.circle
              r={node.size + 1}
              fill="url(#nodeGradient)"
              animate={{
                opacity: [0.02, 0.05, 0.02],
              }}
              transition={{
                duration: 4,
                delay: node.delay + 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Inner node */}
            <circle
              r={node.size}
              fill="url(#nodeGradient)"
            />
            {/* Core */}
            <circle
              r={node.size * 0.3}
              fill="#3b82f6"
              fillOpacity="0.12"
            />
          </motion.g>
        ))}

        {/* Subtle chart bars - simplified */}
        <motion.g transform="translate(10, 80)" style={{ willChange: 'transform' }}>
          {[1, 2, 3].map((bar, index) => (
            <motion.rect
              key={bar}
              x={index * 20}
              y={0}
              width="8"
              height={15 + index * 3}
              fill="#10b981"
              fillOpacity="0.03"
              rx="1"
              animate={{
                height: [15 + index * 3, 18 + index * 3, 15 + index * 3],
              }}
              transition={{
                duration: 4,
                delay: index * 0.3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </motion.g>

        {/* Subtle pie chart - simplified with slower animation */}
        <motion.g transform="translate(85, 15)" style={{ willChange: 'opacity' }}>
          <circle r="6" fill="none" stroke="#3b82f6" strokeWidth="0.5" strokeOpacity="0.03" />
          <motion.path
            d="M 0,0 L 0,-6 A 6,6 0 0,1 4.24,-4.24 Z"
            fill="#3b82f6"
            fillOpacity="0.03"
            animate={{
              opacity: [0.02, 0.05, 0.02],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.g>
      </svg>

      {/* Accessibility: Screen reader announcement */}
      <span className="sr-only">Animated background with subtle analytics grid and data nodes</span>
    </div>
  );
}
