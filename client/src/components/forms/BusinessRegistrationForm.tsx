"use client";

import React, { useState } from 'react';

import { Building2, MapPin, Image as ImageIcon, FileText, CheckCircle, ArrowRight, Upload, Smartphone, ShieldCheck, AlertCircle, Loader2
} from 'lucide-react';

import { businessRegistrationService } from '@/services/businessRegistrationService';
import { apiClient } from '@/lib/apiClient';
import { useAuth } from '@/context/AuthContext';

const GST_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
// 5MB
export default function BusinessRegistrationForm() {
  const { setAuth } = useAuth();
  const [step, setStep] = useState(1);
const [error, setError] = useState('');
const [isSubmitting, setIsSubmitting] = useState(false);
const [appId, setAppId] = useState('');
// State for Step 1: Verification
const [otpMode, setOtpMode] = useState<'idle' | 'sent' | 'verified'>('idle');
const [otpInput, setOtpInput] = useState('');
const [formData, setFormData] = useState({ orgName: '', businessType: 'Wholesaler', ownerName: '', mobile: '', email: '', password: 'password123', // Default for now
description: '', state: '', district: '', city: '', address: '', pinCode: '', gpsLocation: '', shopFrontImage: '', insideImage: '', ownerImage: '', gstNumber: '', gstCertificate: '' // Base64 or mock URL
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
      user?: { role: 'farmer' | 'business' | 'salesman' | 'admin'; id: string; name: string; status: 'pending' | 'approved' | 'rejected'; verified: boolean };
    }>('/auth/register', {
      name: formData.ownerName,
      mobile: formData.mobile,
      email: formData.email,
      password: formData.password,
      role: 'business'
    });
    
    if (response.token || response.message === 'User already exists') {
      if (response.token && response.user) {
        setAuth(response.user.role, response.token, response.user.id, response.user.name, response.user.status, response.user.verified);
      }
      setOtpMode('sent');
    } else {
      setError((response as { message?: string }).message || 'Failed to send OTP');
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
  } catch (err) {
    setError('Verification failed.');
  }
};

const businessTypes = ['Mandi Participant', 'Trader', 'Wholesaler', 'Food Processor', 'Logistics Partner'];
const indianStates = ['Punjab', 'Haryana', 'Maharashtra', 'Karnataka', 'Uttar Pradesh'];
const validateStep = (currentStep: number): boolean => { setError('');
if (currentStep === 1) {
  if (!formData.orgName) { setError('Organization Name is required.');
return false; }
if (!formData.ownerName) { setError('Owner Name is required.');
return false; }
if (otpMode !== 'verified') { setError('Mobile number must be OTP verified.');
return false; } }
if (currentStep === 2) {
  if (!formData.state || !formData.district || !formData.city || !formData.address || !formData.pinCode) { setError('All location fields except GPS are required.');
return false; } }
if (currentStep === 3) {
  if (!formData.shopFrontImage) { setError('Shop Front Image is mandatory.');
return false; } }
if (currentStep === 4) {
  if (!formData.gstCertificate) { setError('GST Certificate upload is mandatory.');
return false; }
if (!GST_REGEX.test(formData.gstNumber.toUpperCase())) { setError('Invalid GST Number Format (e.g., 07AAAAA0000A1Z5)');
return false; } }
return true; };
const handleNext = async () => {
  if (validateStep(step)) {
  if (step === 4) { setIsSubmitting(true); try {
  const { business_id } = await businessRegistrationService.submitBusinessProfile(formData); setAppId(business_id); setStep(5); } catch (err: any) { setError(err.message || 'Critical verification error during submit.'); } finally { setIsSubmitting(false); } } else { setStep(prev => prev + 1); } } };
const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
  const file = e.target.files?.[0];
if (!file) return;
if (!['image/jpeg', 'image/png'].includes(file.type)) { setError('Only JPG/PNG images are allowed.');
return; }
if (file.size > MAX_IMAGE_SIZE) { setError('Image must be under 5MB.');
return; } setError('');
const reader = new FileReader(); reader.onloadend = () => { setFormData(prev => ({ ...prev, [fieldName]: reader.result as string })); }; reader.readAsDataURL(file); };
const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
  const file = e.target.files?.[0];
if (!file) return; setError('');
// Mocking document upload
setFormData(prev => ({ ...prev, [fieldName]: file.name })); };
const getStepIcon = (idx: number) => {
  if (idx === 1) return <Building2 className="w-5 h-5" />;
if (idx === 2) return <MapPin className="w-5 h-5" />;
if (idx === 3) return <ImageIcon className="w-5 h-5" />;
if (idx === 4) return <FileText className="w-5 h-5" />;
return <CheckCircle className="w-5 h-5" />; };
if (step === 5) {
  return ( <div className="max-w-xl mx-auto glass-card p-12 text-center animate-in zoom-in duration-500">
<div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
<ShieldCheck className="w-12 h-12 text-primary" />
</div>
<h2 className="text-3xl font-black mb-4 tracking-tighter text-primary">Verification Pending</h2>
<p className="text-gray-500 mb-6 leading-relaxed"> Your business profile for <strong>{
  formData.orgName}
</strong> is currently under legal review. Our compliance team will inspect your GST bounds and location credentials. You will be notified within 24–48 hours. </p>
<div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl flex flex-col items-center">
<p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Assigned Application ID</p>
<p className="font-mono text-lg text-gray-500">#B2B-{appId || Date.now().toString().slice(-6)}
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
<h2 className="text-2xl font-black mb-1">Business Details</h2>
<p className="text-sm text-gray-500">Enter the primary legal entity identifiers.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Organization Name *</label>
<input type="text" title="Organization Name" aria-label="Organization Name" value={
  formData.orgName} onChange={(e) => setFormData(prev => ({...prev, orgName: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" placeholder="e.g. Punjab Traders Pvt Ltd" />
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Business Type</label>
<select title="Business Type" aria-label="Business Type" value={
  formData.businessType} onChange={(e) => setFormData(prev => ({...prev, businessType: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors appearance-none" > {businessTypes.map(b =>
<option key={b} value={b} className="bg-[var(--theme-bg)]">{b}
</option>)}
</select>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Owner / Director Name *</label>
<input type="text" title="Owner Name" aria-label="Owner Name" value={
  formData.ownerName} onChange={(e) => setFormData(prev => ({...prev, ownerName: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" placeholder="Full Legal Name" />
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Company Email</label>
<input type="email" title="Company Email" aria-label="Company Email" value={
  formData.email} onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" placeholder="contact@company.com" />
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
<CheckCircle className="w-5 h-5" /> Phone Number Verified </div> )}
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Business Description</label>
<textarea title="Business Description" aria-label="Business Description" value={
  formData.description} onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors min-h-[100px]" placeholder="What commodities does your business deal in?" />
</div>
</div> )} {/* STEP 2: Location Details */} {step === 2 && ( <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
<div>
<h2 className="text-2xl font-black mb-1">Location Blueprint</h2>
<p className="text-sm text-gray-400">Where is the primary physical hub located?</p>
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
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">City / Village *</label>
<input type="text" title="City" aria-label="City" placeholder="City" value={
  formData.city} onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" />
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">PIN Code *</label>
<input type="text" title="PIN Code" aria-label="PIN Code" placeholder="PIN Code" value={
  formData.pinCode} onChange={(e) => setFormData(prev => ({...prev, pinCode: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" maxLength={6} />
</div>
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-2 block">Full Address *</label>
<textarea title="Full Address" aria-label="Full Address" value={
  formData.address} onChange={(e) => setFormData(prev => ({...prev, address: e.target.value}))} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:border-primary/50 focus:outline-none transition-colors" placeholder="Street/Mandi Phase No." />
</div>
<button onClick={() => setFormData(prev => ({...prev, gpsLocation: '30.900965, 75.857277'}))} className={`w-full py-4 border border-dashed rounded-xl flex items-center justify-center gap-3 transition-colors ${
  formData.gpsLocation ? 'border-primary/50 bg-primary/10 text-primary font-bold' : 'border-gray-200 hover:border-gray-200 text-gray-400 hover:text-gray-400' }`} >
<MapPin className="w-5 h-5" /> {
  formData.gpsLocation ? 'GPS Captured: ' + formData.gpsLocation : 'Auto-Detect GPS Coordinates'}
</button>
</div> )} {/* STEP 3: Photos */} {step === 3 && ( <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
<div>
<h2 className="text-2xl font-black mb-1">Visual Verification</h2>
<p className="text-sm text-gray-400">Provide physical proof of establishment (JPG/PNG under 5MB).</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
<div className="space-y-2">
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 block">Market Front / Exterior *</label>
<div className="relative group w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/50 overflow-hidden bg-gray-50 flex items-center justify-center transition-all cursor-pointer">
<input title="Shop Front Image" aria-label="Shop Front Image" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageUpload(e, 'shopFrontImage')} className="absolute inset-0 0 z-10 cursor-pointer" /> {
  formData.shopFrontImage ? ( <img src={
  formData.shopFrontImage} alt="Shop Front" className="w-full h-full object-cover" /> ) : ( <div className="text-center group-hover:text-primary transition-colors">
<Upload className="w-8 h-8 mx-auto mb-2 30 group-hover:100" />
<span className="text-xs font-bold text-gray-400 group-hover:text-primary">Upload Mandatory Photo</span>
</div> )}
</div>
</div>
<div className="space-y-2">
<label className="text-[10px] uppercase font-black tracking-widest text-gray-400 block">Owner ID / Selfie (Optional)</label>
<div className="relative group w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center transition-all cursor-pointer">
<input title="Owner Image" aria-label="Owner Image" type="file" accept="image/jpeg, image/png" onChange={(e) => handleImageUpload(e, 'ownerImage')} className="absolute inset-0 0 z-10 cursor-pointer" /> {
  formData.ownerImage ? ( <img src={
  formData.ownerImage} alt="Owner" className="w-full h-full object-cover" /> ) : ( <div className="text-center group-hover:text-gray-400 transition-colors">
<Upload className="w-8 h-8 mx-auto mb-2 30 group-hover:100" />
<span className="text-xs font-bold text-gray-400 group-hover:text-gray-400">Upload Optional Photo</span>
</div> )}
</div>
</div>
</div>
</div> )} {/* STEP 4: Legal */} {step === 4 && ( <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
<div>
<h2 className="text-2xl font-black mb-1">Corporate KYC</h2>
<p className="text-sm text-gray-400">Upload official tax and registration documents to finalize identity validation.</p>
</div>
<div>
<label className="text-[10px] uppercase font-black tracking-widest text-primary mb-2 block w-full bg-primary/10 px-3 py-2 rounded-t-lg border-b border-primary/20">GST / Tax Identification Number *</label>
<input type="text" title="GST Number" aria-label="GST Number" value={
  formData.gstNumber} onChange={(e) => setFormData(prev => ({...prev, gstNumber: e.target.value.toUpperCase()}))} className="w-full bg-gray-50 rounded-b-xl px-4 py-4 font-mono tracking-widest focus:bg-gray-50 focus:outline-none transition-colors border-none" placeholder="22AAAAA0000A1Z5" />
</div>
<div className="p-6 border-2 border-dashed border-primary/30 rounded-2xl text-center bg-primary/5 hover:bg-primary/10 transition-colors relative">
<input title="GST Certificate" aria-label="GST Certificate" type="file" onChange={(e) => handleFileUpload(e, 'gstCertificate')} className="absolute inset-0 0 cursor-pointer z-10" />
<FileText className="w-10 h-10 text-primary mx-auto mb-3" /> {
  formData.gstCertificate ? ( <p className="font-bold text-primary">{
  formData.gstCertificate}
</p> ) : ( <>
<h3 className="font-bold text-lg text-gray-400">Upload GST Certificate (PDF/Image) *</h3>
<p className="text-sm text-gray-400 mt-1">Required to prove legal entity operation.</p>
</> )}
</div>
<div className="p-4 bg-gray-50 rounded-xl border border-gray-200 flex items-start gap-4 mt-6">
<ShieldCheck className="w-6 h-6 text-gray-400 shrink-0" />
<div>
<h4 className="font-bold text-sm">Strict Auditing Rules</h4>
<p className="text-xs text-gray-400 leading-relaxed mt-1">Falsified legal documents result in a permanent ban from the platform. The compliance team ensures all physical addresses map back to the GST database.</p>
</div>
</div>
</div> )} {/* Navigation Buttons */}
<div className="flex justify-between items-center mt-10 pt-6 border-t border-gray-200"> {step > 1 ? ( <button onClick={() => setStep(prev => prev - 1)} className="px-6 py-3 font-bold text-gray-400 hover:text-gray-400 hover:bg-gray-50 rounded-xl transition-all" > Back </button> ) : <div>
</div>}
<button onClick={handleNext} disabled={isSubmitting} className="flex items-center gap-2 px-8 py-3 bg-primary text-black font-black rounded-xl hover:bg-primary-light transition-all shadow-[0_0_15px_rgba(205,243,10,0.2)] ml-auto disabled:50" > {isSubmitting ? ( <>
<Loader2 className="w-5 h-5 animate-spin" /> Processing...</> ) : ( <>{step === 4 ? 'Submit KYC' : 'Continue'}
<ArrowRight className="w-4 h-4" />
</> )}
</button>
</div>
</div>
</div> );
}
