import React from 'react';
import { clsx } from 'clsx';
import { AlertOctagon, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Sensor Stream Interrupted',
  message = 'Failed to fetch live satellite telemetry feed. Connection timed out.',
  onRetry,
  className
}) => {
  return (
    <div
      className={clsx(
        'flex min-h-[240px] w-full flex-col items-center justify-center rounded-xl border border-red-500/30 bg-red-950/10 p-8 text-center backdrop-blur-md',
        className
      )}
    >
      <div className="rounded-xl border border-red-500/40 bg-red-900/20 p-3 text-red-400 mb-3">
        <AlertOctagon className="h-8 w-8" />
      </div>
      <h3 className="text-sm font-bold text-red-300">{title}</h3>
      <p className="mt-1 text-xs text-slate-400 max-w-md">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-1.5 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-1.5 text-xs font-semibold text-red-300 transition-all hover:bg-red-500/20"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
};
