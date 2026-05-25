"use client";

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function FarmerPaddyBackground() {
  // Check for reduced motion preference
  const shouldReduceMotion = useReducedMotion();
  
  // Memoize static elements to prevent re-renders
  const paddyStalks = React.useMemo(() => [
    { id: 1, left: '10%', height: '120px', delay: 0 },
    { id: 2, left: '25%', height: '150px', delay: 0.5 },
    { id: 3, left: '40%', height: '100px', delay: 1 },
    { id: 4, left: '60%', height: '130px', delay: 1.5 },
    { id: 5, left: '75%', height: '110px', delay: 2 },
    { id: 6, left: '90%', height: '140px', delay: 2.5 },
  ], []);

  const particles = React.useMemo(() => [
    { id: 1, startX: '15%', startY: '20%', delay: 0 },
    { id: 2, startX: '35%', startY: '40%', delay: 2 },
    { id: 3, startX: '55%', startY: '30%', delay: 4 },
    { id: 4, startX: '75%', startY: '50%', delay: 6 },
    { id: 5, startX: '85%', startY: '25%', delay: 8 },
    { id: 6, startX: '45%', startY: '60%', delay: 10 },
  ], []);

  // Static render for reduced motion
  if (shouldReduceMotion) {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true" style={{ willChange: 'transform' }}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-white to-emerald-50 opacity-100" />
      
      {/* Paddy stalks */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="paddyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#86efac" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.04" />
          </linearGradient>
        </defs>
        
        {paddyStalks.map((stalk) => (
          <motion.g 
            key={stalk.id}
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, 1.5, 0, -0.8, 0] }}
            transition={{
              duration: 10,
              delay: stalk.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              transformOrigin: `${parseInt(stalk.left) + 1}% ${100 - parseInt(stalk.height) / 2}%`,
              willChange: 'transform',
            }}
          >
            <motion.path
              d={`M${parseInt(stalk.left)} 100 Q${parseInt(stalk.left) + 2} ${50 - parseInt(stalk.height) / 2} ${parseInt(stalk.left) + 1} ${100 - parseInt(stalk.height)}`}
              fill="url(#paddyGradient)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 2, 
                delay: stalk.delay,
                ease: "easeInOut"
              }}
            />
            <motion.path
              d={`M${parseInt(stalk.left) + 1} ${100 - parseInt(stalk.height)} Q${parseInt(stalk.left) + 3} ${50 - parseInt(stalk.height) / 2 - 10} ${parseInt(stalk.left) + 2} ${100 - parseInt(stalk.height) - 20}`}
              fill="url(#paddyGradient)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ 
                duration: 2, 
                delay: stalk.delay + 0.2,
                ease: "easeInOut"
              }}
            />
          </motion.g>
        ))}
      </svg>

      {/* Floating particles - limited to 4 for performance */}
      {particles.slice(0, 4).map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-green-400 rounded-full pointer-events-none"
          style={{
            left: particle.startX,
            top: particle.startY,
            opacity: 0.05,
            willChange: 'transform, opacity',
          }}
          animate={{
            x: [0, 15, -8, 12, 0],
            y: [0, -25, -50, -35, -70],
            opacity: [0.05, 0.07, 0.03, 0.05, 0],
          }}
          transition={{
            duration: 15,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Accessibility: Screen reader announcement */}
      <span className="sr-only">Animated background with subtle paddy field sway</span>
    </div>
  );
}
