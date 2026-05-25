"use client";

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function BackgroundMesh() {
  const pathname = usePathname();
  const [isClicked, setIsClicked] = useState(false);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--click-x', e.clientX.toString());
      document.documentElement.style.setProperty('--click-y', e.clientY.toString());
      setIsClicked(true);
      setTimeout(() => setIsClicked(false), 500);
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const getColors = () => {
    if (pathname?.startsWith('/business')) return ['bg-blue-200', 'bg-blue-100'];
    if (pathname?.startsWith('/admin')) return ['bg-yellow-200', 'bg-yellow-100'];
    return ['bg-green-200', 'bg-green-100'];
  };
  
  const colors = getColors();

  return (
    <div className="fixed inset-0 -z-50 overflow-hidden pointer-events-none bg-white">
      {isClicked && (
        <div className="absolute w-20 h-20 rounded-full bg-gray-100 blur-3xl animate-ping transition-opacity duration-500 click-ripple" />
      )}
<div className={`absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-[0.08] animate-blob1 transition-colors duration-1000 ${colors[0]}`} />
      <div className={`absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[140px] opacity-[0.06] animate-blob2 transition-colors duration-1000 ${colors[1]}`} />
      <div className={`absolute top-[30%] right-[20%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-[0.04] animate-blob3 ${colors[0]}`} />
      <div className="absolute inset-0 bg-white/60 backdrop-blur-[100px]" />
    </div>
  );
}
