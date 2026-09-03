'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { Shield, ShieldAlert, LayoutDashboard, Radio, PlayCircle, Menu, X, Activity } from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen = false, setMobileOpen }) => {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'System Portal',
      href: '/',
      icon: LayoutDashboard,
      badge: 'GATEWAY'
    },
    {
      name: 'Citizen Safety',
      href: '/citizen',
      icon: Shield,
      badge: 'PUBLIC'
    },
    {
      name: 'Authority EOC',
      href: '/authority',
      icon: ShieldAlert,
      badge: 'COMMAND'
    },
    {
      name: 'Demo Scenario',
      href: '/demo',
      icon: PlayCircle,
      badge: 'SIMULATION'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen?.(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-slate-800 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 lg:static lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-slate-800/80 px-5">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-600 to-teal-400 p-0.5 shadow-lg shadow-cyan-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-slate-950">
                <ShieldAlert className="h-5 w-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="font-mono text-sm font-extrabold tracking-wider text-white">
                CLIMATESHIELD
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-cyan-400">
                AI ENGINE V1.0
              </span>
            </div>
          </Link>

          <button
            onClick={() => setMobileOpen?.(false)}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* EOC Readiness Level */}
        <div className="m-4 rounded-xl border border-slate-800/90 bg-slate-900/60 p-3 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-mono">
            <span>DEFCON READINESS:</span>
            <span className="font-bold text-amber-400">LEVEL 2</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[11px] text-slate-300">Active High Risk Response</span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 space-y-1.5 px-3 py-2">
          <div className="px-3 pb-2 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">
            Navigation Views
          </div>

          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen?.(false)}
                className={clsx(
                  'group flex items-center justify-between rounded-xl px-3.5 py-3 text-xs font-medium transition-all duration-150',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/10 border border-cyan-500/40 text-cyan-300 shadow-md shadow-cyan-950/40'
                    : 'text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={clsx(
                      'h-4 w-4 transition-colors',
                      isActive ? 'text-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    )}
                  />
                  <span>{item.name}</span>
                </div>
                <span
                  className={clsx(
                    'rounded px-1.5 py-0.5 text-[9px] font-mono tracking-wider',
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                      : 'bg-slate-800 text-slate-400'
                  )}
                >
                  {item.badge}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Status Panel */}
        <div className="border-t border-slate-800/80 p-4 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-mono text-[11px]">
            <span className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-emerald-400" />
              SYSTEM NORMAL
            </span>
            <span className="text-slate-500">v1.0.0</span>
          </div>
        </div>
      </aside>
    </>
  );
};
