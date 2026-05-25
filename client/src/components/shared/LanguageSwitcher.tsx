import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/AuthContext';

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const { i18n } = useTranslation();
  const { userId } = useAuth();
  
  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिंदी' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'mr', label: 'मराठी' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'gu', label: 'ગુજરાતી' },
  ];

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const langCode = e.target.value as any;
    setLanguage(langCode);
    i18n.changeLanguage(langCode);
    
    // In a real app, silently update preferred language on the backend
    if (userId) {
      try {
        await fetch('/api/user/preference', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId, preferredLanguage: langCode })
        });
      } catch (err) {
        console.error("Failed to sync language preference", err);
      }
    }
  };

  return (
    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-xl border border-white/20 hover:bg-white/20 transition-all">
      <Globe className="w-4 h-4 text-white" />
      <select
        value={language}
        onChange={handleLanguageChange}
        className="bg-transparent text-white text-sm font-medium outline-none cursor-pointer appearance-none"
        title="Select Language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code} className="bg-gray-800 text-white">
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  );
};
