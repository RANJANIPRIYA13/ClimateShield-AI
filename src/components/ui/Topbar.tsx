'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Bell, Search, Menu, Clock, Radio, ShieldAlert } from 'lucide-react';
import { MOCK_ALERTS } from '@/data/mockData';

import { Bot } from 'lucide-react';
import { CopilotDrawer } from './CopilotDrawer';

interface TopbarProps {
  onMobileToggle?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onMobileToggle }) => {
  const pathname = usePathname();
  const [timeString, setTimeString] = useState<string>('');
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [showCopilot, setShowCopilot] = useState<boolean>(false);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }) + ' UTC+5.5'
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/': return 'Global Command & Platform Gateway';
      case '/citizen': return 'Citizen Safety & Neighborhood Disaster Portal';
      case '/authority': return 'Emergency Operations Command Center (EOC)';
      case '/demo': return 'Interactive Disaster Simulation Engine';
      default: return 'ClimateShield Operations';
    }
  };

  const criticalAlertsCount = MOCK_ALERTS.filter(a => a.level === 'Critical').length;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 lg:px-6 backdrop-blur-xl">
      {/* Left: Mobile Menu Button & View Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileToggle}
          className="rounded-lg border border-slate-800 bg-slate-900 p-2 text-slate-400 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-sm font-bold text-white lg:text-base flex items-center gap-2">
            <span>{getPageTitle(pathname)}</span>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              LIVE TELEMETRY
            </span>
          </h1>
        </div>
      </div>

      {/* Center Ticker (Desktop) */}
      <div className="hidden md:flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-950/20 px-3 py-1 text-xs text-red-300 max-w-md truncate">
        <Radio className="h-3.5 w-3.5 text-red-400 animate-pulse shrink-0" />
        <span className="font-mono text-[11px] font-semibold shrink-0">ALERT:</span>
        <span className="truncate">{MOCK_ALERTS[0]?.headline}</span>
      </div>

      {/* Right Controls: Clock, Search, Notifications */}
      <div className="flex items-center gap-3">
        {/* Real-time Clock */}
        <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-mono text-slate-300">
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          <span>{timeString || '22:35:00 UTC'}</span>
        </div>

        {/* Search */}
        <div className="relative hidden xl:block w-48">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search assets / risks..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900/90 pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
          />
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlertModal(!showAlertModal)}
            className="relative rounded-lg border border-slate-800 bg-slate-900/90 p-2 text-slate-300 hover:border-slate-700 hover:text-white"
          >
            <Bell className="h-4 w-4" />
            {criticalAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white font-mono animate-bounce">
                {criticalAlertsCount}
              </span>
            )}
          </button>

          {/* Quick Alert Dropdown */}
          {showAlertModal && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-2xl z-50">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                <span className="font-mono text-xs font-bold text-white flex items-center gap-1">
                  <ShieldAlert className="h-4 w-4 text-red-400" />
                  EMERGENCY ADVISORIES
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {MOCK_ALERTS.length} Active
                </span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {MOCK_ALERTS.map((alt) => (
                  <div
                    key={alt.id}
                    className="rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-xs"
                  >
                    <div className="font-semibold text-slate-200">{alt.headline}</div>
                    <div className="mt-1 text-[11px] text-slate-400">{alt.actionRequired}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Copilot AI Assistant Button */}
        <button
          onClick={() => setShowCopilot(true)}
          className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-mono font-bold text-cyan-300 transition-all hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/10"
        >
          <Bot className="h-4 w-4 text-cyan-400" />
          <span className="hidden md:inline">Copilot AI</span>
        </button>

        <CopilotDrawer isOpen={showCopilot} onClose={() => setShowCopilot(false)} />
      </div>
    </header>
  );
};
