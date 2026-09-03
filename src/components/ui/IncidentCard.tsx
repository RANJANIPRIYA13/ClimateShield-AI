import React from 'react';
import { clsx } from 'clsx';
import { IncidentItem } from '@/data/mockData';
import { StatusBadge } from './StatusBadge';
import { AlertCircle, Clock, MapPin, UserCheck, ShieldAlert } from 'lucide-react';

interface IncidentCardProps {
  incident: IncidentItem;
  onDispatch?: (incident: IncidentItem) => void;
  className?: string;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onDispatch, className }) => {
  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/65 p-5 shadow-lg backdrop-blur-md transition-all hover:border-slate-700 hover:bg-slate-900/85',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md border border-slate-700/80 bg-slate-800 p-1.5 text-red-400">
            <AlertCircle className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[11px] font-mono text-slate-400 font-semibold uppercase tracking-wider">
              {incident.id} • {incident.type}
            </span>
            <h4 className="text-base font-bold text-slate-100 group-hover:text-white">
              {incident.title}
            </h4>
          </div>
        </div>
        <StatusBadge status={incident.priority} size="sm" />
      </div>

      <p className="mt-3 text-xs text-slate-300 leading-relaxed">
        {incident.description}
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2 text-xs border-t border-slate-800/80 pt-3">
        <div className="flex items-center gap-1.5 text-slate-400 truncate">
          <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="truncate">{incident.location}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span>{incident.reportedTime}</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400 truncate col-span-2 mt-1">
          <UserCheck className="h-3.5 w-3.5 text-slate-500 shrink-0" />
          <span className="text-slate-300 font-medium">Assigned: {incident.assignee}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/50">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldAlert className="h-4 w-4 text-cyan-400" />
          <span className="font-mono">{incident.unitsDispatched} Units Dispatched</span>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={incident.status} size="sm" showPulse={false} />
          {onDispatch && (
            <button
              onClick={() => onDispatch(incident)}
              className="rounded-md border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20 hover:border-cyan-400"
            >
              Dispatch Assets
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
