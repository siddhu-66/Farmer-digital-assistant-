"use client";

import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import AdminRegistrationForm from '@/components/forms/AdminRegistrationForm';

export default function AdminRegisterPage() {
  return (
    <div className="min-h-screen bg-gray-50/50 selection:bg-blue-500/20">
      {/* Navigation */}
      <div className="max-w-4xl mx-auto px-6 pt-12">
        <Link href="/register" className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-gray-400 hover:text-blue-600 transition-all group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          Back to Enrollment Types
        </Link>
      </div>

      <div className="py-12">
        <div className="text-center mb-12">
           <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-[2.5rem] mb-6 shadow-2xl shadow-blue-600/30">
              <ShieldCheck className="w-10 h-10 text-white" />
           </div>
           <h1 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 italic">Admin Professional Registration</h1>
           <p className="text-gray-500 max-w-lg mx-auto font-medium">
             Enrolling in the high-authority administrative layer. Requires physical verification and Super Admin clearance.
           </p>
        </div>

        <AdminRegistrationForm />

        <div className="mt-20 text-center">
           <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest leading-relaxed">
             Confidential System: All registration attempts are logged by IP and physical location. <br/>
             Authorized government access only.
           </p>
        </div>
      </div>
    </div>
  );
}
