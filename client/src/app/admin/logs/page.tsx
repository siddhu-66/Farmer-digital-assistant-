"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, Terminal, Activity, Database, Globe } from 'lucide-react';
import { logService, SystemLog } from '@/services/logService';

export default function SystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitialLogs = async () => {
      try {
        const data = await logService.getInitialLogs();
        setLogs(data);
      } catch (error) {
        console.error('Failed to fetch initial logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialLogs();
  }, []);

  useEffect(() => {
    if (loading) return;
    const interval = setInterval(() => {
      const nextLog = logService.getNextLog();
      setLogs((prev: SystemLog[]) => [nextLog, ...prev.slice(0, 50)]);
    }, 4000);
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" />
        Back to Admin Panel
      </Link>

      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
          <Settings className="w-10 h-10 text-primary" />
          System Logs
        </h1>
        <p className="text-xl text-gray-500">Real-time infrastructure and security audit logs.</p>
      </header>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden font-mono text-sm shadow-lg">
        <div className="bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" />
              <span className="text-gray-500 text-xs">system_live_stream.log</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 rounded-full border border-green-200">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">Live Stream</span>
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-200"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-200"></div>
            <div className="w-3 h-3 rounded-full bg-green-200"></div>
          </div>
        </div>

        <div ref={scrollRef} className="p-6 space-y-2 h-[500px] overflow-y-auto scroll-smooth bg-gray-50">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4 border-b border-gray-100 pb-2">
              <span className="text-gray-400 shrink-0 font-medium font-mono text-xs">[{log.time}]</span>
              <span className={`font-bold shrink-0 w-20 text-xs italic ${log.color}`}>{log.level}
</span>
              <span className="text-gray-600 leading-relaxed">{log.msg}
</span>
            </div>
          ))}
</div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-8">
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase font-bold tracking-widest">CPU Usage</div>
            <div className="text-xl font-bold text-gray-900">14.2%</div>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Database className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase font-bold tracking-widest">Active DB</div>
            <div className="text-xl font-bold text-gray-900">PostgreSQL Main</div>
          </div>
        </div>
        <div className="glass-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center">
            <Globe className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase font-bold tracking-widest">Active Requests</div>
            <div className="text-xl font-bold text-gray-900">428/sec</div>
          </div>
        </div>
      </div>
    </div>
  );
}