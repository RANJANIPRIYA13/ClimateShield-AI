import React from 'react';
import { clsx } from 'clsx';
import { ShieldCheck, LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Incidents Detected',
  description = 'Current sector scan indicates nominal atmospheric and structural status.',
  icon: Icon = ShieldCheck,
  actionText,
  onAction,
  className
}) => {
  return (
    <div
      className={clsx(
        'flex min-h-[240px] w-full flex-col items-center justify-center rounded-xl border border-slate-800/80 bg-slate-900/40 p-8 text-center backdrop-blur-md',
        className
      )}
    >
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 text-cyan-400 mb-3 shadow-inner">
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-sm font-bold text-slate-200">{title}</h3>
      <p className="mt-1 text-xs text-slate-400 max-w-md">{description}</p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-1.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
