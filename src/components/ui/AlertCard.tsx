import React from 'react';
import { clsx } from 'clsx';
import { AlertItem } from '@/data/mockData';
import { StatusBadge } from './StatusBadge';
import { AlertTriangle, Clock, Radio, ShieldAlert } from 'lucide-react';

interface AlertCardProps {
  alert: AlertItem;
  onAcknowledge?: (alert: AlertItem) => void;
  className?: string;
}

export const AlertCard: React.FC<AlertCardProps> = ({ alert, onAcknowledge, className }) => {
  return (
    <div
      className={clsx(
        'group relative overflow-hidden rounded-xl border p-5 shadow-xl backdrop-blur-md transition-all duration-200',
        alert.level === 'Critical'
          ? 'border-red-500/40 bg-red-950/20 hover:border-red-500/70'
          : alert.level === 'Warning'
          ? 'border-amber-500/40 bg-amber-950/20 hover:border-amber-500/70'
          : 'border-cyan-500/40 bg-slate-900/70 hover:border-cyan-500/70',
        className
      )}
    >
      {/* Glow highlight */}
      <div
        className={clsx(
          'absolute -left-1 top-0 bottom-0 w-1.5',
          alert.level === 'Critical'
            ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.8)]'
            : alert.level === 'Warning'
            ? 'bg-amber-500'
            : 'bg-cyan-500'
        )}
      />

      <div className="flex items-start justify-between gap-3 pl-2">
        <div className="flex items-center gap-2">
          <AlertTriangle
            className={clsx(
              'h-5 w-5 shrink-0',
              alert.level === 'Critical' ? 'text-red-400 animate-pulse' : 'text-amber-400'
            )}
          />
          <div>
            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
              {alert.id} • {alert.issuer}
            </span>
            <h4 className="text-base font-bold text-white leading-snug">
              {alert.headline}
            </h4>
          </div>
        </div>
        <StatusBadge status={alert.level} size="sm" />
      </div>

      {/* Action Required Box */}
      <div className="mt-3 ml-2 rounded-lg border border-slate-800 bg-slate-950/60 p-3.5 text-xs text-slate-200">
        <div className="flex items-center gap-1.5 font-semibold text-amber-400 mb-1">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>ACTION REQUIRED:</span>
        </div>
        <p className="leading-relaxed text-slate-300">{alert.actionRequired}</p>
      </div>

      {/* Affected Zones */}
      <div className="mt-3 ml-2 flex flex-wrap items-center gap-1 text-xs text-slate-400">
        <span className="font-mono text-slate-500">ZONES:</span>
        {alert.affectedZones.map((zone) => (
          <span
            key={zone}
            className="rounded bg-slate-800/80 border border-slate-700/60 px-2 py-0.5 text-[11px] text-slate-300"
          >
            {zone}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 ml-2 flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-slate-400">
            <Clock className="h-3.5 w-3.5 text-slate-500" />
            {alert.issuedAt}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <Radio className="h-3.5 w-3.5 text-cyan-400" />
            {alert.broadcastChannels.join(', ')}
          </span>
        </div>

        {onAcknowledge && (
          <button
            onClick={() => onAcknowledge(alert)}
            className="rounded-md border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
          >
            Acknowledge Alert
          </button>
        )}
      </div>
    </div>
  );
};
