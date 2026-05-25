"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Activity, Users, Server, AlertTriangle, Settings } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { apiClient } from '@/lib/apiClient';

export default function AdminProfile() {
  const { t } = useLanguage();
  const [liveStats, setLiveStats] = useState({
    activeUsers: '1,240',
    uptime: '99.9%',
    health: 'Optimal',
    errorRate: '0.01%',
    liveNodes: 142
  });

  useEffect(() => {
    // Subscribe to system updates for real-time admin metrics
    const unsubscribe = apiClient.subscribe('system_update', (_data) => {
      setLiveStats(prev => ({
        ...prev,
        liveNodes: Math.min(145, Math.max(130, prev.liveNodes + (Math.random() > 0.5 ? 1 : -1))),
        errorRate: (Math.random() * 0.05).toFixed(2) + '%'
      }));
    });
    return () => unsubscribe();
  }, []);

  const systemStats = [ 
    { label: t('profile.admin.activeUsers'), value: liveStats.activeUsers, icon: Users, color: 'text-primary' }, 
    { label: t('profile.admin.uptime'), value: liveStats.uptime, icon: Server, color: 'text-accent' }, 
    { label: t('profile.admin.health'), value: liveStats.health, icon: Activity, color: 'text-green-400' }, 
    { label: t('profile.admin.security'), value: 'Shielded', icon: Shield, color: 'text-secondary' }, 
  ];

  return ( 
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> 
        {systemStats.map((stat, i) => ( 
          <div key={i} className="glass-card p-6 flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-gray-50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{stat.label}</p>
              <p className="text-xl font-bold">{stat.value}</p>
            </div>
          </div> 
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card p-8">
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Settings className="w-6 h-6 text-primary" /> {t('profile.admin.oversight')}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                    <th className="pb-4 pt-2">Role Cluster</th>
                    <th className="pb-4 pt-2 text-center">Active Seats</th>
                    <th className="pb-4 pt-2 text-center">Avg Activity</th>
                    <th className="pb-4 pt-2 text-right">System Load</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium">
                  {[ 
                    { cluster: t('profile.admin.clusters.customer'), seats: '1,020', activity: 'High', load: '15%', trend: '+2%' }, 
                    { cluster: t('profile.admin.clusters.salesman'), seats: '180', activity: 'Moderate', load: '8%', trend: '+0.5%' }, 
                    { cluster: t('profile.admin.clusters.admin'), seats: '40', activity: 'Low', load: '1%', trend: 'Stable' }, 
                  ].map((row, i) => ( 
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                      <td className="py-4 font-black text-gray-800">{row.cluster}</td>
                      <td className="py-4 text-center font-bold">{row.seats}</td>
                      <td className="py-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${row.activity === 'High' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {row.activity.toUpperCase()}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-primary font-black">{row.load}</span>
                          <span className="text-[10px] text-gray-400">{row.trend}</span>
                        </div>
                      </td>
                    </tr> 
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="glass-card p-8 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-none shadow-2xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-xl font-black mb-1">Network Connectivity Index</h3>
                <p className="text-gray-400 text-xs">Real-time health of rural node synchronization</p>
              </div>
              <div className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-[10px] font-black border border-green-500/30 animate-pulse">
                LIVE NODES: {liveStats.liveNodes}/145
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'API Latency', value: '42ms', color: 'text-blue-400' },
                { label: 'DB Queries/s', value: '850', color: 'text-purple-400' },
                { label: 'Error Rate', value: liveStats.errorRate, color: 'text-green-400' },
                { label: 'Cache Hit', value: '94%', color: 'text-yellow-400' },
              ].map(stat => (
                <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className={`text-lg font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="glass-card p-8 bg-red-500/5 border-red-500/20">
            <h2 className="text-xl font-black mb-6 flex items-center gap-3 text-red-600">
              <AlertTriangle className="w-5 h-5" /> {t('profile.admin.criticalLogs')}
            </h2>
            <div className="space-y-4">
              <div className="p-4 bg-white border border-red-100 rounded-xl text-xs text-red-500 font-bold flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                No critical anomalies detected in current cycle.
              </div>
              <button className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all font-black text-xs uppercase tracking-widest active:scale-95 shadow-lg shadow-red-500/20"> 
                {t('profile.admin.viewAll')}
              </button>
            </div>
          </div>

          <div className="glass-card p-6 border-blue-500/20 bg-blue-50/30">
            <h3 className="font-black text-gray-800 mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-500" /> System Snapshot
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-bold uppercase tracking-widest">Version</span>
                <span className="font-black text-blue-600">v2.4.0-pro</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-500 font-bold uppercase tracking-widest">Storage</span>
                <span className="font-black text-blue-600">64% Used</span>
              </div>
              <div className="w-full bg-blue-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full w-[64%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div> 
  );
}
