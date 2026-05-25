"use client";

import { Globe, ChevronDown } from 'lucide-react';

import { useState } from 'react';

import { useLanguage, Language } from '@/context/LanguageContext';
const languages = [ { code: 'en', name: 'English' }, { code: 'hi', name: 'हिन्दी (Hindi)' }, { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' }, { code: 'mr', name: 'मराठी (Marathi)' }, { code: 'te', name: 'తెలుగు (Telugu)' }, ] as const;
export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
const { language, setLanguage } = useLanguage();
const selected = languages.find(l => l.code === language) || languages[0];
return ( <div className="relative">
<button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium" >
<Globe className="w-4 h-4 text-primary" />
<span>{selected.name}
</span>
<ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
</button> {isOpen && ( <div className="absolute top-full right-0 mt-2 w-48 glass-card p-2 z-[100] shadow-2xl"> {languages.map((lang) => ( <button key={lang.code} onClick={() => { setLanguage(lang.code as Language); setIsOpen(false); }} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${ selected.code === lang.code ? 'bg-primary text-gray-500' : 'hover:bg-gray-50' }`} > {lang.name}
</button> ))}
</div> )}
</div> ); } 