import React from 'react';
import { clsx } from 'clsx';
import { ShieldAlert, Users, Home, Truck, Activity, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { KpiMetric } from '@/data/mockData';

const iconMap = {
  ShieldAlert,
  Users,
  Home,
  Truck,
  Activity,
  Zap,
};

interface KpiCardProps {
  kpi: KpiMetric;
  className?: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ kpi, className }) => {
  const IconComponent = iconMap[kpi.iconName] || Activity;

  const changeColor = {
    positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    negative: 'text-red-400 bg-red-500/10 border-red-500/20',
    neutral: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  }[kpi.changeType];

  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur-md transition-all duration-200 hover:border-slate-700 hover:shadow-cyan-950/20',
        className
      )}
    >
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
          {kpi.label}
        </span>
        <div className="rounded-lg border border-slate-700/60 bg-slate-800/80 p-2 text-cyan-400 shadow-inner group-hover:border-cyan-500/40 group-hover:text-cyan-300">
          <IconComponent className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div className="text-2xl font-extrabold tracking-tight text-white font-mono">
          {kpi.value}
        </div>
        <span
          className={clsx(
            'inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium',
            changeColor
          )}
        >
          {kpi.changeType === 'negative' ? (
            <TrendingUp className="h-3 w-3" />
          ) : kpi.changeType === 'positive' ? (
            <TrendingDown className="h-3 w-3" />
          ) : null}
          {kpi.change}
        </span>
      </div>

      <div className="mt-2 text-xs text-slate-400 border-t border-slate-800/80 pt-2 flex items-center justify-between">
        <span>{kpi.subtext}</span>
        <span className="text-[10px] font-mono text-slate-500">LIVE</span>
      </div>
    </div>
  );
};
