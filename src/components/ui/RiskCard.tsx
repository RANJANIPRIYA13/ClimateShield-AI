import React from 'react';
import { clsx } from 'clsx';
import { RiskItem } from '@/data/mockData';
import { StatusBadge } from './StatusBadge';
import { MapPin, TrendingUp, TrendingDown, Minus, Flame, CloudRain, Sun, Wind, Waves } from 'lucide-react';

interface RiskCardProps {
  risk: RiskItem;
  onSelect?: (risk: RiskItem) => void;
  selected?: boolean;
  className?: string;
}

export const RiskCard: React.FC<RiskCardProps> = ({ risk, onSelect, selected, className }) => {
  const getCategoryIcon = (cat: RiskItem['category']) => {
    switch (cat) {
      case 'Flood': return CloudRain;
      case 'Heatwave': return Sun;
      case 'Hurricane': return Wind;
      case 'Wildfire': return Flame;
      case 'Storm Surge': return Waves;
      default: return CloudRain;
    }
  };

  const CategoryIcon = getCategoryIcon(risk.category);

  return (
    <div
      onClick={() => onSelect?.(risk)}
      className={clsx(
        'group relative cursor-pointer overflow-hidden rounded-xl border p-5 transition-all duration-200 backdrop-blur-md',
        selected
          ? 'border-cyan-500/80 bg-slate-900/90 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-500/40'
          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/80',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg border border-slate-700/60 bg-slate-800/90 p-2 text-amber-400 group-hover:text-amber-300">
            <CategoryIcon className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-semibold tracking-wider text-cyan-400 uppercase font-mono">
              {risk.category} • {risk.id}
            </span>
            <h4 className="text-base font-bold text-slate-100 group-hover:text-white">
              {risk.title}
            </h4>
          </div>
        </div>
        <StatusBadge status={risk.severity} size="sm" />
      </div>

      <p className="mt-3 text-xs leading-relaxed text-slate-400 line-clamp-2">
        {risk.description}
      </p>

      {/* Location & Population */}
      <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          <span className="truncate">{risk.location}</span>
        </div>
        <span className="shrink-0 font-mono text-[11px] text-slate-400">
          {(risk.affectedPopulation / 1000).toFixed(1)}k pop
        </span>
      </div>

      {/* Probability bar and impact score */}
      <div className="mt-4 space-y-2 border-t border-slate-800/80 pt-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Threat Probability:</span>
          <span className="font-bold text-amber-400">{risk.probability}%</span>
        </div>
        
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-500',
              risk.probability > 80
                ? 'bg-gradient-to-r from-amber-500 to-red-500'
                : risk.probability > 50
                ? 'bg-gradient-to-r from-cyan-500 to-amber-500'
                : 'bg-emerald-500'
            )}
            style={{ width: `${risk.probability}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <div className="flex items-center gap-1">
            <span>Trend:</span>
            {risk.trend === 'increasing' && <TrendingUp className="h-3.5 w-3.5 text-red-400" />}
            {risk.trend === 'decreasing' && <TrendingDown className="h-3.5 w-3.5 text-emerald-400" />}
            {risk.trend === 'stable' && <Minus className="h-3.5 w-3.5 text-slate-400" />}
            <span className="capitalize text-slate-300">{risk.trend}</span>
          </div>
          <span className="font-mono text-slate-500">Impact Score: {risk.impactScore}/10</span>
        </div>
      </div>
    </div>
  );
};
