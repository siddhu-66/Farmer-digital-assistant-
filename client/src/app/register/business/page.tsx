import React from "react";

import Sidebar from "@/components/layout/Sidebar";

import BusinessRegistrationForm from "@/components/forms/BusinessRegistrationForm";

import { Building2 } from "lucide-react";
export default function BusinessRegister() {
  return ( <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500">
<Sidebar />
<main className="flex-1 main-content-shifted p-8 pt-10">
<header className="mb-10 text-center max-w-2xl mx-auto">
<div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6 border border-primary/20 shadow-[0_0_30px_rgba(205,243,10,0.1)]">
<Building2 className="w-8 h-8" />
</div>
<h1 className="text-4xl font-black mb-3">Corporate & Buyer Enrollment</h1>
<p className="text-gray-500 text-lg"> Join the decentralized agricultural network to procure verified quality crops directly from regional farmers. </p>
</header>
<BusinessRegistrationForm />
</main>
</div> );
}
