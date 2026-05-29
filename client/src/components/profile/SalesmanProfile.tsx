"use client";

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, FileText, BarChart3, CheckCircle2, Clock, User, MapPin, Building2, Briefcase, Phone, Mail, Star } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { salesmanService, SalesmanProfile as SalesmanProfileType } from '@/services/salesmanService';
import { useAuth } from '@/context/AuthContext';

export default function SalesmanProfile() {
  const { t, tObj } = useLanguage();
  const { userName, userId, user } = useAuth();
  const [profile, setProfile] = useState<SalesmanProfileType | null>(null);

  useEffect(() => {
    const stored = salesmanService.getSalesmanProfile();
    setProfile({
      name: user?.name || userName || stored?.name || '',
      id: user?.id || userId || stored?.id || '',
      company: stored?.company || '',
      region: stored?.region || '',
      territory: stored?.territory || '',
      experience: stored?.experience ?? 0,
      mobile: user?.mobile || stored?.mobile || '',
      email: user?.email || stored?.email || '',
    } as SalesmanProfileType);
  }, [userName, userId, user]);

  const stats = [
    { label: t('profile.salesman.purchases'), value: '450 Tons', icon: TrendingUp, color: 'text-primary' },
    { label: t('profile.salesman.fpos'), value: '12', icon: Users, color: 'text-accent' },
    { label: t('profile.salesman.pending'), value: '8', icon: FileText, color: 'text-secondary' },
    { label: t('profile.salesman.value'), value: '₹4.2 Cr', icon: BarChart3, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Salesman Identity Card */}
      {profile ? (
        <div className="glass-card p-8 border-blue-200">
          <div className="flex items-start gap-6 flex-wrap">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0">
              <User className="w-10 h-10 text-blue-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-2xl font-black text-gray-900">{profile.name}</h2>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-600 text-xs font-black rounded-full uppercase tracking-widest flex items-center gap-1">
                  <Star className="w-3 h-3" /> Verified Salesman
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                {profile.company && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-medium">{profile.company}</span>
                  </div>
                )}
                {profile.region && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-medium">{profile.region}</span>
                  </div>
                )}
                {profile.territory && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Briefcase className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-medium">Territory: {profile.territory}</span>
                  </div>
                )}
                {profile.experience && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-medium">{profile.experience} yrs experience</span>
                  </div>
                )}
                {profile.mobile && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-medium">{profile.mobile}</span>
                  </div>
                )}
                {profile.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-medium">{profile.email}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card p-8 text-center border-dashed border-2 border-blue-200">
          <User className="w-12 h-12 text-blue-300 mx-auto mb-3" />
          <p className="font-bold text-gray-700 mb-1">No profile registered yet</p>
          <p className="text-sm text-gray-500">Complete your salesman registration to display your details here.</p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <Users className="w-6 h-6 text-primary" /> {t('profile.salesman.activeFposTitle')}
          </h2>
          <div className="space-y-4">
            {(tObj<any[]>('profile.salesman.fpoData') || []).map((fpo, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
                <div>
                  <p className="font-bold">{fpo.name}</p>
                  <p className="text-sm text-gray-500">{fpo.type}</p>
                </div>
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-lg uppercase">
                  {fpo.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 border-blue-100 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black mb-6 flex items-center gap-3">
              <Clock className="w-6 h-6 text-blue-500" /> {t('profile.salesman.recentTitle')}
            </h2>
            <div className="space-y-4 text-sm">
              {(tObj<any[]>('profile.salesman.logs') || []).map((log, i) => (
                <div key={i} className="flex items-center gap-4 p-3 border-l-2 border-blue-200 bg-blue-50/30 rounded-r-xl">
                  <CheckCircle2 className="w-4 h-4 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-bold text-gray-800">{log.event}</p>
                    <p className="text-gray-500 text-[10px] uppercase tracking-wider font-black">{log.target}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Unique Content: Sales Velocity */}
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Sales Velocity Index</h3>
            <div className="flex items-end gap-1 h-12">
              {[40, 70, 45, 90, 65, 80, 100].map((val, idx) => (
                <div 
                  key={idx} 
                  className={`flex-1 bg-blue-500 rounded-t-sm opacity-20 hover:opacity-100 transition-opacity cursor-help h-${val}`} 
                  title={`Day ${idx+1}: ${val}% capacity`} 
                />
              ))}
            </div>
            <div className="flex justify-between mt-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase">Mon</span>
              <span className="text-[10px] font-bold text-blue-600 uppercase">Current Peak</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase">Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
