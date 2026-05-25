"use client";

import Link from 'next/link';

import { useEffect, useState } from 'react';

import { ArrowRight, Handshake, TrendingUp, Users, CheckCircle, ShieldCheck, Droplets, Sprout, Building2, BrainCircuit
} from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
const { t, tObj } = useLanguage(); useEffect(() => { setIsLoggedIn(sessionStorage.getItem('isLoggedIn') === 'true'); }, []);
return ( <div className="flex flex-col gap-20 pb-20"> {/* Hero Section */}
<section className="px-6 max-w-7xl mx-auto flex flex-col items-center text-center pt-20">
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary mb-6 animate-float">
<TrendingUp className="w-4 h-4" />
<span className="text-sm font-medium">{t('hero.tagline')}
</span>
</div>
<h1 className="text-5xl md:text-7xl font-bold mb-8"> {t('hero.title').split('with')[0]}
<br />
<span className="text-gradient">{t('hero.title').split('with')[1] || 'Digital Intelligence'}
</span>
</h1>
<p className="text-xl text-gray-500 max-w-3xl mb-10 leading-relaxed"> {t('hero.subtitle')}
</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          <Link href={isLoggedIn ? "/dashboard" : "/signin?role=farmer"} className="glass-card p-10 group hover:-translate-y-2 transition-all border-secondary/20 hover:bg-secondary/10" >
            <div className="w-16 h-16 bg-secondary/20 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:bg-secondary/40 transition-colors">
              <Sprout className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-gray-800">{t('roles.farmer')}</h3>
            <p className="text-gray-500 mb-8 leading-relaxed italic">
              <span aria-hidden="true">&ldquo;</span>
              {t('signIn.farmer.subtitle')}
              <span aria-hidden="true">&rdquo;</span>
            </p>
            <span className="text-secondary font-black flex items-center gap-2 group-hover:gap-4 transition-all"> 
              {isLoggedIn ? t('hero.goDashboard') : t('hero.getStarted')}
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>

          <Link href={isLoggedIn ? "/business" : "/signin?role=salesman"} className="glass-card p-10 group hover:-translate-y-2 transition-all border-orange-500/20 hover:bg-orange-500/10" >
            <div className="w-16 h-16 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:bg-orange-500/40 transition-colors">
              <Users className="w-8 h-8 text-orange-400" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-gray-800">{t('roles.salesman')}</h3>
            <p className="text-gray-500 mb-8 leading-relaxed italic">
              <span aria-hidden="true">&ldquo;</span>
              {t('signIn.salesman.subtitle')}
              <span aria-hidden="true">&rdquo;</span>
            </p>
            <span className="text-orange-400 font-black flex items-center gap-2 group-hover:gap-4 transition-all"> 
              {isLoggedIn ? t('hero.goDashboard') : t('hero.getStarted')}
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>

          <Link href={isLoggedIn ? "/admin" : "/signin?role=admin"} className="glass-card p-10 group hover:-translate-y-2 transition-all border-primary/20 hover:bg-primary/10" >
            <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-8 shadow-xl group-hover:bg-primary/40 transition-colors">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-black mb-3 text-gray-800">{t('roles.admin')}</h3>
            <p className="text-gray-500 mb-8 leading-relaxed italic">
              <span aria-hidden="true">&ldquo;</span>
              {t('signIn.admin.subtitle')}
              <span aria-hidden="true">&rdquo;</span>
            </p>
            <span className="text-primary font-black flex items-center gap-2 group-hover:gap-4 transition-all"> 
              {isLoggedIn ? t('hero.goDashboard') : t('hero.getStarted')}
              <ArrowRight className="w-5 h-5" />
            </span>
          </Link>
        </div>
</section> {/* Problem & Objectives Section */}
<section className="px-6 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
<div className="glass-card p-10">
<h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
<span className="w-2 h-8 bg-red-500 rounded-full">
</span> {t('problem.title')}
</h2>
<ul className="space-y-4 text-lg text-gray-500">
<li className="flex gap-3">
<CheckCircle className="w-6 h-6 text-red-500 shrink-0" /> {t('problem.item1')}
</li>
<li className="flex gap-3">
<CheckCircle className="w-6 h-6 text-red-500 shrink-0" /> {t('problem.item2')}
</li>
<li className="flex gap-3">
<CheckCircle className="w-6 h-6 text-red-500 shrink-0" /> {t('problem.item3')}
</li>
</ul>
</div>
<div className="glass-card p-10 border-primary/20 bg-primary/5">
<h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
<span className="w-2 h-8 bg-primary rounded-full">
</span> {t('objectives.title')}
</h2>
<div className="flex flex-wrap justify-center gap-8 mt-12 py-8 border-y border-gray-200">
<div className="flex items-center gap-3 text-gray-500">
<CheckCircle className="w-5 h-5 text-primary" />
<span>{t('home.hero.feature1')}
</span>
</div>
<div className="flex items-center gap-3 text-gray-500">
<CheckCircle className="w-5 h-5 text-primary" />
<span>{t('home.hero.feature2')}
</span>
</div>
<div className="flex items-center gap-3 text-gray-500">
<CheckCircle className="w-5 h-5 text-primary" />
<span>{t('home.hero.feature3')}
</span>
</div>
</div>
</div>
</section> {/* Collaboration Models Teaser */}
<section className="px-6 max-w-7xl mx-auto w-full">
<h2 className="text-4xl font-bold mb-12 text-center">{t('collaboration.title')}
</h2>
<div className="grid md:grid-cols-4 gap-6"> {[ { icon: Handshake, ...tObj<{title: string, desc: string}>('collaboration.model1') }, { icon: Users, ...tObj<{title: string, desc: string}>('collaboration.model2') }, { icon: ShieldCheck, ...tObj<{title: string, desc: string}>('collaboration.model3') }, { icon: Droplets, ...tObj<{title: string, desc: string}>('collaboration.model4') } ].map((model, i) => ( <div key={i} className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300">
<model.icon className="w-12 h-12 text-primary mb-6" />
<h3 className="text-xl font-bold mb-3">{model.title}
</h3>
<p className="text-gray-500">{model.desc}
</p>
</div> ))}
</div>
</section>             {/* ML Impact Section */}
      <section className="px-6 max-w-7xl mx-auto w-full">
        <div className="glass-card p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:bg-primary/10 transition-colors duration-700"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <BrainCircuit className="w-5 h-5" />
                <span className="text-sm font-bold uppercase tracking-wider">{t('mlImpact.title')}</span>
              </div>
              <h2 className="text-4xl font-black mb-6 text-gray-800 leading-tight">
                {t('mlDocs.title')}
              </h2>
              <p className="text-xl text-gray-500 mb-8 leading-relaxed">
                {t('mlImpact.desc')}
              </p>
              <Link href="/ml-docs" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-primary text-white font-bold hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/20">
                {t('mlImpact.link')}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="w-full md:w-1/2 grid grid-cols-2 gap-4">
              <div className="glass-card p-6 bg-white/40 backdrop-blur-md border-white/20">
                <h4 className="text-primary font-black text-3xl mb-1">10+</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t('mlDocs.verified.updates')}</p>
              </div>
              <div className="glass-card p-6 bg-white/40 backdrop-blur-md border-white/20 mt-4">
                <h4 className="text-secondary font-black text-3xl mb-1">95%</h4>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">{t('mlDocs.verified.accuracy')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="px-6 max-w-7xl mx-auto w-full mb-20 text-center">
        <h2 className="text-4xl font-bold mb-4">{t('caseStudies.title')}</h2>
        <p className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto">{t('caseStudies.desc')}</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              name: 'Success Project 1', 
              role: 'FPO Support', 
              desc: 'Streamlined sourcing for over 500+ local members across 12 villages.',
              color: 'text-primary'
            },
            { 
              name: 'Success Project 2', 
              role: 'Direct Buy-back', 
              desc: 'Connecting farmers directly to premium retail brands with 20% higher returns.',
              color: 'text-secondary'
            },
            { 
              name: 'Success Project 3', 
              role: 'Yield Optimization', 
              desc: 'Achieved record harvests through precision ML-driven sowing plans.',
              color: 'text-blue-500'
            }
          ].map((study, i) => (
            <div key={i} className="glass-card p-8 group hover:bg-white/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform">
                <CheckCircle className={`w-6 h-6 ${study.color}`} />
              </div>
              <h4 className="text-xl font-bold mb-2">{study.name}</h4>
              <p className={`text-sm font-bold uppercase tracking-widest mb-4 ${study.color}`}>{study.role}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{study.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
