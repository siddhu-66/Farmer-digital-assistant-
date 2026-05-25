"use client";
import Sidebar from "@/components/layout/Sidebar";
import React, { useState, useEffect } from 'react';
import { MapPin, Landmark, Droplets, TrendingUp, FileText, ShieldCheck, Edit2, Globe, Bell, Settings, User, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { farmerRegistrationService } from '@/services/farmerRegistrationService';
import SalesmanProfile from '@/components/profile/SalesmanProfile';
const AdminProfile = React.lazy(() => import('@/components/profile/AdminProfile')); type Language = 'en' | 'hi' | 'pa' | 'mr' | 'te'; export default function Profile() { const { role, logout, userName } = useAuth(); const [isEditing, setIsEditing] = useState(false); const { t, language, setLanguage } = useLanguage(); const [profile, setProfile] = useState<any>(null); const [loading, setLoading] = useState(true); useEffect(() => {
    if (role !== 'farmer') {
      setLoading(false);
      return;
    }
    farmerRegistrationService
      .getFarmerStatus()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [role]); const [pushEnabled, setPushEnabled] = useState(() => { if (typeof window !== 'undefined') return localStorage.getItem('pushNotif') !== 'false'; return true; }); const [smsEnabled, setSmsEnabled] = useState(() => { if (typeof window !== 'undefined') return localStorage.getItem('smsNotif') !== 'false'; return true; }); const togglePush = () => { const n = !pushEnabled; setPushEnabled(n); localStorage.setItem('pushNotif', String(n)); }; const toggleSms = () => { const n = !smsEnabled; setSmsEnabled(n); localStorage.setItem('smsNotif', String(n)); }; const languages: { code: Language; label: string }[] = [ { code: 'en', label: 'English' }, { code: 'hi', label: 'हिंदी' }, { code: 'pa', label: 'ਪੰਜਾਬੀ' }, { code: 'mr', label: 'मराठी' }, { code: 'te', label: 'తెలుగు' }, ]; if (loading) { return ( <div className="flex bg-[var(--theme-bg)] min-h-screen relative"> <Sidebar /> <main className="flex-1 main-content-shifted p-8 pt-10 flex items-center justify-center"> <div className="animate-pulse text-primary font-bold">Loading Profile...</div> </main> </div> ); } const contractor = profile?.contracts?.[0]?.salesman;
  const backHref = role === 'admin' ? '/admin' : role === 'business' ? '/business' : '/dashboard';

  return ( <div className="flex bg-[var(--theme-bg)] min-h-screen relative font-inter"> <Sidebar /> <main className="flex-1 main-content-shifted p-8 pt-10"> <header className="mb-10 flex justify-between items-end"> <div className="flex items-center gap-6"> 
    <div className="w-24 h-24 bg-primary text-gray-500 flex items-center justify-center text-4xl font-bold rounded-3xl shadow-2xl shadow-primary/30"> {role === 'admin' ? 'AD' : (role === 'business' || role === 'salesman') ? (userName?.substring(0, 2).toUpperCase() || 'SM') : (profile?.name?.substring(0, 2).toUpperCase() || 'RS')}
    </div> <div> 
      <div className="flex items-center gap-3 mb-1">
        <Link href={backHref} className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-900 transition-colors" title="Back to Dashboard">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-4xl font-black"> {role === 'admin' ? t('profile.roles.adminTitle') : (role === 'business' || role === 'salesman') ? (userName || 'Sales Representative') : (profile?.name || 'Ram Singh')}
        </h1> 
      </div>
      <p className="text-gray-500 flex items-center gap-2"> <MapPin className="w-4 h-4" /> {role === 'admin' ? t('profile.roles.adminLocation') : (role === 'business' || role === 'salesman') ? 'Global Operations Center' : (profile?.location || t('data.location'))} • {t('profile.id')}: {role === 'admin' ? '#A-001' : (role === 'business' || role === 'salesman') ? '#S-5042' : (profile?.id?.substring(0, 8) || '#F-90231')}
      </p> </div> </div> <button onClick={() => setIsEditing(true)} className="glass-button flex items-center gap-2 active:scale-95" > <Edit2 className="w-4 h-4" /> {t('profile.editBtn')}
</button> </header> {/* Edit Profile Modal */} {isEditing && ( <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pb-20"> <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsEditing(false)}></div> <div className="glass-card p-8 max-w-lg w-full relative z-10 animate-in fade-in zoom-in duration-300"> <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gradient"> <Edit2 className="w-6 h-6 text-primary" /> {t('profile.editModal.title')}
</h2> <div className="space-y-4"> <div className="grid grid-cols-2 gap-4"> <div className="space-y-2"> <label htmlFor="edit-fullname" className="text-xs font-bold text-gray-500 uppercase">{t('profile.editModal.name')}
</label> <input id="edit-fullname" type="text" defaultValue={role === 'admin' ? t('profile.roles.adminTitle') : (role === 'business' || role === 'salesman') ? (userName || 'Sales Representative') : (profile?.name || 'Ram Singh')} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none" /> </div> <div className="space-y-2"> <label htmlFor="edit-phone" className="text-xs font-bold text-gray-500 uppercase">{t('profile.editModal.phone')}
</label> <input id="edit-phone" type="text" defaultValue={role === 'salesman' ? '+1 800 555 4321' : (profile?.phone || "+91 98765 43210")} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none" /> </div> </div> <div className="space-y-2"> <label htmlFor="edit-location" className="text-xs font-bold text-gray-500 uppercase">{t('profile.editModal.location')}
</label> <input id="edit-location" type="text" defaultValue={role === 'admin' ? t('profile.roles.adminLocation') : (role === 'business' || role === 'salesman') ? 'Global Operations Center' : (profile?.location || t('data.location'))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary outline-none" /> </div> </div> <div className="flex gap-4 mt-8"> <button onClick={() => setIsEditing(false)} className="flex-1 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all font-bold"> {t('profile.editModal.cancel')}
</button> <button onClick={() => { alert("Changes saved successfully!"); setIsEditing(false); }} className="flex-1 py-3 px-4 glass-button font-bold"> {t('profile.editModal.save')}
</button> </div> </div> </div> )} {(role === 'business' || role === 'salesman') ? ( <SalesmanProfile /> ) : role === 'admin' ? ( <AdminProfile /> ) : ( <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> <div className="lg:col-span-2 space-y-8"> <div className="glass-card p-8"> <h2 className="text-2xl font-bold mb-8 flex items-center gap-3"> <Landmark className="w-6 h-6 text-primary" /> {t('profile.resources.title')}
</h2> <div className="grid md:grid-cols-2 gap-10"> <div className="space-y-6"> <div> <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">{t('profile.resources.holding')}
</p> <p className="text-2xl font-bold">{profile?.landSize || 12.5} {t('data.acres')}
</p> </div> <div> <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">{t('profile.resources.soilType')}
</p> <p className="text-2xl font-bold">{profile?.soilType || t('profile.resources.soilVal')}
</p> </div> <div> <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">{t('profile.resources.water')}
</p> <div className="flex items-center gap-2"> <Droplets className="w-5 h-5 text-primary" /> <p className="text-2xl font-bold">{t('profile.resources.borewell')}
</p> <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-lg uppercase">{t('profile.resources.functional')}
</span> </div> </div> </div> <div className="space-y-6"> <div> <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">{t('profile.resources.location')}
</p> <p className="text-xl font-bold">{profile?.location || t('data.location')}
</p> </div> <div> <p className="text-sm text-gray-500 uppercase font-bold tracking-wider mb-2">{t('profile.resources.profit')}
</p> <div className="flex items-center gap-2"> <TrendingUp className="w-6 h-6 text-primary" /> <p className="text-2xl font-bold">{`₹2.45 ${t('data.lakhs')}`}
</p> </div> </div> </div> </div> </div> <div className="glass-card p-8"> <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"> <ShieldCheck className="w-6 h-6 text-primary" /> {t('profile.documents.title')}
</h2> <div className="space-y-4"> {[ { nameKey: 'profile.documents.aadhar', statusKey: 'profile.documents.verified', date: 'Jan 10, 2026' }, { nameKey: 'profile.documents.land', statusKey: 'profile.documents.verified', date: 'Jan 12, 2026' }, { nameKey: 'profile.documents.bank', statusKey: 'profile.documents.pending', date: 'Feb 05, 2026' }, ].map((doc, i) => ( <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200"> <div className="flex items-center gap-4"> <FileText className="w-6 h-6 text-gray-500" /> <div> <p className="font-bold">{t(doc.nameKey)}
</p> <p className="text-sm text-gray-500">{t('profile.documents.updated')} {doc.date}
</p> </div> </div> <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${doc.statusKey.includes('verified') ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-400'}`}> {t(doc.statusKey)}
</span> </div> ))}
</div> </div> </div> <div className="space-y-8"> {/* Assigned Contractor Section */} {contractor && ( <div className="glass-card p-6 bg-accent/5 border-accent/20"> <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-accent"> <User className="w-5 h-5" /> Assigned Contractor </h3> <div className="p-4 bg-accent/10 rounded-2xl border border-accent/20 mb-6"> <p className="text-xs text-accent font-bold uppercase tracking-widest mb-1">Representative</p> <p className="text-lg font-bold">{contractor.name}
</p> </div> <div className="space-y-4"> <div className="justify-between flex text-sm"> <span className="text-gray-500">Company</span> <span className="font-medium">{contractor.company || "Independent"}
</span> </div> <div className="justify-between flex text-sm"> <span className="text-gray-500">Region</span> <span className="text-accent font-bold">{contractor.region || "Local"}
</span> </div> <div className="justify-between flex text-sm"> <span className="text-gray-500">Contact</span> <span className="font-mono">{contractor.phone || "---"}
</span> </div> </div> </div> )}
<div className="glass-card p-6 bg-primary/5 border-primary/20"> <h3 className="text-xl font-bold mb-4">{t('profile.membership.title')}
</h3> <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 mb-6"> <p className="text-xs text-primary font-bold uppercase tracking-widest mb-1">{t('profile.membership.partner')}
</p> <p className="text-lg font-bold">{`${(profile?.location || t('data.location')).split(',')[0]} Grain Cooperatives`}
</p> </div> <div className="space-y-4"> <div className="justify-between flex text-sm"> <span className="text-gray-500">{t('profile.membership.since')}
</span> <span className="font-medium">2022</span> </div> <div className="justify-between flex text-sm"> <span className="text-gray-500">{t('profile.membership.points')}
</span> <span className="text-primary font-bold font-mono">2,450 XP</span> </div> </div> </div> <div className="glass-card p-6"> <h3 className="text-xl font-bold mb-5 flex items-center gap-2"> <Settings className="w-5 h-5 text-primary" /> {t('profile.settings.title')}
</h3> <div className="space-y-4"> <div> <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-2"> <Bell className="w-3.5 h-3.5" /> {t('profile.settings.notifications')}
</p> <div className="space-y-2"> <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"> <span className="text-sm font-medium">{t('profile.settings.push')}
</span> <label className="relative flex items-center cursor-pointer"> <input type="checkbox" className="sr-only" checked={pushEnabled} onChange={togglePush} title={t('profile.settings.push')} /> <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${pushEnabled ? 'bg-primary' : 'bg-gray-50'}`}> <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${pushEnabled ? 'translate-x-5' : 'translate-x-0'}`} /> </div> </label> </div> <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"> <span className="text-sm font-medium">{t('profile.settings.sms')}
</span> <label className="relative flex items-center cursor-pointer"> <input type="checkbox" className="sr-only" checked={smsEnabled} onChange={toggleSms} title={t('profile.settings.sms')} /> <div className={`w-10 h-5 rounded-full transition-colors duration-300 ${smsEnabled ? 'bg-primary' : 'bg-gray-50'}`}> <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-300 ${smsEnabled ? 'translate-x-5' : 'translate-x-0'}`} /> </div> </label> </div> </div> </div> <div> <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-3 flex items-center gap-2"> <Globe className="w-3.5 h-3.5" /> {t('profile.settings.language')}
</p> <select value={language} onChange={(e) => setLanguage(e.target.value as Language)} title={t('profile.settings.language')} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 focus:outline-none focus:border-primary/60 transition-colors cursor-pointer" > {languages.map((lang) => ( <option key={lang.code} value={lang.code} className="bg-gray-900 text-gray-500"> {lang.label}
</option> ))}
</select> </div> <button onClick={logout} className="w-full text-left p-4 bg-red-500/10 text-red-400 rounded-xl text-sm hover:bg-red-500/20 transition-all font-bold"> {t('profile.settings.signout')}
</button> </div> </div> </div> </div> )}
</main> </div> );
}
