"use client";

import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import SalesmanRegistrationForm from "@/components/forms/SalesmanRegistrationForm";
import { Users } from "lucide-react";

export default function SalesmanRegister() {
  return (
    <div className="flex bg-[var(--theme-bg)] min-h-screen text-gray-500">
      <Sidebar />
      <main className="flex-1 main-content-shifted p-8 pt-10">
        <header className="mb-10 text-center max-w-2xl mx-auto">
          <div className="w-16 h-16 bg-orange-500/10 text-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-orange-500/20 shadow-[0_0_30px_rgba(255,165,0,0.1)]">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-black mb-3 text-gray-800 italic">Field Procurement Hub Registration</h1>
          <p className="text-gray-500 text-lg">
            Join our logistics network as a Salesman to bridge the gap between regional farmers and industrial buyers.
          </p>
        </header>
        <SalesmanRegistrationForm />
      </main>
    </div>
  );
}
