'use client';

import React from 'react';

import { Menu, Sprout } from 'lucide-react';

import Link from 'next/link';

import { useLanguage } from '@/context/LanguageContext';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';

export default function MobileHeader() {
  useLanguage();
const toggleSidebar = () => {
  // Dispatch a custom event that Sidebar will listen to 
  window.dispatchEvent(new CustomEvent('toggle-sidebar')); };
return ( <header className="mobile-only fixed top-0 left-0 right-0 z-[60] glass-card m-3 px-4 py-3 flex items-center justify-between border-primary/20 bg-white/90 backdrop-blur-xl shadow-xl shadow-primary/5">
<Link href="/" className="flex items-center gap-3">
<div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
<Sprout className="w-5 h-5 text-white" />
</div>
<div className="flex flex-col">
<span className="font-black text-sm tracking-tighter text-gray-900 leading-none">One-to-One</span>
<span className="text-[9px] font-bold uppercase tracking-widest text-primary mt-0.5">Digital Portal</span>
</div>
</Link>
<div className="flex items-center gap-2">
  <LanguageSwitcher />
  <button onClick={toggleSidebar} className="p-2.5 hover:bg-gray-50 rounded-xl transition-all active:scale-95 text-primary border border-primary/10" aria-label="Toggle Menu" >
    <Menu className="w-6 h-6" />
  </button>
</div>
</header> );
}
