import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  subValue?: string;
}

export default function DashboardCard({ title, value, icon, trend, trendUp, subValue }: DashboardCardProps) {
  return (
    <div className="glass-card p-6 flex flex-col gap-4 hover:border-primary/50 transition-colors group">
      <div className="flex items-center justify-between">
        <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
          {icon}
</div>
        {trend && (
          <span className={`text-sm font-semibold px-2 py-1 rounded-full ${trendUp ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
            {trend}
</span>
        )}
</div>
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}
</p>
        <h3 className="text-3xl font-bold mt-1 text-gray-900">{value}
</h3>
        {subValue && <p className="text-xs text-primary mt-1 font-medium">{subValue}
</p>}
</div>
    </div>
  );
}