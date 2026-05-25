"use client";

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import LanguageSelector from '@/components/shared/LanguageSelector';

import { User, LogOut, Sprout, Building2, ShieldCheck } from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';

import { useAuth } from '@/context/AuthContext';

export default function Navbar() {
  const { role, setRole, logout } = useAuth();
const { t } = useLanguage();
const router = useRouter();
// ... (isLoggedIn state and useEffect removed as we use AuthContext)
return ( <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
<div className="flex items-center gap-2">
<Link href="/" className="flex items-center gap-2">
<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
<span className="text-white font-bold text-xl">F</span>
</div>
<span className="text-2xl font-bold text-primary tracking-tight">One-to-One</span>
</Link>
</div>
<div className="hidden md:flex items-center gap-6 font-medium">
<Link href="/" className="hover:text-primary transition-colors">{t('nav.home')}
</Link> {/* Role Quick Switchers */}
<div className="flex items-center gap-2 bg-gray-50 p-1 rounded-2xl border border-gray-200">
<button onClick={() => { setRole('farmer'); router.push('/dashboard'); }} className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${role === 'farmer' ? 'bg-green-100 text-[#2E7D32] font-bold border border-[#2E7D32]/20' : 'hover:bg-gray-50 text-gray-500'}`} >
<Sprout className="w-4 h-4" /> {t('roles.farmer')}
</button>
<button onClick={() => { setRole('business'); router.push('/business'); }} className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${role === 'business' ? 'bg-blue-100 text-[#1565C0] font-bold border border-[#1565C0]/20' : 'hover:bg-gray-50 text-gray-500'}`} >
<Building2 className="w-4 h-4" /> {t('roles.business')}
</button>
<button onClick={() => { setRole('admin'); router.push('/admin'); }} className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 text-sm ${role === 'admin' ? 'bg-yellow-100 text-[#F9A825] font-bold border border-[#F9A825]/20' : 'hover:bg-gray-50 text-gray-500'}`} >
<ShieldCheck className="w-4 h-4" /> {t('roles.admin')}
</button>
</div>
</div>
<div className="flex items-center gap-4">
<LanguageSelector /> {role ? ( <div className="flex items-center gap-3">
<Link href="/profile" className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-xl text-primary font-bold hover:bg-primary/20 transition-all border border-primary/20">
<User className="w-5 h-5" />
<span>{t('nav.profile')}
</span>
</Link>
<button onClick={logout} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-all" title="Logout" >
<LogOut className="w-5 h-5" />
</button>
</div> ) : ( <Link href="/signin">
<button className="glass-button">{t('nav.signin')}
</button>
</Link> )}
</div>
</nav> ); } 