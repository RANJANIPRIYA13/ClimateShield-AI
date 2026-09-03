import React from 'react';
import { clsx } from 'clsx';
import { ShelterItem } from '@/data/mockData';
import { StatusBadge } from './StatusBadge';
import { Home, MapPin, Phone, CheckCircle2, Navigation } from 'lucide-react';

import { ShelterEntity } from '@/lib/db/types';

interface ShelterCardProps {
  shelter: ShelterItem | ShelterEntity | any;
  onNavigate?: (shelter: any) => void;
  className?: string;
}

export const ShelterCard: React.FC<ShelterCardProps> = ({ shelter, onNavigate, className }) => {
  const occupancyPercentage = Math.round((shelter.occupancy / shelter.capacity) * 100);
  const distance = shelter.distanceKm ?? 0.8;

  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/65 p-5 shadow-lg backdrop-blur-md transition-all hover:border-slate-700 hover:bg-slate-900/85',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg border border-slate-700/60 bg-slate-800 p-2 text-emerald-400 group-hover:text-emerald-300">
            <Home className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-100 group-hover:text-white">
              {shelter.name}
            </h4>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
              <span className="truncate">{shelter.address}</span>
            </div>
          </div>
        </div>
        <StatusBadge status={shelter.status} size="sm" />
      </div>

      {/* Occupancy meter */}
      <div className="mt-4 space-y-1.5 border-t border-slate-800/80 pt-3">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">Occupancy Capacity:</span>
          <span className="font-bold text-slate-200">
            {shelter.occupancy} / {shelter.capacity} ({occupancyPercentage}%)
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={clsx(
              'h-full rounded-full transition-all duration-500',
              occupancyPercentage >= 100
                ? 'bg-red-500'
                : occupancyPercentage > 75
                ? 'bg-amber-500'
                : 'bg-emerald-500'
            )}
            style={{ width: `${Math.min(occupancyPercentage, 100)}%` }}
          />
        </div>
      </div>

      {/* Facilities tags */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {shelter.facilities?.map((fac: string) => (
          <span
            key={fac}
            className="inline-flex items-center gap-1 rounded bg-slate-800/80 border border-slate-700/50 px-2 py-0.5 text-[11px] text-slate-300"
          >
            <CheckCircle2 className="h-3 w-3 text-cyan-400" />
            {fac}
          </span>
        ))}
      </div>

      {/* Footer details */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
        <div className="flex items-center gap-1">
          <Phone className="h-3.5 w-3.5 text-slate-500" />
          <span>{shelter.contactPhone}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-cyan-400 font-semibold">{distance} km away</span>
          {onNavigate && (
            <button
              onClick={() => onNavigate(shelter)}
              className="inline-flex items-center gap-1 rounded border border-cyan-500/40 bg-cyan-500/10 px-2.5 py-1 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20"
            >
              <Navigation className="h-3 w-3" />
              Route
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
