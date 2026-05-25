"use client";

import React, { useState } from 'react';
import { 
  User, Mail, Smartphone, MapPin, 
  Lock, ShieldCheck, CheckCircle, ArrowRight, 
  Loader2, AlertCircle, Key,
  Car, Building
} from 'lucide-react';
import { salesmanRegistrationService } from '@/services/salesmanRegistrationService';
import { useAuth } from '@/context/AuthContext';

export default function SalesmanRegistrationForm() {
  const { setAuth } = useAuth();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [salesmanId, setSalesmanId] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    hubId: '',
    region: '',
    vehicleNumber: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const [otpInput, setOtpInput] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.mobile || !formData.hubId || !formData.region) {
        setError('Please fill all required fields');
        return false;
      }
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError('Invalid email address');
        return false;
      }
      if (formData.mobile.length !== 10) {
        setError('Mobile number must be 10 digits');
        return false;
      }
    }
    if (step === 2) {
      if (!formData.username || !formData.password || !formData.confirmPassword) {
        setError('All credential fields are required');
        return false;
      }
      if (formData.password.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      if (!/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
        setError('Password must contain at least one uppercase letter and one number');
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    if (step === 3) {
      if (!otpVerified) {
        setError('Please verify OTP to continue');
        return false;
      }
    }
    return true;
  }

  const handleNext = async () => {
    if (validateStep()) {
      if (step === 3) {
        setIsSubmitting(true);
        setStep(4);
        try {
          const response = await salesmanRegistrationService.submitSalesmanRegistration(formData);
          setAuth(response.user.role, response.token, response.user.id, response.user.name, response.user.status, response.user.verified);
          setSalesmanId(response.user.id);
          setTimeout(() => {
            setIsSubmitting(false);
            setStep(5);
          }, 2000);
        } catch (err: any) {
          setError(err.message || 'Registration failed. Try again.');
          setIsSubmitting(false);
          setStep(3);
        }
      } else {
        setStep(prev => prev + 1);
      }
    }
  }

  const handleOtpVerify = () => {
    if (otpInput === '1234') {
      setOtpVerified(true);
      setError('');
    } else {
      setError('Invalid OTP. Use 1234 for demo.');
    }
  }

  if (step === 4) {
    return (
      <div className="max-w-xl mx-auto glass-card p-16 text-center shadow-2xl shadow-orange-500/10">
        <Loader2 className="w-16 h-16 text-orange-600 animate-spin mx-auto mb-6" />
        <h2 className="text-2xl font-black text-orange-900 mb-2">Processing Enrollment...</h2>
        <p className="text-gray-500">Authenticating logistics credentials and syncing hub data</p>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="max-w-xl mx-auto glass-card p-12 text-center animate-in zoom-in duration-500 border-orange-100 bg-orange-50/30">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-200">
          <CheckCircle className="w-12 h-12 text-orange-600" />
        </div>
        <h2 className="text-3xl font-black mb-4 tracking-tighter text-orange-900 italic">Trader / Buyer Applied!</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Your application for <strong>{formData.fullName}</strong> as a <strong>Salesman (Trader / Buyer)</strong> at hub <strong>{formData.hubId}</strong> has been received. 
          Status: <span className="text-orange-600 font-bold px-2 py-1 bg-orange-100 rounded-lg">Pending Approval</span>. 
          Our regional manager will reach out for market access verification.
        </p>
        <div className="p-6 bg-white border border-orange-100 rounded-[2rem] flex flex-col items-center shadow-sm">
          <p className="text-[10px] text-orange-400 uppercase font-black tracking-[0.2em] mb-2">Registered User ID</p>
          <p className="font-mono text-xl text-orange-900 font-bold">{salesmanId || "USR-SALES-882"}</p>
        </div>
        <button onClick={() => window.location.href = '/signin'} className="mt-8 text-orange-600 font-bold hover:underline">Back to Login</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-4 mb-12">
        {[1, 2, 3].map(s => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black transition-all ${
              s === step ? 'bg-orange-600 text-white scale-110 shadow-lg' : 
              s < step ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-400'
            }`}>
              {s < step ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 3 && <div className={`w-12 h-1 bg-gray-100 mx-2 rounded-full ${s < step ? 'bg-orange-200' : ''}`} />}
          </div>
        ))}
      </div>

      <div className="glass-card p-10 border-orange-100 shadow-xl relative overflow-hidden">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 animate-shake">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <div>
              <h2 className="text-2xl font-black text-gray-800">Trader / Buyer Identity</h2>
              <p className="text-sm text-gray-400 italic">Enter your professional details for market procurement</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-600/50 ml-1">Full Legal Name *</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:border-orange-400 outline-none transition-all font-bold text-gray-700" placeholder="e.g. Vikram Singh" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-600/50 ml-1">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:border-orange-400 outline-none transition-all font-bold text-gray-700" placeholder="sales@hub.com" />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-600/50 ml-1">Mobile Number *</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" maxLength={10} value={formData.mobile} onChange={e => setFormData({...formData, mobile: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:border-orange-400 outline-none transition-all font-bold text-gray-700" placeholder="10-digit number" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-600/50 ml-1">Assigned Sales Hub ID *</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={formData.hubId} onChange={e => setFormData({...formData, hubId: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:border-orange-400 outline-none transition-all font-bold text-gray-700" placeholder="e.g. TRADER-WEST-01" />
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-600/50 ml-1">Operational Region *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={formData.region} onChange={e => setFormData({...formData, region: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:border-orange-400 outline-none transition-all font-bold text-gray-700" placeholder="Ludhiana & Suburbs" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-600/50 ml-1">Vehicle No. (PB-XX-XXXX)</label>
                <div className="relative">
                  <Car className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" value={formData.vehicleNumber} onChange={e => setFormData({...formData, vehicleNumber: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:border-orange-400 outline-none transition-all font-bold text-gray-700" placeholder="Optional" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
            <div>
              <h2 className="text-2xl font-black text-gray-800">Login Credentials</h2>
              <p className="text-sm text-gray-400 italic">Secure your field procurement access</p>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-orange-600/50 ml-1">Choose Username *</label>
              <input type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 focus:bg-white focus:border-orange-400 outline-none transition-all font-bold text-gray-700" placeholder="e.g. vikram_procure" />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-600/50 ml-1">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    title="Password"
                    aria-label="Password"
                    value={formData.password} 
                    onChange={e => setFormData({...formData, password: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:border-orange-400 outline-none transition-all font-bold text-gray-700" 
                    placeholder="Min 8 chars, 1 Upper, 1 Num" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-orange-600/50 ml-1">Confirm Password *</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input 
                    type="password" 
                    title="Confirm Password"
                    aria-label="Confirm Password"
                    value={formData.confirmPassword} 
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})} 
                    className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 py-4 focus:bg-white focus:border-orange-400 outline-none transition-all font-bold text-gray-700" 
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-300 text-center">
            <div className="mx-auto w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center border border-orange-100">
               <Key className="w-10 h-10 text-orange-600" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800">Verify Identity</h2>
              <p className="text-sm text-gray-400 italic">
                {"We've sent a code to your registered mobile number"}
              </p>
            </div>
            
            {!otpVerified ? (
              <div className="space-y-6">
                <input 
                  type="text" 
                  maxLength={4} 
                  value={otpInput} 
                  onChange={e => setOtpInput(e.target.value)} 
                  className="w-full max-w-xs mx-auto text-4xl font-black tracking-[0.5em] bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl text-center py-6 focus:bg-white focus:border-orange-400 focus:border-solid outline-none transition-all text-orange-600" 
                  placeholder="0000" 
                />
                <button onClick={handleOtpVerify} className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all">
                  Verify OTP Code
                </button>
                <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Demo Bypass: 1234</p>
              </div>
            ) : (
              <div className="p-8 bg-green-50 rounded-[2rem] border border-green-100 flex flex-col items-center">
                <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
                <p className="font-bold text-green-800 uppercase tracking-widest text-xs">Identity Authenticated</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-10 pt-8 border-t border-gray-50 flex justify-between items-center">
          {step > 1 && (
            <button onClick={() => setStep(prev => prev - 1)} className="text-sm font-black text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-all">Back</button>
          )}
          <button onClick={handleNext} disabled={isSubmitting} className="ml-auto px-10 py-5 bg-orange-600 text-white font-black rounded-[2rem] hover:bg-orange-700 active:scale-95 transition-all shadow-xl shadow-orange-600/20 flex items-center gap-2 group disabled:opacity-50">
            {step === 3 ? 'Apply Now' : 'Continue Enrollment'}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
