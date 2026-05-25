"use client";

/**
 * CropMLForm — Farmer Crop Quality & Price Predictor (Light Theme)
 * ====================================================
 * Farmer fills in crop details → clicks Analyse →
 * Backend calls Flask ML API → Shows quality + price prediction.
 */

import React, { useState, useEffect } from "react";
import {
  Leaf, FlaskConical, AlertTriangle, CheckCircle2,
  Loader2, ChevronDown, BarChart3, IndianRupee, Clock, Droplets,
  Star, Zap, ArrowLeft
} from "lucide-react";
import { apiClient } from "@/lib/apiClient";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ── Types ─────────────────────────────────────────────────────────────────────
interface FormData {
  cropName:      string;
  moisture:      number;
  size:          "Small" | "Medium" | "Large";
  colorScore:    number;
  freshnessDays: number;
  damagePercent: number;
  marketDemand:  "Low" | "Medium" | "High";
  marketPrice:   number | "";
}

interface PredictionResult {
  quality:        "Low" | "Medium" | "High";
  predictedPrice: number;
  finalPrice:     number;
  marketPrice:    number | null;
}

const CROPS = ["Wheat", "Rice", "Tomato", "Onion", "Potato", "Cotton", "Maize",
               "Sugarcane", "Soybean", "Mustard", "Barley", "Other"];

const QUALITY_CONFIG = {
  High:   { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-500", icon: "🌟", label: "Premium Grade" },
  Medium: { bg: "bg-amber-50",   border: "border-amber-200",   text: "text-amber-700",   badge: "bg-amber-500",   icon: "✅", label: "Standard Grade" },
  Low:    { bg: "bg-red-50",     border: "border-red-200",     text: "text-red-700",     badge: "bg-red-500",     icon: "⚠️", label: "Below Standard" },
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function CropMLForm() {
  const { role } = useAuth();
  const router   = useRouter();

  const [form, setForm] = useState<FormData>({
    cropName:      "Wheat",
    moisture:      14,
    size:          "Medium",
    colorScore:    7,
    freshnessDays: 5,
    damagePercent: 3,
    marketDemand:  "Medium",
    marketPrice:   "",
  });

  const [loading,    setLoading]    = useState(false);
  const [result,     setResult]     = useState<PredictionResult | null>(null);
  const [error,      setError]      = useState<string | null>(null);
  const [savedId,    setSavedId]    = useState<string | null>(null);

  // Redirect non-farmers
  useEffect(() => {
    if (role && role !== "farmer") {
      router.push("/dashboard");
    }
  }, [role, router]);

  const update = (key: keyof FormData, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setSavedId(null);

    try {
      const payload = {
        ...form,
        moisture:      Number(form.moisture),
        colorScore:    Number(form.colorScore),
        freshnessDays: Number(form.freshnessDays),
        damagePercent: Number(form.damagePercent),
        ...(form.marketPrice !== "" ? { marketPrice: Number(form.marketPrice) } : {}),
      };

      const res = await apiClient.post<{
        success: boolean;
        data: { _id: string; quality: string; predictedPrice: number; finalPrice: number; marketPrice: number | null };
        mlError?: string;
      }>("/crops/predict", payload);

      if (res.success && res.data) {
        setResult({
          quality:        res.data.quality as "Low" | "Medium" | "High",
          predictedPrice: res.data.predictedPrice,
          finalPrice:     res.data.finalPrice,
          marketPrice:    res.data.marketPrice,
        });
        setSavedId(res.data._id);
        if (res.mlError) {
          setError(`⚠️ ${res.mlError} — record saved without prediction.`);
        }
      } else {
        setError((res as any).message || "Prediction failed. Please try again.");
      }
    } catch (err: unknown) {
      console.error(`[Frontend] Crop ML Analysis Error:`, err);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const qConfig = result ? QUALITY_CONFIG[result.quality] : null;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/farmer" className="inline-flex items-center gap-2 text-xs font-black text-gray-500 hover:text-gray-900 transition-colors mb-8 uppercase tracking-widest">
           <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>

        {/* ── Header ────────────────────────────────────────────────────────── */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-green-100 border border-green-200 mb-6">
            <FlaskConical className="w-5 h-5 text-green-700" />
            <span className="text-sm font-black uppercase tracking-widest text-green-700">
              ML-Powered Analysis
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-3">
            🌾 Crop Quality Predictor
          </h1>
          <p className="text-gray-600 text-sm max-w-lg mx-auto font-medium">
            Enter your crop details below. Our AI model will instantly predict
            quality grade and estimated selling price.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* ── Form ────────────────────────────────────────────────────────── */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-6 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm"
          >
            <h2 className="text-lg font-black uppercase tracking-widest text-gray-900 flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" /> Crop Details
            </h2>

            {/* Crop Name */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                Crop Name *
              </label>
              <div className="relative">
                <select
                  title="Crop Name"
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold appearance-none focus:border-green-500 focus:outline-none transition-all shadow-sm"
                  value={form.cropName}
                  onChange={(e) => update("cropName", e.target.value)}
                  required
                >
                  {CROPS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Moisture + Size */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1 block">
                  <Droplets className="w-3 h-3 text-blue-500" /> Moisture %
                </label>
                <input
                  type="number" min={0} max={100} step={0.5} required
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold focus:border-green-500 focus:outline-none transition-all shadow-sm"
                  value={form.moisture}
                  onChange={(e) => update("moisture", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                  Crop Size *
                </label>
                <div className="relative">
                  <select
                    title="Crop Size"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold appearance-none focus:border-green-500 focus:outline-none transition-all shadow-sm"
                    value={form.size}
                    onChange={(e) => update("size", e.target.value)}
                    required
                  >
                    {["Small", "Medium", "Large"].map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Color Score + Freshness */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1 block">
                  <Star className="w-3 h-3 text-yellow-500" /> Colour Score (1–10)
                </label>
                <input
                  type="number" min={1} max={10} required
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold focus:border-green-500 focus:outline-none transition-all shadow-sm"
                  value={form.colorScore}
                  onChange={(e) => update("colorScore", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1 block">
                  <Clock className="w-3 h-3 text-purple-500" /> Days Since Harvest
                </label>
                <input
                  type="number" min={0} required
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold focus:border-green-500 focus:outline-none transition-all shadow-sm"
                  value={form.freshnessDays}
                  onChange={(e) => update("freshnessDays", e.target.value)}
                />
              </div>
            </div>

            {/* Damage + Market Demand */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                  Damage % (0–100)
                </label>
                <input
                  type="number" min={0} max={100} step={0.5} required
                  className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold focus:border-green-500 focus:outline-none transition-all shadow-sm"
                  value={form.damagePercent}
                  onChange={(e) => update("damagePercent", e.target.value)}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 block">
                  Market Demand *
                </label>
                <div className="relative">
                  <select
                    title="Market Demand"
                    className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold appearance-none focus:border-green-500 focus:outline-none transition-all shadow-sm"
                    value={form.marketDemand}
                    onChange={(e) => update("marketDemand", e.target.value)}
                    required
                  >
                    {["Low", "Medium", "High"].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Optional Market Price */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2 flex items-center gap-1 block">
                <IndianRupee className="w-3 h-3 text-green-600" />
                Current Market Price (₹/qtl) — <span className="text-gray-400 normal-case font-medium">Optional</span>
              </label>
              <input
                type="number" min={0} placeholder="e.g. 2000"
                className="w-full bg-white border border-gray-200 rounded-2xl px-5 py-3.5 text-gray-900 font-bold focus:border-green-500 focus:outline-none transition-all shadow-sm"
                value={form.marketPrice}
                onChange={(e) => update("marketPrice", e.target.value)}
              />
              <p className="text-[10px] text-gray-400 mt-1.5 tracking-wider">
                If provided: Final Price = (ML Price + Market Price) ÷ 2
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-green-600 hover:bg-green-700 active:scale-95 text-white font-black rounded-2xl text-sm uppercase tracking-widest shadow-lg shadow-green-600/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analysing Crop…</>
              ) : (
                <><Zap className="w-5 h-5" /> Analyse with AI</>
              )}
            </button>
          </form>

          {/* ── Result Panel ─────────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-4">

            {/* Placeholder when no result yet */}
            {!result && !error && !loading && (
              <div className="h-full min-h-[400px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-center p-8 gap-4 bg-white/50">
                <BarChart3 className="w-12 h-12 text-gray-300" />
                <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">
                  Fill the form &amp; click &quot;Analyse&quot;
                </p>
                <p className="text-gray-400 text-xs">
                  Results will appear here
                </p>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div className="h-full min-h-[400px] border border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-5 bg-white shadow-sm">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-green-200 animate-ping absolute inset-0" />
                  <FlaskConical className="w-10 h-10 text-green-600 animate-pulse relative" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-black uppercase tracking-widest text-gray-900">ML Model Running</p>
                  <p className="text-xs text-gray-500 mt-1">Analysing features…</p>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="p-5 bg-red-50 border border-red-200 rounded-2xl flex gap-3 shadow-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">{error}</p>
              </div>
            )}

            {/* ML Result */}
            {result && qConfig && (
              <div className={`rounded-3xl border-2 ${qConfig.border} ${qConfig.bg} p-8 space-y-6 shadow-sm animate-in fade-in zoom-in-95 duration-500`}>

                {/* Quality Badge */}
                <div className="text-center">
                  <span className="text-5xl">{qConfig.icon}</span>
                  <div className="mt-3">
                    <span className={`inline-block px-5 py-2 ${qConfig.badge} text-white text-xs font-black uppercase tracking-widest rounded-full shadow-sm`}>
                      {result.quality} Quality
                    </span>
                    <p className={`text-sm font-bold mt-2 ${qConfig.text}`}>{qConfig.label}</p>
                  </div>
                </div>

                <hr className="border-black/5" />

                {/* Price Breakdown */}
                <div className="space-y-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                    Price Estimate (₹/qtl)
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">ML Predicted</span>
                      <span className="text-xl font-black text-gray-900">₹{result.predictedPrice.toLocaleString()}</span>
                    </div>

                    {result.marketPrice && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Market Price</span>
                        <span className="text-xl font-black text-gray-900">₹{Number(result.marketPrice).toLocaleString()}</span>
                      </div>
                    )}

                    <div className={`flex justify-between items-center pt-3 border-t border-black/5`}>
                      <span className="text-xs font-black uppercase tracking-widest text-green-700">
                        {result.marketPrice ? "Final Price" : "Best Estimate"}
                      </span>
                      <span className={`text-3xl font-black ${qConfig.text}`}>
                        ₹{result.finalPrice.toLocaleString()}
                      </span>
                    </div>
                    {result.marketPrice && (
                      <p className="text-[10px] text-gray-500 text-right">
                        (ML + Market) ÷ 2
                      </p>
                    )}
                  </div>
                </div>

                {/* Saved confirmation */}
                {savedId && (
                  <div className="flex items-center justify-center gap-2 text-xs text-green-700 font-bold bg-green-100/50 py-2 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                    Saved for admin review (ID: …{savedId.slice(-6)})
                  </div>
                )}

                <p className="text-[10px] text-gray-500 text-center italic">
                  An admin will review and approve this submission before it goes live.
                </p>
              </div>
            )}

            {/* How it works */}
            <div className="p-5 bg-white border border-gray-200 shadow-sm rounded-2xl space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                How ML Works
              </h3>
              {[
                ["🌲", "RandomForest Classifier", "Predicts quality grade"],
                ["📈", "RandomForest Regressor", "Estimates selling price"],
                ["⚖️",  "Price Averaging", "Blends ML + market price"],
              ].map(([icon, title, desc]) => (
                <div key={title} className="flex gap-3">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{title}</p>
                    <p className="text-[10px] text-gray-500">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}