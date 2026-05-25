"use client";

import React, { useState } from 'react';

import { User, MapPin, Tractor, FileText, CheckCircle, ArrowRight, ShieldCheck, AlertCircle, Loader2, Smartphone
} from 'lucide-react';

import { farmerRegistrationService } from '@/services/farmerRegistrationService';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

const AADHAAR_REGEX = /^\d{12}$/;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export default function FarmerRegistrationForm() {
  const { setAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appId, setAppId] = useState('');
  
  // State for Step 1: Verification
  const [otpMode, setOtpMode] = useState<'idle' | 'sent' | 'verified'>('idle');
  const [otpInput, setOtpInput] = useState('');
  const [formData, setFormData] = useState({ 
    farmerName: '', 
    mobile: '', 
    email: '', 
    password: 'password123', // Default for now
    gender: 'Male', 
    experienceYears: '', 
    primaryCrops: [] as string[], 
    state: '', 
    district: '', 
    village: '', 
    address: '', 
    pinCode: '', 
    gpsLocation: '', 
    landArea: '', 
    landType: 'Owned', 
    irrigationType: 'Borewell', 
    aadhaarNumber: '', 
    aadhaarDocument: '', 
    landDocument: '' 
  });

  const handleSendOtp = async () => {
    if (formData.mobile.length !== 10) {
      setError('Enter valid 10-digit number for OTP');
      return;
    }
    setError('');
    
    try {
      const response = await apiClient.post<{
        token?: string;
        message?: string;
        user?: {
          role: 'farmer' | 'business' | 'salesman' | 'admin';
          id: string;
          name: string;
          status: 'pending' | 'approved' | 'rejected';
          verified: boolean;
        };
      }>('/auth/register', {
        name: formData.farmerName,
        mobile: formData.mobile,
        email: formData.email,
        password: formData.password,
        role: 'farmer'
      });
      
      if (response.token || response.message === 'User already exists') {
        if (response.token && response.user) {
          setAuth(response.user.role, response.token, response.user.id, response.user.name, response.user.status, response.user.verified);
        }
        setOtpMode('sent');
      } else {
        setError(typeof response.message === 'string' ? response.message : 'Failed to send OTP');
      }
    } catch (_err) {
      setError('Connection refused.');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await apiClient.post('/auth/verify-otp', {
        mobile: formData.mobile,
        code: otpInput
      });

      if (response.message === 'OTP verified successfully') {
        setOtpMode('verified');
        setError('');
      } else {
        setError(typeof response.message === 'string' ? response.message : 'Invalid OTP');
      }
    } catch (_err) {
      setError('Verification failed.');
    }
  };

  const indianStates = ['Punjab', 'Haryana', 'Maharashtra', 'Karnataka', 'Uttar Pradesh'];
  const cropList = ['Wheat', 'Rice (Paddy)', 'Cotton', 'Sugarcane', 'Maize', 'Soybean', 'Mustard'];
  const handleCropToggle = (crop: string) => { setFormData(prev => ({ ...prev, primaryCrops: prev.primaryCrops.includes(crop) ? prev.primaryCrops.filter(c => c !== crop) : [...prev.primaryCrops, crop] })); };
  const validateStep = (currentStep: number): boolean => { setError('');
if (currentStep === 1) {
  if (!formData.farmerName) { setError('Farmer Name is required.');
return false; }
if (otpMode !== 'verified') { setError('Mobile number must be OTP verified.');
return false; }
if (!formData.experienceYears) { setError('Years of experience is required.');
return false; }
if (formData.primaryCrops.length === 0) { setError('Select at least one primary crop.');
return false; } }
if (currentStep === 2) {
  if (!formData.state || !formData.district || !formData.village || !formData.address || !formData.pinCode) { setError('All core location fields are required.');
return false; } }
if (currentStep === 3) {
  if (!formData.landArea) { setError('Land Area is required to estimate yield potentials.');
return false; } }
if (currentStep === 4) {
  if (!formData.aadhaarNumber.match(AADHAAR_REGEX)) { setError('Invalid Aadhaar (Must be exactly 12 digits).');
return false; }
if (!formData.aadhaarDocument) { setError('Aadhaar Document upload is mandatory for identity verification.');
return false; } }
return true; };
const handleNext = async () => {
  if (validateStep(step)) {
    if (step === 4) { 
      setIsSubmitting(true); 
      try {
        const { farmer_id } = await farmerRegistrationService.submitFarmerProfile(formData);
        setAppId(farmer_id); 
        setStep(5); 
      } catch (err: any) { 
        console.error(`[Frontend] Registration Error:`, err);
        setError(err.message || 'Critical verification error during submit.'); 
      } finally { 
        setIsSubmitting(false); 
      } 
    } else { 
      setStep(prev => prev + 1); 
    } 
  } 
};
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
  const file = e.target.files?.[0];
if (!file) return;
// Validate size and type for images
if (['image/jpeg', 'image/png'].includes(file.type)) {
  if (file.size > MAX_IMAGE_SIZE) { setError('Image must be under 5MB.');
return; } setError('');
const reader = new FileReader(); reader.onloadend = () => { setFormData(prev => ({ ...prev, [fieldName]: reader.result as string })); }; reader.readAsDataURL(file); } else if (file.type === 'application/pdf') { setError(''); setFormData(prev => ({ ...prev, [fieldName]: file.name }));
// mock PDF upload
} else { setError('Only JPG/PNG images or PDFs are allowed.'); } };
const getStepIcon = (idx: number) => {
  if (idx === 1) return <User className="w-5 h-5" />;
if (idx === 2) return <MapPin className="w-5 h-5" />;
if (idx === 3) return <Tractor className="w-5 h-5" />;
if (idx === 4) return <FileText className="w-5 h-5" />;
return <CheckCircle className="w-5 h-5" />; };
if (step === 5) {
  return ( <div className="max-w-xl mx-auto glass-card p-12 text-center animate-in zoom-in duration-500">
<div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
<ShieldCheck className="w-12 h-12 text-primary" />
</div>
<h2 className="text-3xl font-black mb-4 tracking-tighter text-primary">Verification Pending ⏳</h2>
<p className="text-gray-500 mb-6 leading-relaxed"> Your farmer profile (<strong>{
  formData.farmerName}
</strong>) is currently under verification. Our administrative team evaluates land matrices against the centralized registry. You will be notified within 24–48 hours. </p>
<div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center">
<p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Assigned Application ID</p>
<p className="font-mono text-lg text-gray-500">#FRM-{appId || Date.now().toString().slice(-6)}
</p>
</div>
</div> ); }
return ( <div className="max-w-3xl mx-auto"> {/* Steps Header */}
<div className="flex items-center justify-between mb-10 relative">
<div className="absolute top-1/2 left-0 w-full h-[2px] bg-gray-50 -z-10 -translate-y-1/2">
</div>
<div className={`absolute top-1/2 left-0 h-[2px] bg-primary -z-10 -translate-y-1/2 transition-all duration-500 ${ step === 1 ? 'w-0' : step === 2 ? 'w-1/3' : step === 3 ? 'w-2/3' : 'w-full' }`}>
</div> {[1, 2, 3, 4].map((s) => ( <div key={s} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 font-bold ${ s === step ? 'bg-primary text-white scale-110 shadow-lg' : s < step ? 'bg-primary text-white' : 'bg-gray-50 border border-gray-200 text-gray-400' }`}> {s < step ? <CheckCircle className="w-6 h-6" /> : getStepIcon(s)}
</div> ))}
</div>
<div className="glass-card p-8 border-primary/10 relative overflow-hidden"> {error && ( <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
<AlertCircle className="w-5 h-5 shrink-0" />
<p className="text-sm font-bold">{error}
</p>
</div> )} {/* STEP 1: Basic Details */} {step === 1 && ( <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
<div>
<h2 className="text-2xl font-black mb-1">Farmer Details</h2>
<p className="text-sm text-gray-400">Enter personal and core agricultural identifiers.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Full Legal Name *</label>
<input type="text" title="Farmer Name" aria-label="Farmer Name" value={
  formData.farmerName} onChange={(e) => setFormData(prev => ({...prev, farmerName: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" placeholder="e.g. Jaswinder Singh" />
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Gender (Optional)</label>
<select title="Gender" aria-label="Gender" value={
  formData.gender} onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors appearance-none" >
<option className="bg-[var(--theme-bg)]">Male</option>
<option className="bg-[var(--theme-bg)]">Female</option>
<option className="bg-[var(--theme-bg)]">Other</option>
</select>
</div>
</div>
<div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl space-y-4">
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 flex items-center gap-2">
<Smartphone className="w-4 h-4" /> Mobile Verification * </label>
<div className="flex gap-4">
<input type="tel" title="Mobile Number" aria-label="Mobile Number" value={
  formData.mobile} onChange={(e) => setFormData(prev => ({...prev, mobile: e.target.value}))} disabled={otpMode === 'verified'} className="flex-1 bg-black/20 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors disabled:50" placeholder="10-digit mobile number" maxLength={10} /> {otpMode === 'idle' && ( <button onClick={handleSendOtp} className="px-6 py-3 bg-gray-50 hover:bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm transition-all" > Send OTP </button> )}
</div> {otpMode === 'sent' && ( <div className="flex gap-4 animate-in fade-in duration-300">
<input type="text" title="OTP Input" aria-label="OTP Input" value={otpInput} onChange={(e) => setOtpInput(e.target.value)} className="flex-1 bg-primary/10 border border-primary/20 text-primary font-mono tracking-widest rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none" placeholder="Enter 4-digit OTP" maxLength={4} />
<button onClick={handleVerifyOtp} className="px-6 py-3 bg-primary text-black font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary-light transition-all" > Verify </button>
</div> )} {otpMode === 'verified' && ( <div className="flex items-center gap-2 text-green-400 font-bold text-sm bg-green-400/10 p-3 rounded-xl border border-green-400/20">
<CheckCircle className="w-5 h-5" /> Verified </div> )}
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Email (Optional)</label>
<input type="email" title="Email" aria-label="Email" value={
  formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" placeholder="contact@example.com" />
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Farming Experience (Years) *</label>
<input type="number" title="Experience Years" aria-label="Experience Years" value={
  formData.experienceYears} onChange={(e) => setFormData(prev => ({...prev, experienceYears: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" placeholder="e.g. 15" />
</div>
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-3 block">Primary Cultivation Crops (Select Multiple) *</label>
<div className="flex flex-wrap gap-2"> {cropList.map(crop => ( <button key={crop} onClick={() => handleCropToggle(crop)} className={`px-4 py-2 border rounded-full text-sm font-bold transition-all ${
  formData.primaryCrops.includes(crop) ? 'bg-primary text-black border-primary' : 'bg-gray-50 border-gray-200 text-gray-400 hover:border-gray-200 hover:text-gray-400' }`} > {crop}
</button> ))}
</div>
</div>
</div> )} {/* STEP 2: Location Details */} {step === 2 && ( <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
<div>
<h2 className="text-2xl font-black mb-1">Geographical Index</h2>
<p className="text-sm text-gray-400">This helps route your harvest to optimal corporate buyers nearest to you.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">State *</label>
<select title="State" aria-label="State" value={
  formData.state} onChange={(e) => setFormData(prev => ({...prev, state: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors appearance-none" >
<option value="" disabled>Select State</option> {indianStates.map(s =>
<option key={s} value={s} className="bg-[var(--theme-bg)]">{s}
</option>)}
</select>
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">District *</label>
<input type="text" title="District" aria-label="District" value={
  formData.district} onChange={(e) => setFormData(prev => ({...prev, district: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" placeholder="e.g. Ludhiana" />
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Village / Locality *</label>
<input type="text" title="Village" aria-label="Village" value={
  formData.village} onChange={(e) => setFormData(prev => ({...prev, village: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" />
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">PIN Code *</label>
<input type="text" title="PIN Code" aria-label="PIN Code" value={
  formData.pinCode} onChange={(e) => setFormData(prev => ({...prev, pinCode: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" maxLength={6} />
</div>
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Full Address *</label>
<textarea title="Full Address" aria-label="Full Address" value={
  formData.address} onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" placeholder="Street mapping" />
</div>
<button onClick={() => setFormData(prev => ({...prev, gpsLocation: '30.900965, 75.857277'}))} className={`w-full py-4 border border-dashed rounded-xl flex items-center justify-center gap-3 transition-colors ${
  formData.gpsLocation ? 'border-primary/50 bg-primary/10 text-primary font-bold' : 'border-gray-200 hover:border-gray-200 text-gray-400 hover:text-gray-400' }`} >
<MapPin className="w-5 h-5" /> {
  formData.gpsLocation ? 'GPS Captured: ' + formData.gpsLocation : 'Auto-Detect Field GPS'}
</button>
</div> )} {/* STEP 3: Land & Farming Details */} {step === 3 && ( <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
<div>
<h2 className="text-2xl font-black mb-1">Land Matrix</h2>
<p className="text-sm text-gray-400">These metrics are extremely useful for optimizing yield models.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Total Land Area (Acres) *</label>
<input type="number" title="Land Area" aria-label="Land Area" value={
  formData.landArea} onChange={(e) => setFormData(prev => ({...prev, landArea: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" placeholder="e.g. 5.5" />
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Land Type</label>
<select title="Land Type" aria-label="Land Type" value={
  formData.landType} onChange={(e) => setFormData(prev => ({...prev, landType: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors appearance-none" >
<option className="bg-[var(--theme-bg)]">Owned</option>
<option className="bg-[var(--theme-bg)]">Leased</option>
<option className="bg-[var(--theme-bg)]">Contract Farming</option>
</select>
</div>
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Primary Irrigation Asset</label>
<select title="Irrigation Type" aria-label="Irrigation Type" value={
  formData.irrigationType} onChange={(e) => setFormData(prev => ({...prev, irrigationType: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors appearance-none" >
<option className="bg-[var(--theme-bg)]">Rain Fed (Dryland)</option>
<option className="bg-[var(--theme-bg)]">Borewell / Tube Well</option>
<option className="bg-[var(--theme-bg)]">Canal</option>
<option className="bg-[var(--theme-bg)]">Drip / Sprinkler System</option>
</select>
</div>
</div> )} {/* STEP 4: Legal & Identity */} {step === 4 && ( <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
<div>
<h2 className="text-2xl font-black mb-1">Government Identity</h2>
<p className="text-sm text-gray-400">Upload official tax and registration documents to finalize identity validation.</p>
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-primary mb-2 block w-full bg-primary/10 px-3 py-2 rounded-t-lg border-b border-primary/20">Aadhaar Identity Number *</label>
<input type="text" title="Aadhaar Number" aria-label="Aadhaar Number" value={
  formData.aadhaarNumber} onChange={(e) => setFormData(prev => ({...prev, aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12)}))} className="w-full bg-gray-50 rounded-b-xl px-4 py-4 font-mono tracking-widest text-xl focus:bg-gray-50 focus:outline-none transition-colors border-none" placeholder="XXXX XXXX XXXX" />
</div>
<div className="p-6 border-2 border-dashed border-primary/30 rounded-2xl text-center bg-primary/5 hover:bg-primary/10 transition-colors relative">
<input title="Aadhaar Document" aria-label="Aadhaar Document" type="file" onChange={(e) => handleFileUpload(e, 'aadhaarDocument')} className="absolute inset-0 0 cursor-pointer z-10" />
<FileText className="w-10 h-10 text-primary mx-auto mb-3" /> {
  formData.aadhaarDocument ? ( <p className="font-bold text-primary text-sm truncate px-4">{
  formData.aadhaarDocument.slice(0, 20)}... Uploaded</p> ) : ( <>
<h3 className="font-bold text-lg text-gray-400">Upload Aadhaar Proof *</h3>
<p className="text-sm text-gray-400 mt-1">Accepts JPG/PNG/PDF under 5MB.</p>
</> )}
</div>
<div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center bg-gray-50 hover:bg-gray-50 transition-colors relative">
<input title="Land Ownership Document" aria-label="Land Ownership Document" type="file" onChange={(e) => handleFileUpload(e, 'landDocument')} className="absolute inset-0 0 cursor-pointer z-10" />
<Tractor className="w-8 h-8 text-gray-400 mx-auto mb-3" /> {
  formData.landDocument ? ( <p className="font-bold text-gray-400 text-sm truncate px-4">{
  formData.landDocument.slice(0, 20)}... Uploaded</p> ) : ( <>
<h3 className="font-bold text-gray-400">Land Ownership Record (Optional)</h3>
<p className="text-xs text-gray-400 mt-1">Useful to unlock advanced funding tools later.</p>
</> )}
</div>
</div> )} {/* Navigation Buttons */}
<div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200"> {step > 1 ? ( <button onClick={() => setStep(prev => prev - 1)} className="px-6 py-3 font-bold text-gray-400 hover:text-gray-400 hover:bg-gray-50 rounded-xl transition-all" > Back </button> ) : <div>
</div>}
<button onClick={handleNext} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-black rounded-xl hover:bg-primary-light transition-all shadow-lg ml-auto disabled:opacity-50 disabled:cursor-not-allowed" > {isSubmitting ? ( <>
<Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> ) : ( <>{step === 4 ? 'Finalize Registration' : 'Continue'}
<ArrowRight className="w-4 h-4" />
</> )}
</button>
</div>
</div>
</div> );
}
