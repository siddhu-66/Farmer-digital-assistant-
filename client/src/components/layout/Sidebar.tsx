"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {  usePathname } from 'next/navigation';
import { Sprout, Menu, X, LogOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getMenuItems } from '@/lib/navigation';

interface SidebarProps {
  forceRole?: string;
}

const getFallbackLabel = (labelKey: string): string => {
  const fallbacks: Record<string, string> = {
    'adminDashboard.sidebar.dashboard': 'Dashboard',
    'adminDashboard.sidebar.users': 'Users',
    'adminDashboard.sidebar.procurements': 'Procurements',
    'adminDashboard.sidebar.verifications': 'KYC Verifications',
    'adminDashboard.sidebar.sellRequests': 'Sell Requests',
    'adminDashboard.sidebar.orders': 'Orders',
    'adminDashboard.sidebar.logs': 'Logs',
    'businessDashboard.sidebar.orders': 'Orders',
    'businessDashboard.sidebar.post': 'Post Contract',
    'businessDashboard.sidebar.projections': 'Projections',
    'businessDashboard.sidebar.dispatch': 'Dispatch',
    'sidebar.dashboard': 'Dashboard',
    'sidebar.analytics': 'Analytics',
    'sidebar.crops': 'Crops',
    'sidebar.residue': 'Residue',
    'sidebar.weather': 'Weather',
    'sidebar.market': 'Market',
    'sidebar.profile': 'Profile',
    'sidebar.logout': 'Logout'
  };
  return fallbacks[labelKey] || labelKey;
};

export default function Sidebar({ forceRole }: SidebarProps) {
  const { role: authRole, logout } = useAuth();
  useLanguage();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  const role = forceRole || authRole;
  const menuItems = getMenuItems(role);

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', isCollapsed ? '96px' : '288px');
  }, [isCollapsed]);

  useEffect(() => {
    const handleToggle = () => setIsMobileOpen(prev => !prev);
    window.addEventListener('toggle-sidebar', handleToggle);
    return () => window.removeEventListener('toggle-sidebar', handleToggle);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  const getRoleTheme = () => {
    switch (role) {
      case 'admin': return { 
        primary: 'text-gray-100', 
        bg: 'bg-slate-800', 
        border: 'border-slate-600', 
        active: 'bg-green-600 text-white',
        hover: 'bg-slate-700 text-gray-100',
        indicator: 'bg-green-500'
      };
      case 'business':
      case 'salesman': return { 
        primary: 'text-gray-100', 
        bg: 'bg-slate-800', 
        border: 'border-slate-600', 
        active: 'bg-green-600 text-white',
        hover: 'bg-slate-700 text-gray-100',
        indicator: 'bg-green-500'
      };
      default: return { 
        primary: 'text-gray-700', 
        bg: 'bg-white', 
        border: 'border-gray-200', 
        active: 'bg-green-50 text-green-700 border-green-300',
        hover: 'bg-gray-50 text-gray-700',
        indicator: 'bg-green-500'
      };
    }
  };

  const theme = getRoleTheme();

  const SidebarContent = (
    <div className="h-full flex flex-col justify-between py-6">
      <div className="space-y-6">
        {/* Brand Logo Section */}
        <div className={`flex items-center gap-3 px-4 transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : ''}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${role === 'business' || role === 'salesman' ? 'bg-blue-600' : role === 'admin' ? 'bg-gray-800' : 'bg-primary'}`}>
            <Sprout className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col animate-in fade-in slide-in-from-left-2 duration-300">
              <span className={`font-black text-lg tracking-tighter ${role === 'admin' ? 'text-white' : 'text-gray-900'}`}>One-to-One</span>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${role === 'business' || role === 'salesman' ? 'bg-blue-400' : role === 'admin' ? 'bg-gray-400' : 'bg-primary'}`}></div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Portal</span>
              </div>
            </div>
          )}
        </div>

        {/* Menu Toggle (Desktop Only) */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)} 
          className={`desktop-only mx-4 p-2 rounded-xl transition-all hover:bg-gray-100 flex items-center gap-3 text-gray-400 hover:text-gray-900 ${isCollapsed ? 'justify-center mx-auto' : ''}`}
        >
          <Menu className="w-5 h-5" />
          {!isCollapsed && <span className="text-[10px] font-black uppercase tracking-[0.2em]">Navigation</span>}
        </button>

        {/* Navigation Items */}
        <div className="space-y-1.5 px-3">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link 
                key={idx} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden ${isCollapsed ? 'justify-center' : ''} ${isActive ? theme.active : theme.hover}`}
              >
                <Icon className={`w-5 h-5 shrink-0 group-hover:scale-110 transition-transform ${isActive ? theme.primary : ''}`} />
                {!isCollapsed && (
                  <span className="font-bold text-sm whitespace-nowrap animate-in fade-in slide-in-from-left-2 grow">
                    {getFallbackLabel(item.labelKey)}
                  </span>
                )}
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 rounded-r-full transition-all duration-300 ${theme.indicator}`}></div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
      
      {/* Footer / Logout */}
      <div className="px-3">
        <button 
          onClick={logout} 
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all group w-full ${isCollapsed ? 'justify-center' : ''}`}
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform shrink-0" />
          {!isCollapsed && <span className="font-black text-xs uppercase tracking-widest">Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className={`desktop-only h-screen fixed left-0 top-0 border-r backdrop-blur-2xl transition-all duration-500 ease-in-out z-40 ${isCollapsed ? 'w-24' : 'w-72'} ${theme.bg} ${theme.border}`}>
        {SidebarContent}
      </aside>

      <div className={`mobile-only fixed inset-0 z-[100] transition-opacity duration-500 ${isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}></div>
        <aside className={`absolute left-0 top-0 bottom-0 w-80 shadow-2xl transition-transform duration-500 ease-out border-r ${theme.bg} ${theme.border} ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <button title="Close sidebar" onClick={() => setIsMobileOpen(false)} className="absolute right-4 top-6 p-2 text-gray-400 hover:text-gray-900 bg-black/5 rounded-xl backdrop-blur-md">
            <X className="w-6 h-6" />
          </button>
          <div className="h-full pt-8 pb-4">
            {SidebarContent}
          </div>
        </aside>
      </div>
    </>
  );
}
