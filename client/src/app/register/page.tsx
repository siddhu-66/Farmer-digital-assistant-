"use client";

import React, {  Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sprout, Users, ShieldCheck, 
  ArrowLeft, ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Import specialized forms
import FarmerRegistrationForm from '@/components/forms/FarmerRegistrationForm';
import AdminRegistrationForm from '@/components/forms/AdminRegistrationForm';
import SalesmanRegistrationForm from '@/components/forms/SalesmanRegistrationForm';

function RegisterContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { t } = useLanguage();
  const roleParam = searchParams?.get('role');
  
  // Set role based on URL param
  const activeRole = (roleParam === 'farmer' || roleParam === 'business' || roleParam === 'admin' || roleParam === 'salesman') 
    ? roleParam : null;

  const roles = [
    {
      id: 'farmer',
      title: t('roles.farmer'),
      subtitle: t('signIn.farmer.subtitle'),
      icon: <Sprout className="w-8 h-8 text-secondary" />,
      color: 'secondary',
      border: 'border-secondary/20',
      bg: 'hover:bg-secondary/5'
    },
    {
      id: 'salesman',
      title: t('roles.salesman'),
      subtitle: t('signIn.salesman.subtitle'),
      icon: <Users className="w-8 h-8 text-orange-400" />,
      color: 'orange-400',
      border: 'border-orange-500/20',
      bg: 'hover:bg-orange-500/5'
    },
    {
      id: 'admin',
      title: t('roles.admin'),
      subtitle: t('signIn.admin.subtitle'),
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      color: 'primary',
      border: 'border-primary/20',
      bg: 'hover:bg-primary/5'
    }
  ];

  if (!activeRole) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 animate-in fade-in duration-700">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-black mb-6 tracking-tighter text-gray-800">
            Choose Your <span className="text-primary italic">Digital Identity</span>
          </h1>
          <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">
            Select the role that defines your journey in our one-to-one ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {roles.map((r) => (
            <button
              key={r.id}
              onClick={() => router.push(`/register?role=${r.id}`)}
              className={`glass-card p-10 flex flex-col items-center text-center group transition-all duration-500 hover:-translate-y-2 ${r.border} ${r.bg}`}
            >
              <div 
                className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-8 shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 role-${r.id}-bg-light`} 
              >
                {r.icon}
              </div>
              <h3 className="text-2xl font-black mb-3 text-gray-800">{r.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-8">{r.subtitle}</p>
              <div className="mt-auto w-full group-hover:px-4 transition-all">
                <div className="py-3 rounded-2xl bg-gray-50 flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 group-hover:bg-primary group-hover:text-black transition-all">
                  Join Now <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-20 text-center">
          <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">
            Already registered? <Link href="/signin" className="text-primary hover:underline ml-2">Sign In Instead</Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 animate-in slide-in-from-bottom-5 duration-500">
      <div className="mb-10 flex justify-between items-center">
        <button 
          onClick={() => router.push('/register')} 
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Role Selection
        </button>
        <div className="px-4 py-1.5 bg-gray-100 rounded-full text-[10px] font-black text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary" /> Enrollment active
        </div>
      </div>

      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black mb-3 text-gray-800 italic">
          {activeRole === 'farmer' ? 'Customer Onboarding' : 
           activeRole === 'admin' ? 'Administrative Access' : 'Salesman (Trader / Buyer) Registration'}
        </h1>
        <p className="text-gray-500">Complete the 5-step verification to join the network.</p>
      </div>

      {activeRole === 'farmer' && <FarmerRegistrationForm />}
      {activeRole === 'admin' && <AdminRegistrationForm />}
      {activeRole === 'salesman' && <SalesmanRegistrationForm />}
    </div>
  );
}

export default function Register() {
  return (
    <div className="min-h-screen bg-[var(--theme-bg)]">
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center flex-col gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Synchronizing Identity Hub...</p>
        </div>
      }>
        <RegisterContent />
      </Suspense>
    </div>
  );
}