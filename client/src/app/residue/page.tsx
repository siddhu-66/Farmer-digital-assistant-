"use client";

import Sidebar from "@/components/layout/Sidebar";
import FarmerGuard from "@/components/auth/FarmerGuard";
import { useLanguage } from "@/context/LanguageContext";
import {
  Trash2,
  Scale,
  Zap,
  Settings,
  AlertCircle,
  FlaskConical,
  Microscope,
  Leaf,
  ChevronRight,
  X,
  Building,
  MapPin,
  ExternalLink,
  Milestone,
} from "lucide-react";
import { useState, useEffect } from "react";
import { partnerService } from "@/services/partnerService";

interface Partner {
  id: string;
  name: string;
  type: string;
  location: string;
  distance: number;
  accepts: string;
}

const fallbackPartners: Partner[] = [
  {
    id: "1",
    name: "EcoEnergy Bio-Refinery",
    type: "Bio-Refinery",
    location: "Khanna",
    distance: 4.2,
    accepts: "Wheat Straw",
  },
  {
    id: "2",
    name: "Punjab Cattle Feed Co.",
    type: "Feed Processor",
    location: "Sahnewal",
    distance: 7.8,
    accepts: "Maize Stover",
  },
];

export default function ResidueManagement() {
  const { t, tObj } = useLanguage();
  const [showPartners, setShowPartners] = useState(false);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      setLoading(true);
      try {
        const data = await partnerService.getNearbyPartners();
        if (Array.isArray(data) && data.length > 0) {
          setPartners(
            data.map((p: any) => ({
              id: p._id || p.id,
              name: p.name,
              type: p.type,
              location: p.location,
              distance: p.distance,
              accepts: Array.isArray(p.accepts) ? p.accepts.join(", ") : String(p.accepts || ""),
            }))
          );
        } else {
          setPartners(fallbackPartners);
        }
      } catch (error) {
        console.error("Failed to fetch partners:", error);
        setPartners(fallbackPartners);
      } finally {
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  const conversionMethods = [
    { title: t("residue.methods.physical.title"), desc: t("residue.methods.physical.desc"), impact: t("residue.methods.physical.impact"), icon: Settings, color: "text-blue-400" },
    { title: t("residue.methods.chemical.title"), desc: t("residue.methods.chemical.desc"), impact: t("residue.methods.chemical.impact"), icon: FlaskConical, color: "text-purple-400" },
    { title: t("residue.methods.biological.title"), desc: t("residue.methods.biological.desc"), impact: t("residue.methods.biological.impact"), icon: Microscope, color: "text-green-400" },
    { title: t("residue.methods.fortification.title"), desc: t("residue.methods.fortification.desc"), impact: t("residue.methods.fortification.impact"), icon: Zap, color: "text-orange-400" },
  ];

  return (
    <FarmerGuard>
      <div className="flex bg-[var(--theme-bg)] min-h-screen">
        <Sidebar />
        <main className="flex-1 main-content-shifted p-8 pt-10">
          <header className="mb-10">
            <h1 className="text-4xl font-bold mb-2">{t("residue.title")}</h1>
            <p className="text-gray-500">{t("residue.subtitle")}</p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="grid md:grid-cols-2 gap-6">
                {conversionMethods.map((method, i) => (
                  <div key={i} className="glass-card p-8 hover:border-primary/40 transition-all group">
                    <div className={`w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${method.color}`}>
                      <method.icon className="w-6 h-6" />
                    </div>
                    <div className="flex border-b border-gray-200 p-4 items-center justify-between text-sm group-hover:bg-gray-50 transition-colors">
                      <span className="text-gray-500">{t("data.maize")}</span>
                      <span className="font-bold">18 t/ha</span>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{method.title}</h3>
                    <p className="text-gray-500 text-sm mb-4 leading-relaxed">{method.desc}</p>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-1">{t("residue.benefitLabel")}</p>
                      <p className="text-sm font-medium text-gray-500">{method.impact}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <Trash2 className="w-6 h-6 text-red-400" /> {t("residue.dashboardTitle")}
                </h2>
                <div className="space-y-6">
                  {[
                    { residue: `${t("data.wheat")} ${t("residue.methods.physical.desc").split(" ")[0]}`, source: "5 Acres Harvest", status: "Ready for Urea Treatment", action: t("residue.processNow") },
                    { residue: "Maize Stover", source: "Sec B", status: "Collected & Chopped", action: t("residue.addFortification") },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border border-gray-200">
                      <div>
                        <p className="text-lg font-bold">{item.residue}</p>
                        <p className="text-sm text-gray-500">{item.source} • {item.status}</p>
                      </div>
                      <button className="text-primary font-bold flex items-center gap-1 group">
                        {item.action}
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="glass-card p-6 bg-primary/5 border-primary/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" /> {t("residue.whyTitle")}
                </h3>
                <ul className="space-y-4">
                  {tObj<string[]>("residue.whyItems").map((txt, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      {txt}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="glass-card p-6 border-red-500/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" /> {t("residue.challengesTitle")}
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-500">{t("residue.challenges.nutritional.title")}</p>
                    <p className="text-xs text-gray-500 italic">{t("residue.challenges.nutritional.desc")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-500">{t("residue.challenges.logistics.title")}</p>
                    <p className="text-xs text-gray-500 italic">{t("residue.challenges.logistics.desc")}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-500">{t("residue.challenges.awareness.title")}</p>
                    <p className="text-xs text-gray-500 italic">{t("residue.challenges.awareness.desc")}</p>
                  </div>
                </div>
              </div>

              <div className="glass-card p-6 border-accent/20">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Scale className="w-5 h-5 text-accent" /> {t("residue.industrialTitle")}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed">{t("residue.industrialDesc")}</p>
                <button
                  onClick={() => setShowPartners(true)}
                  className="w-full mt-6 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all font-inter"
                >
                  {t("residue.findPartners")}
                </button>
              </div>
            </div>
          </div>

          {showPartners && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pb-20">
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowPartners(false)} />
              <div className="glass-card p-8 max-w-2xl w-full relative z-10 animate-in fade-in zoom-in duration-300 border-accent/30">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold flex items-center gap-3 text-accent">
                      <Milestone className="w-7 h-7" /> {t("residue.partnersModal.title")}
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">{t("residue.partnersModal.subtitle")}</p>
                  </div>
                  <button
                    onClick={() => setShowPartners(false)}
                    title={t("residue.partnersModal.close")}
                    className="text-gray-500 hover:text-gray-500 transition-colors p-2 hover:bg-gray-50 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <div className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full animate-spin" />
                      <p className="text-gray-500 text-sm font-medium">Scanning for local partners...</p>
                    </div>
                  ) : partners.length > 0 ? (
                    partners.map((p, i) => (
                      <div key={p.id || i} className="p-5 bg-gray-50 rounded-2xl border border-gray-200 hover:border-accent/30 transition-all group">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                              <MapPin className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                              <h4 className="font-bold text-lg">{p.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs px-2 py-0.5 bg-accent/20 text-accent rounded-md font-bold uppercase tracking-wider">{p.type}</span>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Milestone className="w-3 h-3" /> {p.distance} {t("residue.partnersModal.distance")}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mt-2 font-medium">
                                {t("residue.partnersModal.accepts")}: {p.accepts}
                              </p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-accent text-black text-xs font-bold rounded-lg hover:bg-accent-light transition-all flex items-center gap-2 shrink-0">
                            {t("residue.partnersModal.connect")}
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <Building className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                      <p className="text-gray-500">No industrial partners found in your region yet.</p>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setShowPartners(false)}
                  className="w-full py-4 glass-button font-bold border-accent/30 hover:bg-accent/10 transition-all rounded-2xl"
                >
                  {t("residue.partnersModal.close")}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </FarmerGuard>
  );
}
