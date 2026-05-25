import React from 'react';

import Sidebar from "@/components/layout/Sidebar";

import FarmerRegistrationForm from "@/components/forms/FarmerRegistrationForm";
export default function RegisterFarmerPage() {
  return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500 relative">
<Sidebar />
<main className="flex-1 main-content-shifted p-8 pt-10 flex flex-col items-center justify-center min-h-screen relative overflow-hidden"> {/* Background Gradients */}
<div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -z-10 pointer-events-none">
</div>
<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-green-500/10 rounded-full blur-[100px] -z-10 pointer-events-none">
</div>
<div className="w-full max-w-3xl mb-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
<div className="inline-block px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black tracking-widest uppercase mb-4"> Farmer Network Enrollment </div>
<h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-gray-500"> Secure Your Farmer Identity. </h1>
<p className="text-gray-500 text-lg max-w-xl mx-auto leading-relaxed"> Finalize your KYC compliance to unlock institutional pricing bounds, corporate buyers, and secure digital mandates. </p>
</div>
<div className="w-full z-10">
<FarmerRegistrationForm />
</div>
</main>
</div> );
}
