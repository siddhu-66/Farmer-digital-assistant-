"use client";

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { roleConfig, defaultBranding, RoleType } from '@/config/roleConfig';
import { RefreshCw } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface DashboardHeaderProps {
  onRefresh?: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export default function DashboardHeader({ onRefresh, loading, children }: DashboardHeaderProps) {
  const { role, logout } = useAuth();
  const pathname = usePathname();
  const [storedRole, setStoredRole] = useState<RoleType | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const saved = localStorage.getItem('app_role') as RoleType | null;
    if (saved === 'farmer' || saved === 'business' || saved === 'salesman' || saved === 'admin') {
      setStoredRole(saved);
    }
  }, []);

  const resolvedRole: RoleType | null =
    (role as RoleType) ||
    storedRole ||
    (pathname?.startsWith('/admin') ? 'admin' : null) ||
    (pathname?.startsWith('/dashboard') ? 'farmer' : null);

  const branding = (resolvedRole ? roleConfig[resolvedRole] : null) || defaultBranding;

  const getGradient = () => {
    switch (branding.themeColor) {
      case 'primary': return 'from-green-600 to-emerald-600';
      case 'blue': return 'from-blue-600 to-indigo-600';
      case 'accent': return 'from-purple-600 to-pink-600';
      default: return 'from-gray-600 to-slate-600';
    }
  };

  return (
    <header className="flex justify-between items-end mb-10 overflow-hidden">
      <div className="animate-in fade-in slide-in-from-left-4 duration-700">
        <h1 className={`text-5xl font-black mb-3 tracking-tighter italic bg-clip-text text-transparent bg-gradient-to-r ${getGradient()}`}>
          {branding.title}
        </h1>
        <p className="text-gray-400 font-bold text-lg max-w-2xl leading-snug mb-2">
          {branding.subtitle}
        </p>
        <p className={`text-[10px] font-black uppercase tracking-[0.3em] opacity-80 ${branding.themeColor === 'blue' ? 'text-blue-600' : branding.themeColor === 'primary' ? 'text-green-600' : 'text-gray-500'}`}>
          {branding.badgeText}
        </p>
      </div>

      <div className="flex gap-4 items-center">
        {onRefresh && (
          <button 
            onClick={onRefresh} 
            className={`glass-card p-4 hover:bg-white/5 transition-all group ${branding.themeColor === 'blue' ? 'border-blue-500/20' : 'border-primary/20'}`}
            title="Refresh System"
            type="button"
          >
            <RefreshCw className={`w-5 h-5 ${branding.themeColor === 'blue' ? 'text-blue-600' : branding.themeColor === 'primary' ? 'text-green-600' : 'text-gray-400'} ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
          </button>
        )}
        
        {children}

        <button 
          onClick={logout} 
          className="px-8 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-black uppercase tracking-widest text-[10px] rounded-2xl transition-all active:scale-95"
        >
          Terminate Session
        </button>
      </div>
    </header>
  );
}
