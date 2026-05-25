"use client";

import React, { useState, useEffect } from 'react';

import Link from 'next/link';

import { ArrowLeft, Users, Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { adminService, AdminUser } from '@/services/adminService';

export default function UserManagement() {
  useLanguage();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminService.getUsers();
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8 font-bold">
        <ArrowLeft className="w-4 h-4" /> Back to Admin Panel
      </Link>
      <header className="mb-12">
        <h1 className="text-4xl font-black mb-4 flex items-center gap-3 italic">
          <Users className="w-10 h-10 text-blue-600" /> User Management
        </h1>
        <p className="text-gray-500 max-w-2xl font-medium">Monitor and manage all Customers and Salesmen in the system.</p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-500">
          <Loader2 className="w-12 h-12 animate-spin mb-4" />
          <p className="font-bold uppercase tracking-widest text-xs">Fetching records...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div 
              key={user._id} 
              className="glass-card p-6 border-gray-200 hover:border-blue-200 transition-all group animate-in slide-in-from-bottom-4 duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center font-black text-lg text-blue-600">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-black text-lg leading-none mb-2">{user.name}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-black ${user.role === 'Salesman' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-700'}`}>
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>
                <span className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-wider ${user.isVerified ? 'text-green-600' : 'text-orange-500'}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${user.isVerified ? 'bg-green-500' : 'bg-orange-500'}`} />
                  {user.isVerified ? 'Verified' : 'Pending'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Joined</div>
                  <div className="text-sm font-bold text-gray-700">
                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <div className="text-[10px] text-gray-500 uppercase font-black mb-1">Status</div>
                  <div className="text-sm font-bold text-gray-700">{user.status}</div>
                </div>
              </div>

              <div className="text-xs text-gray-500 mb-6 italic truncate">
                {user.email || user.phone || 'No contact info'}
              </div>

              <button className="w-full py-3 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl text-sm font-black transition-all border border-gray-200 active:scale-95">
                View Extended Profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}