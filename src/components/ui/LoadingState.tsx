import React from 'react';
import { clsx } from 'clsx';
import { Activity, Compass } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Synchronizing tactical climate data stream...',
  className
}) => {
  return (
    <div
      className={clsx(
        'flex min-h-[240px] w-full flex-col items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/40 p-8 text-center backdrop-blur-md',
        className
      )}
    >
      <div className="relative flex items-center justify-center mb-4">
        <div className="h-14 w-14 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin" />
        <Compass className="absolute h-6 w-6 text-cyan-400 animate-pulse" />
      </div>
      <div className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
        EOC Telemetry Loading
      </div>
      <p className="text-xs text-slate-400 max-w-sm">{message}</p>
    </div>
  );
};
