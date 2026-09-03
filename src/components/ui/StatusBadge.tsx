import React from 'react';
import { clsx } from 'clsx';

export type StatusType = 
  | 'Critical' | 'Warning' | 'Advisory' | 'Safe'
  | 'In Progress' | 'Dispatched' | 'Unassigned' | 'Resolved'
  | 'Open' | 'Full' | 'Standby' | 'Closed'
  | 'Ready' | 'Deployed' | 'Maintenance' | 'Depleted';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showPulse = true,
  className
}) => {
  const getBadgeStyle = (statusVal: string) => {
    switch (statusVal) {
      case 'Critical':
      case 'Depleted':
      case 'Full':
        return {
          bg: 'bg-red-500/10 border-red-500/30 text-red-400',
          dot: 'bg-red-500',
          glow: 'shadow-[0_0_10px_rgba(239,68,68,0.3)]'
        };
      case 'Warning':
      case 'In Progress':
      case 'Maintenance':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30 text-amber-400',
          dot: 'bg-amber-500',
          glow: 'shadow-[0_0_10px_rgba(245,158,11,0.2)]'
        };
      case 'Advisory':
      case 'Dispatched':
      case 'Standby':
        return {
          bg: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
          dot: 'bg-cyan-400',
          glow: 'shadow-[0_0_10px_rgba(6,182,212,0.2)]'
        };
      case 'Safe':
      case 'Resolved':
      case 'Open':
      case 'Ready':
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
          dot: 'bg-emerald-400',
          glow: 'shadow-[0_0_10px_rgba(16,185,129,0.2)]'
        };
      case 'Unassigned':
      case 'Closed':
      default:
        return {
          bg: 'bg-slate-500/10 border-slate-600/40 text-slate-400',
          dot: 'bg-slate-400',
          glow: ''
        };
    }
  };

  const style = getBadgeStyle(status);

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 space-x-1.5',
    md: 'text-xs px-2.5 py-1 space-x-2 font-medium',
    lg: 'text-sm px-3.5 py-1.5 space-x-2.5 font-semibold'
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-md border tracking-wide transition-all uppercase',
        style.bg,
        style.glow,
        sizeClasses[size],
        className
      )}
    >
      <span className="relative flex h-2 w-2 items-center justify-center">
        {showPulse && (status === 'Critical' || status === 'In Progress' || status === 'Open') && (
          <span
            className={clsx(
              'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
              style.dot
            )}
          />
        )}
        <span className={clsx('relative inline-flex h-1.5 w-1.5 rounded-full', style.dot)} />
      </span>
      <span>{status}</span>
    </span>
  );
};
