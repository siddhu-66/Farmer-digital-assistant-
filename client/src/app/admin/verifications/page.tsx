"use client";

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from "@/components/layout/Sidebar";
import { businessRegistrationService, BusinessApplication } from "@/services/businessRegistrationService";
import { farmerRegistrationService, FarmerApplication } from "@/services/farmerRegistrationService";
import { adminRegistrationService, AdminApplication } from "@/services/adminRegistrationService";
import {
  Building2, MapPin, CheckCircle, XCircle, Clock, Eye, FileText,
  AlertTriangle, Tractor, User, ShieldCheck, RefreshCw,
  BadgeCheck, Calendar, Wheat, Phone, Mail, Droplets, LayoutGrid, X, Files,
  Lock, ShieldAlert
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';


// ─── Approved Farmer Profile Card ─────────────────────────────────────────────
function FarmerProfileCard({ app, onClose }: { app: FarmerApplication; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-green-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-green-900">{app.farmerName}</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-600 text-white text-[10px] font-black rounded-full">
                  <BadgeCheck className="w-3 h-3" /> KYC VERIFIED
                </span>
              </div>
              <p className="text-sm text-green-700 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> {app.location}
              </p>
            </div>
          </div>
          <button onClick={onClose} title="Close" aria-label="Close" className="p-2 hover:bg-green-100 rounded-xl text-green-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Land Area', value: `${app.landArea} Acres`, icon: LayoutGrid },
              { label: 'Land Type', value: app.landType, icon: Wheat },
              { label: 'Experience', value: `${app.experienceYears} yrs`, icon: Calendar },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-green-50 border border-green-100 rounded-2xl p-4 text-center">
                <Icon className="w-5 h-5 text-green-600 mx-auto mb-1.5" />
                <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-0.5">{label}</p>
                <p className="font-black text-sm text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="glass-card p-4 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Contact Details</h3>
            <div className="flex flex-wrap gap-3">
              <span className="flex items-center gap-2 text-sm font-bold text-gray-700"><Phone className="w-4 h-4 text-green-500" />{app.mobile}</span>
              {app.email && <span className="flex items-center gap-2 text-sm font-bold text-gray-700"><Mail className="w-4 h-4 text-blue-400" />{app.email}</span>}
            </div>
          </div>

          {/* Crops */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Registered Crops</h3>
            <div className="flex flex-wrap gap-2">
              {app.primaryCrops.map(crop => (
                <span key={crop} className="px-3 py-1.5 bg-green-50 border border-green-200 text-green-800 text-xs font-black rounded-full">{crop}</span>
              ))}
            </div>
          </div>

          {/* Identity */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Government Identity</h3>
            <div className="bg-green-50 border border-green-200 rounded-xl p-3">
              <p className="text-[10px] font-black text-green-600 uppercase tracking-widest mb-1">Aadhaar Number</p>
              <p className="font-mono text-xl font-black tracking-widest text-green-900">{app.aadhaarNumber.replace(/(.{4})/g, '$1 ').trim()}</p>
            </div>
          </div>

          {/* Irrigation */}
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
              <Droplets className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Irrigation Type</p>
              <p className="font-black text-sm text-gray-800">{app.irrigationType}</p>
            </div>
          </div>

          {/* Approved at */}
          {app.approved_at && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
              <p className="text-sm text-green-800 font-bold">
                KYC approved on {new Date(app.approved_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Approved Business Profile Card ───────────────────────────────────────────
function BusinessProfileCard({ app, onClose }: { app: BusinessApplication; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 bg-blue-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
              <Building2 className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-black text-blue-900">{app.orgName}</h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-600 text-white text-[10px] font-black rounded-full">
                  <BadgeCheck className="w-3 h-3" /> VERIFIED
                </span>
              </div>
              <p className="text-sm text-blue-700 flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5" /> {app.location}
              </p>
            </div>
          </div>
          <button onClick={onClose} title="Close" aria-label="Close" className="p-2 hover:bg-blue-100 rounded-xl text-blue-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* Quick info grid */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Owner Name', value: app.ownerName },
              { label: 'Business Type', value: app.businessType },
              { label: 'GST Number', value: app.gstNumber },
              { label: 'GPS Location', value: app.gpsLocation || 'N/A' },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{label}</p>
                <p className="font-black text-sm text-gray-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className="glass-card p-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Submitted Documents</h3>
            <div className="space-y-2">
              {[
                { name: 'GST Certificate', uploaded: !!app.gstCertificate },
                { name: 'Shop Front Photo', uploaded: !!app.shopFrontImage },
              ].map(doc => (
                <div key={doc.name} className={`flex items-center gap-3 p-3 rounded-xl border ${doc.uploaded ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                  <FileText className={`w-4 h-4 ${doc.uploaded ? 'text-green-600' : 'text-red-500'}`} />
                  <span className="text-sm font-bold flex-1">{doc.name}</span>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${doc.uploaded ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                    {doc.uploaded ? 'UPLOADED' : 'MISSING'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Approved at */}
          {app.approved_at && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-blue-600 shrink-0" />
              <p className="text-sm text-blue-800 font-bold">
                Business verified on {new Date(app.approved_at).toLocaleDateString('en-IN', { dateStyle: 'long' })}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminVerifications() {
  const { role } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'business' | 'farmer' | 'admin'>('business');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const [businesses, setBusinesses] = useState<BusinessApplication[]>([]);
  const [farmers, setFarmers] = useState<FarmerApplication[]>([]);
  const [admins, setAdmins] = useState<AdminApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // Dialog / profile state
  const [selectedBApp, setSelectedBApp] = useState<BusinessApplication | null>(null);
  const [, setSelectedFApp] = useState<FarmerApplication | null>(null);
  const [selectedAApp, setSelectedAApp] = useState<AdminApplication | null>(null); // Added for admin applications
  const [rejectReason, setRejectReason] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  // Profile view after approval
  const [profileBApp, setProfileBApp] = useState<BusinessApplication | null>(null);
  const [profileFApp, setProfileFApp] = useState<FarmerApplication | null>(null);
  const fetchApplications = useCallback(async () => {
    setLoading(true);
    const [bData, fData, aData] = await Promise.all([
      businessRegistrationService.getAllApplications(),
      farmerRegistrationService.getAllApplications(),
      adminRegistrationService.getAllApplications(), // Fetch all admin applications
    ]);
    setBusinesses(bData.reverse());
    setFarmers(fData.reverse());
    setAdmins(aData.reverse()); // Set all admin applications
    setLoading(false);
  }, []);

  useEffect(() => {
    if (role !== 'admin' && role !== null) {
      router.push('/dashboard');
    } else {
      void fetchApplications();
    }
  }, [role, router, fetchApplications]);

  const handleBusinessAction = async (action: 'approve' | 'reject') => {
    if (!selectedBApp) return;
    if (action === 'reject' && !rejectReason.trim()) return;

    // Capture ID before closing modal
    const appId = selectedBApp.id;

    // Call service
    await businessRegistrationService.verifyBusiness(appId, action, rejectReason);

    // Close review modal immediately for better UX
    setSelectedBApp(null);
    setRejectReason("");
    setIsRejecting(false);

    if (action === 'approve') {
      // Refresh list in background
      await fetchApplications();
      // Find the updated app from the newly fetched state
      const approved = businesses.find(a => a.id === appId) || null;
      setProfileBApp(approved);
    } else {
      fetchApplications();
    }
  };

  const handleAdminAction = async (action: 'approve' | 'reject') => {
    if (!selectedAApp) return;
    if (action === 'reject' && !rejectReason.trim()) return;

    const appId = selectedAApp.id;

    await adminRegistrationService.verifyAdmin(appId, action, rejectReason);

    // Close review modal
    setSelectedAApp(null);
    setRejectReason("");
    setIsRejecting(false);

    if (action === 'approve') {
       alert(`Admin account ${appId} has been successfully verified! Credentials activated.`);
    }

    // Refresh list
    await fetchApplications();
  };

  // Filtered lists
  const filteredBApps = businesses.filter(a => a.status === statusFilter);
  const filteredFApps = farmers.filter(a => a.status === statusFilter);
  const filteredAApps = admins.filter(a => a.status === (statusFilter === 'pending' ? 'Pending Approval' : statusFilter === 'approved' ? 'Approved' : 'Rejected'));

  const displayed = activeTab === 'business' ? filteredBApps : activeTab === 'farmer' ? filteredFApps : filteredAApps;

  const pendingB = businesses.filter(a => a.status === 'pending').length;
  const pendingF = farmers.filter(a => a.status === 'pending').length;
  const pendingA = admins.filter(a => a.status === 'Pending Approval').length;

  const statusTabs = [
    { 
      id: 'pending', 
      label: 'Pending', 
      icon: Clock, 
      color: 'text-yellow-600 border-yellow-500', 
      badge: activeTab === 'business' ? pendingB : activeTab === 'farmer' ? pendingF : pendingA 
    },
    { id: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-green-600 border-green-500', badge: 0 },
    { id: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500 border-red-400', badge: 0 },
  ];

  return (
    <div className="min-h-screen bg-[var(--theme-bg)] text-gray-700">
      <Sidebar forceRole="admin" />
      <main className="ml-72 p-8 pt-10 relative z-0">
        <header className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-black mb-1">Admin Compliance Central</h1>
            <p className="text-gray-500">Verify inbound identities for the corporate trading portal and farmer networks.</p>
          </div>
          <button onClick={fetchApplications} title="Refresh" aria-label="Refresh" className="p-3 rounded-xl border border-gray-200 hover:bg-gray-50 active:scale-95 text-gray-500 transition-all">
            <RefreshCw className="w-4 h-4" />
          </button>
        </header>

        {/* Role Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mb-6">
          <button 
            onClick={() => setActiveTab('business')} 
            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${activeTab === 'business' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Building2 className="w-5 h-5" /> B2B Companies
            {pendingB > 0 && (
              <span className="absolute -top-1 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] text-white ring-4 ring-white">
                {pendingB}
              </span>
            )}
            {activeTab === 'business' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-full" />}
          </button>
          
          <button 
            onClick={() => setActiveTab('farmer')} 
            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${activeTab === 'farmer' ? 'text-green-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Tractor className="w-5 h-5" /> Farmer Networks
            {pendingF > 0 && (
              <span className="absolute -top-1 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-[10px] text-white ring-4 ring-white">
                {pendingF}
              </span>
            )}
            {activeTab === 'farmer' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-600 rounded-full" />}
          </button>

          <button 
            onClick={() => setActiveTab('admin')} 
            className={`flex items-center gap-2 pb-4 text-sm font-bold transition-all relative ${activeTab === 'admin' ? 'text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ShieldCheck className="w-5 h-5" /> Admin Requests
            {pendingA > 0 && (
              <span className="absolute -top-1 -right-4 flex h-5 w-5 items-center justify-center rounded-full bg-purple-600 text-[10px] text-white ring-4 ring-white">
                {pendingA}
              </span>
            )}
            {activeTab === 'admin' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-full" />}
          </button>
        </div>

        {/* Status Filter Pills */}
        <div className="flex gap-3 mb-8">
          {statusTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as typeof statusFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black border transition-all ${statusFilter === tab.id ? `${tab.color} bg-gray-50 border-current` : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.badge > 0 && <span className="bg-yellow-100 text-yellow-700 text-[10px] px-1.5 py-0.5 rounded-full">{tab.badge}</span>}
            </button>
          ))}
        </div>

        {/* List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin" />
          </div>
        ) : displayed.length === 0 ? (
          <div className="glass-card p-14 text-center flex flex-col items-center">
            <CheckCircle className="w-12 h-12 text-gray-300 mb-4" />
            <p className="text-gray-400 font-bold">No {statusFilter} {activeTab} applications</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeTab === 'business'
              ? filteredBApps.map(app => (
                <div key={app.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center border border-blue-100 shrink-0">
                      <Building2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black flex items-center gap-2">
                        {app.orgName}
                        {app.status === 'approved' && <BadgeCheck className="w-4 h-4 text-blue-600" />}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">{app.businessType}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${app.status === 'approved' ? 'bg-green-100 text-green-700' : app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                          {app.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : app.status === 'rejected' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 relative z-10">
                    {app.status === 'approved' && (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setProfileBApp(app); }} 
                        className="px-5 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 cursor-pointer active:scale-95 transition-all text-sm flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" /> View Profile
                      </button>
                    )}
                    {app.status === 'pending' && (
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedBApp({...app}); setIsRejecting(false); }} 
                        className="px-5 py-2.5 bg-blue-600 text-white font-black rounded-xl hover:bg-blue-700 cursor-pointer active:scale-95 transition-all text-sm flex items-center gap-2 shadow-lg shadow-blue-500/20 relative z-30 pointer-events-auto"
                      >
                        <ShieldCheck className="w-4 h-4" /> Verify KYC
                      </button>
                    )}
                  </div>
                </div>
              ))
              : activeTab === 'farmer' ? filteredFApps.map(app => (
                <div key={app.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100 shrink-0">
                      <User className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black flex items-center gap-2">
                        {app.farmerName}
                        {app.status === 'approved' && <BadgeCheck className="w-4 h-4 text-green-600" />}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-gray-100 text-gray-500 rounded-md">{app.landArea} Acres</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${app.status === 'approved' ? 'bg-green-100 text-green-700' : app.status === 'rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                          {app.status === 'approved' ? <CheckCircle className="w-3 h-3" /> : app.status === 'rejected' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 relative z-10">
                    {app.status === 'approved' && (
                      <button 
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setProfileFApp(app); }} 
                        className="px-5 py-2.5 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 cursor-pointer active:scale-95 transition-all text-sm flex items-center gap-2 relative z-10"
                      >
                        <Eye className="w-4 h-4" /> View Profile
                      </button>
                    )}
                    {app.status === 'pending' && (
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedFApp({...app}); setIsRejecting(false); }} 
                        className="px-5 py-2.5 bg-green-500 text-white font-black rounded-xl hover:bg-green-600 cursor-pointer active:scale-95 transition-all text-sm flex items-center gap-2 shadow-lg shadow-green-500/20 relative z-30 pointer-events-auto"
                      >
                        <ShieldCheck className="w-4 h-4" /> Verify KYC
                      </button>
                    )}
                  </div>
                </div>
              ))
              : filteredAApps.map(app => (
                <div key={app.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-purple-100 hover:border-purple-200 transition-all">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center border border-purple-100 shrink-0">
                      <ShieldCheck className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black flex items-center gap-2">
                        {app.fullName}
                        {app.status === 'Approved' && <BadgeCheck className="w-4 h-4 text-purple-600" />}
                      </h4>
                      <p className="text-sm text-gray-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{app.location}</p>
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-purple-50 text-purple-600 rounded-md">{app.username}</span>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md flex items-center gap-1 ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : app.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700'}`}>
                          {app.status === 'Approved' ? <CheckCircle className="w-3 h-3" /> : app.status === 'Rejected' ? <XCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 relative z-10">
                    {app.status === 'Pending Approval' && (
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedAApp({...app}); setIsRejecting(false); }} 
                        className="px-5 py-2.5 bg-purple-600 text-white font-black rounded-xl hover:bg-purple-700 cursor-pointer active:scale-95 transition-all text-sm flex items-center gap-2 shadow-lg shadow-purple-500/20 relative z-30 pointer-events-auto"
                      >
                        <ShieldCheck className="w-4 h-4" /> Review Access
                      </button>
                    )}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── BUSINESS KYC REVIEW MODAL ───────────────────────────── */}
        {selectedBApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedBApp(null)} />
            <div className="glass-card w-full max-w-3xl relative z-10 animate-in zoom-in-95 duration-200 p-0 overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <div>
                  <h2 className="text-2xl font-black text-blue-900">Verify Business Application</h2>
                  <p className="text-gray-500 text-sm italic">Reviewing Application #{selectedBApp.id}</p>
                </div>
                <button title="Close" aria-label="Close" onClick={() => setSelectedBApp(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Business Name</p>
                    <p className="text-xl font-black text-gray-800">{selectedBApp.orgName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Legal Owner</p>
                    <p className="text-xl font-black text-gray-800">{selectedBApp.ownerName}</p>
                  </div>
                </div>

                <div className="p-5 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-blue-600 font-black mb-0.5">Location</p>
                    <p className="font-bold text-gray-800">{selectedBApp.location}</p>
                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">GPS: {selectedBApp.gpsLocation || 'No GPS captured'}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-widest text-gray-400 flex items-center gap-2">
                    <Files className="w-4 h-4" /> Photos & Documentation
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase text-gray-400 ml-1">Shop Front Preview</p>
                      {selectedBApp.shopFrontImage && selectedBApp.shopFrontImage !== '[uploaded]' ? (
                        <img src={selectedBApp.shopFrontImage} className="w-full aspect-video object-cover rounded-2xl border-2 border-white shadow-lg" alt="Shop Front" />
                      ) : (
                        <div className="w-full aspect-video bg-gray-100 rounded-2xl flex items-center justify-center flex-col border-2 border-dashed border-gray-200">
                          <Building2 className="w-8 h-8 text-gray-300 mb-2" />
                          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            {selectedBApp.shopFrontImage === '[uploaded]' ? 'Image Uploaded' : 'Missing Photo'}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div className="bg-white p-4 border border-gray-200 rounded-2xl shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black">GST Certificate</p>
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${selectedBApp.gstCertificate ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                            {selectedBApp.gstCertificate ? 'VALID' : 'MISSING'}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                            <FileText className="w-5 h-5 text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-black text-gray-800">GST Registration Doc</p>
                            <p className="text-[10px] font-bold text-blue-600 font-mono tracking-wider">{selectedBApp.gstNumber}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-2xl">
                         <p className="text-[10px] font-black text-yellow-700 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                           <AlertTriangle className="w-3 h-3" /> Compliance Note
                         </p>
                         <p className="text-[11px] text-yellow-800 leading-relaxed font-medium">Verify that the GSTIN matches the organization name exactly as per government records.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                {isRejecting ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4">
                    <label className="text-[10px] font-black text-red-500 mb-3 block uppercase tracking-[0.2em]">Enter rejection reason (Mandatory)</label>
                    <div className="flex gap-4">
                      <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Invalid GST Certificate, Unclear business photos..." className="flex-1 bg-white border border-red-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-medium text-gray-800" />
                      <button disabled={!rejectReason.trim()} onClick={() => handleBusinessAction('reject')} className="px-8 py-3.5 bg-red-600 text-white font-black rounded-2xl disabled:opacity-50 hover:bg-red-700 active:scale-95 transition-all flex items-center gap-2 shrink-0 shadow-lg shadow-red-600/20">
                        <XCircle className="w-5 h-5" /> REJECT APPLICATION
                      </button>
                    </div>
                    <button onClick={() => setIsRejecting(false)} className="text-[10px] font-black text-gray-400 mt-4 hover:text-gray-600 transition-all uppercase tracking-widest px-1">Cancel Decision</button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setIsRejecting(true)} className="px-8 py-4 border-2 border-red-100 text-red-500 font-black hover:bg-red-50 active:scale-95 rounded-2xl transition-all uppercase tracking-widest text-xs">Reject Application</button>
                    <button onClick={() => handleBusinessAction('approve')} className="px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 active:scale-95 shadow-xl shadow-blue-600/30 transition-all flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6" /> APPROVE & VERIFY
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── ADMIN ACCESS REVIEW MODAL ───────────────────────────── */}
        {selectedAApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedAApp(null)} />
            <div className="glass-card w-full max-w-2xl relative z-10 animate-in zoom-in-95 duration-200 p-0 overflow-hidden flex flex-col max-h-[90vh] border-purple-500/30">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-purple-50">
                <div>
                  <h2 className="text-2xl font-black text-purple-900 flex items-center gap-2"><Lock className="w-6 h-6" /> Admin Enrollment Review</h2>
                  <p className="text-gray-500 text-sm mt-1">Application ID: {selectedAApp.id}</p>
                </div>
                <button title="Close" aria-label="Close" onClick={() => setSelectedAApp(null)} className="p-2 hover:bg-purple-100 rounded-full transition-colors text-purple-700">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              <div className="p-8 overflow-y-auto flex-1 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center border-2 border-purple-200 text-purple-600 shadow-inner">
                    <User className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-gray-800">{selectedAApp.fullName}</h3>
                    <p className="text-purple-600 font-bold">@{selectedAApp.username}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Email Address</p>
                    <p className="font-bold text-gray-700">{selectedAApp.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone Number</p>
                    <p className="font-bold text-gray-700">{selectedAApp.mobile}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Organization</p>
                    <p className="font-bold text-gray-700">{selectedAApp.organization || 'Not Specified'}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Base Territory</p>
                    <p className="font-bold text-gray-700">{selectedAApp.location}</p>
                  </div>
                </div>

                <div className="p-6 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-start gap-4">
                  <ShieldAlert className="w-6 h-6 text-purple-500 shrink-0 mt-1" />
                  <div>
                    <p className="font-black text-purple-900 mb-1 uppercase text-xs tracking-widest">Security Clearance Required</p>
                    <p className="text-sm text-purple-800 leading-relaxed font-medium">By approving this request, you grant this user full access to the administrative dashboard, including PII data and transaction records.</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                {isRejecting ? (
                  <div className="animate-in fade-in slide-in-from-bottom-4">
                    <label className="text-[10px] font-black text-red-500 mb-3 block uppercase tracking-[0.2em]">Security Rejection Reason</label>
                    <div className="flex gap-4">
                      <input type="text" value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="e.g. Unauthorized organization, suspicious credentials..." className="flex-1 bg-white border border-red-200 px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-4 focus:ring-red-100 transition-all font-medium" />
                      <button disabled={!rejectReason.trim()} onClick={() => handleAdminAction('reject')} className="px-8 py-3.5 bg-red-600 text-white font-black rounded-2xl hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-600/20">
                        DENY ACCESS
                      </button>
                    </div>
                    <button onClick={() => setIsRejecting(false)} className="text-[10px] font-black text-gray-400 mt-4 hover:text-gray-600 transition-all uppercase tracking-widest px-1">Cancel Decision</button>
                  </div>
                ) : (
                  <div className="flex justify-end gap-4">
                    <button onClick={() => setIsRejecting(true)} className="px-8 py-4 border-2 border-red-100 text-red-500 font-black hover:bg-red-50 active:scale-95 rounded-2xl transition-all uppercase tracking-widest text-xs">Reject Admin</button>
                    <button onClick={() => handleAdminAction('approve')} className="px-8 py-4 bg-purple-600 text-white font-black rounded-2xl hover:bg-purple-700 active:scale-95 shadow-xl shadow-purple-600/30 transition-all flex items-center gap-3">
                      <ShieldCheck className="w-6 h-6" /> GRANT FULL ACCESS
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── APPROVED PROFILE VIEWS ─────────────────────────────── */}
        {profileFApp && <FarmerProfileCard app={profileFApp} onClose={() => setProfileFApp(null)} />}
        {profileBApp && <BusinessProfileCard app={profileBApp} onClose={() => setProfileBApp(null)} />}
      </main>
    </div>
  );
}
