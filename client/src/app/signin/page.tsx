"use client";

import Link from 'next/link';

import { useRouter, useSearchParams } from 'next/navigation';

import React, { useState, Suspense } from 'react';

import { ArrowRight, Mail, Phone, Lock, LogIn, AlertCircle, ArrowLeft, Sprout, ShieldCheck, Users, Loader2 } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

import { useAuth } from '@/context/AuthContext';
import { apiClient } from '@/lib/apiClient';

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuth();
  const { t } = useLanguage();
const [identifier, setIdentifier] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');
const roleParam = searchParams?.get('role');
const [role, setRole] = useState<'farmer' | 'salesman' | 'admin'>( (roleParam === 'farmer' || roleParam === 'salesman' || roleParam === 'admin') ? roleParam : 'farmer' );
const [loading, setLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password === 'testbypass') {
      const roleToUse = role;
      const mockToken = `testbypass-${roleToUse}-${Date.now()}`;
      const mockUser = {
        id: `${roleToUse}-dev-user`,
        name: roleToUse === 'admin' ? 'Admin Test User' : roleToUse === 'salesman' ? 'Salesman Test User' : 'Farmer Test User',
        role: roleToUse,
        status: 'approved',
        verified: true,
      };
      setAuth(mockUser.role, mockToken, mockUser.id, mockUser.name, mockUser.status as 'pending' | 'approved' | 'rejected', mockUser.verified);
      if (mockUser.role === 'admin') router.push('/admin/dashboard');
      else if (mockUser.role === 'salesman') router.push('/sales/dashboard');
      else router.push('/farmer/dashboard');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.post<{
        success?: boolean;
        token?: string;
        user?: { id: string; name: string; role: string; status: string; verified: boolean };
        message?: string;
      }>('/auth/login', {
        ...(identifier.includes('@')
          ? { email: identifier.trim().toLowerCase() }
          : { identifier: identifier.trim() }),
        password,
      });

      if (response.success !== false && response.user && response.token) {
        setAuth(
          response.user.role as 'farmer' | 'business' | 'salesman' | 'admin',
          response.token,
          response.user.id,
          response.user.name,
          response.user.status as 'pending' | 'approved' | 'rejected',
          response.user.verified
        );
        
        // Handle pending status
        if (response.user.status === 'pending') {
          if (response.user.role === 'admin') {
            setError('Your admin account is pending approval by a Super Admin. Please wait.');
            return;
          }
        }

        if (response.user.status === 'rejected') {
           setError('Your account application was rejected. Please contact support.');
           return;
        }

        switch (response.user.role) {
          case 'admin':
            router.push('/admin/dashboard');
            break;
          case 'farmer':
            router.push('/farmer/dashboard');
            break;
          case 'salesman':
            router.push('/sales/dashboard');
            break;
          case 'business':
            router.push('/sales/dashboard');
            break;
          default:
            router.push('/farmer/dashboard');
        }
      } else {
        setError((response as { message?: string }).message || 'Invalid credentials.');
      }
    } catch (err) {
      console.error(`[Frontend] Login Error:`, err);
      setError('Connection refused. Please ensure the backend is running.');
    } finally {
      setLoading(false);
    }
  };
const getRoleIcon = () => { switch(role) { case 'farmer': return <Sprout className="w-8 h-8 text-secondary" />; case 'salesman': return <Users className="w-8 h-8 text-orange-400" />; case 'admin': return <ShieldCheck className="w-8 h-8 text-primary" />; default: return <LogIn className="w-8 h-8 text-primary" />; } };
return ( <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--theme-bg)] text-gray-500">
<div className="w-full max-w-md mb-4 flex justify-start">
<Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-500 transition-colors">
<ArrowLeft className="w-4 h-4" /> {t('signIn.backToHome')}
</Link>
</div>
<div className="glass-card p-10 max-w-md w-full space-y-8 relative overflow-hidden"> {/* Background glow decoration */}
<div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full">
</div>
<div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-accent/10 blur-3xl rounded-full">
</div>
<div className="text-center relative z-10">
<div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-3xl mb-6 shadow-2xl border border-gray-200 animate-float"> {getRoleIcon()}
</div>
<h1 className="text-3xl font-bold text-gradient mb-2"> {role === 'admin' ? t('signIn.admin.title') : role === 'salesman' ? t('signIn.salesman.title') : t('signIn.farmer.title')}
</h1>
<p className="text-gray-500"> {role === 'admin' ? t('signIn.admin.subtitle') : role === 'salesman' ? t('signIn.salesman.subtitle') : t('signIn.farmer.subtitle')}
</p>
</div> {error && ( <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-start gap-3 animate-shake">
<AlertCircle className="w-5 h-5 shrink-0" />
<p className="text-sm font-medium">{error}
</p>
</div> )}
<form className="space-y-6 relative z-10" onSubmit={handleSignIn}>
<div className="grid grid-cols-3 gap-3 mb-6"> {[ { id: 'farmer', label: t('roles.farmer') }, { id: 'salesman', label: t('roles.salesman') }, { id: 'admin', label: t('roles.admin') } ].map((r) => ( <button key={r.id} type="button" onClick={() => setRole(r.id as 'farmer' | 'salesman' | 'admin')} className={`py-2 px-1 rounded-xl border text-[10px] sm:text-xs font-bold transition-all ${ role === r.id ? 'bg-primary border-primary text-gray-500 shadow-lg shadow-primary/20' : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-50' }`} > {r.label}
</button> ))}
</div>
<div className="space-y-4">
<div className="space-y-2">
<label className="text-sm font-medium text-gray-500 ml-1">{t('signIn.emailPhone')}
</label>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<div className="flex items-center gap-1 text-gray-500 group-focus-within:text-primary transition-colors">
<Mail className="w-4 h-4" />
<span className="text-xs">/</span>
<Phone className="w-4 h-4" />
</div>
</div>
<input type="text" required value={identifier} onChange={(e) => setIdentifier(e.target.value)} placeholder={role === 'farmer' ? 'admin@customer.com or 9876543210' : role === 'salesman' ? 'salesman@company.com' : 'admin_id_001'} className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-14 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-gray-500" />
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between items-center ml-1">
<label className="text-sm font-medium text-gray-500">{t('signIn.password')}
</label>
<Link href="/forgot-password" id="forgot-password-link" className="text-xs text-primary hover:text-primary-light transition-colors">{t('signIn.forgotPassword')}
</Link>
</div>
<div className="relative group">
<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
<Lock className="w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
</div>
<input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password123" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-gray-500" />
</div>
</div>
</div>
<div className="flex items-center ml-1">
<input id="remember-me" type="checkbox" className="w-4 h-4 bg-gray-50 border-gray-200 rounded text-primary focus:ring-primary/50" />
<label htmlFor="remember-me" className="ml-2 text-sm text-gray-500">{t('signIn.rememberMe')}
</label>
</div>
<button disabled={loading} className="glass-button w-full py-4 text-lg flex items-center justify-center gap-2 group disabled:opacity-60 disabled:cursor-not-allowed">
{loading ? (
  <><Loader2 className="w-5 h-5 animate-spin" /> Authenticating...</>
) : (
  <>{t('signIn.submit')} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
)}
</button>
<p className="text-xs text-gray-500 text-center">Dev bypass: use password <span className="font-bold">testbypass</span> to open selected portal.</p>
</form>
<div className="text-center relative z-10 pt-4">
<p className="text-sm text-gray-500"> {t('signIn.noAccount')}{' '}
<Link href="/register" className="text-primary hover:text-primary-light font-bold transition-colors">{t('signIn.createAccount')}
</Link>
</p>
</div>
</div>
</div> ); }
export default function SignIn() {
  return ( <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500">Loading...</div>}>
<SignInContent />
</Suspense> ); } 