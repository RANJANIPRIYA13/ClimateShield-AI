import React from 'react';
import { clsx } from 'clsx';
import { ResourceItem } from '@/data/mockData';
import { StatusBadge } from './StatusBadge';
import { Truck, Wrench, MapPin, Calendar } from 'lucide-react';

interface ResourceCardProps {
  resource: ResourceItem;
  className?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, className }) => {
  const availabilityPct = Math.round((resource.availableUnits / resource.totalUnits) * 100);

  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/65 p-5 shadow-lg backdrop-blur-md transition-all hover:border-slate-700 hover:bg-slate-900/85',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg border border-slate-700/60 bg-slate-800 p-2 text-cyan-400 group-hover:text-cyan-300">
            <Truck className="h-5 w-5" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              {resource.category}
            </span>
            <h4 className="text-base font-bold text-slate-100 group-hover:text-white">
              {resource.name}
            </h4>
          </div>
        </div>
        <StatusBadge status={resource.status} size="sm" />
      </div>

      <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Readiness & Deployment:</span>
          <span className="font-bold text-slate-200">
            {resource.availableUnits} / {resource.totalUnits} Units Available ({availabilityPct}%)
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-500',
              availabilityPct > 60
                ? 'bg-emerald-500'
                : availabilityPct > 30
                ? 'bg-amber-500'
                : 'bg-red-500'
            )}
            style={{ width: `${availabilityPct}%` }}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-slate-800/80 pt-3 text-slate-400">
        <div className="flex items-center gap-1.5 truncate">
          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{resource.depotLocation}</span>
        </div>

        <div className="flex items-center gap-1.5 truncate">
          <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">Maint: {resource.lastMaintenance}</span>
        </div>
      </div>
    </div>
  );
};
