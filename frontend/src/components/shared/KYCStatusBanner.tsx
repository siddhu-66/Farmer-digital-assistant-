import React, { useState } from 'react';
import { CheckCircle, Clock, XCircle, ShieldCheck, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface KYCStatusBannerProps {
  role: 'farmer' | 'business' | 'salesman';
}

export default function KYCStatusBanner({ role }: KYCStatusBannerProps) {
  const { status, verified, userName } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Persistence for dismissal
  const dismissKey = `kyc_banner_dismissed_${role}`;
  React.useEffect(() => {
    if (localStorage.getItem(dismissKey) === 'true') {
      setDismissed(true);
    }
  }, [dismissKey]);

  const handleDismiss = () => {
    setDismissed(true);
    // Only persist dismiss for approved/rejected (not pending – they should always see it)
    if (status === 'approved' || status === 'rejected') {
      localStorage.setItem(dismissKey, 'true');
    }
  };

  if (!status || dismissed) return null;

  // Approved
  if (status === 'approved') {
    return (
      <div className="mb-6 animate-in slide-in-from-top-2 duration-400 relative">
        <div className="flex items-start gap-4 p-5 bg-green-50 border border-green-300 rounded-2xl shadow-sm">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-black text-green-800 text-base flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> KYC Verified — Profile Approved!
            </p>
            <p className="text-sm text-green-700 mt-0.5">
              Congratulations <span className="font-bold">{userName || 'User'}</span>! Your{' '}
              {role === 'farmer' ? 'farmer' : role === 'salesman' ? 'salesman' : 'business'} profile has been{' '}
              <span className="font-bold">approved by the admin</span>. You now have full access to all platform features.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            title="Dismiss notification"
            aria-label="Dismiss notification"
            className="p-1 hover:bg-green-100 rounded-lg transition-colors text-green-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Rejected
  if (status === 'rejected') {
    return (
      <div className="mb-6 animate-in slide-in-from-top-2 duration-400">
        <div className="flex items-start gap-4 p-5 bg-red-50 border border-red-300 rounded-2xl shadow-sm">
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
            <XCircle className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-black text-red-800 text-base flex items-center gap-2">
              <XCircle className="w-4 h-4" /> KYC Rejected — Action Required
            </p>
            <p className="text-sm text-red-700 mt-0.5">
              Your profile verification was <span className="font-bold">rejected</span> by the admin.
            </p>
            <p className="text-xs text-red-600 mt-2">
              Please contact support or re-submit your registration with correct documents.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            title="Dismiss notification"
            aria-label="Dismiss notification"
            className="p-1 hover:bg-red-100 rounded-lg transition-colors text-red-600 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Pending (default)
  return (
    <div className="mb-6 animate-in slide-in-from-top-2 duration-400">
      <div className="flex items-start gap-4 p-5 bg-amber-50 border border-amber-300 rounded-2xl shadow-sm">
        <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
          <Clock className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-black text-amber-800 text-base flex items-center gap-2">
            <Clock className="w-4 h-4" /> KYC Verification Pending ⏳
          </p>
          <p className="text-sm text-amber-700 mt-0.5">
            Your profile is <span className="font-bold">under review</span> by the admin team. You will receive a confirmation once your identity is verified. This typically takes 24–48 hours.
          </p>
        </div>
      </div>
    </div>
  );
}
