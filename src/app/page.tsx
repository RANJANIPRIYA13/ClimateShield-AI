'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, ShieldAlert, PlayCircle, ArrowRight, Activity, Users, Radio, Cpu, Layers } from 'lucide-react';
import { KpiCard } from '@/components/ui/KpiCard';
import { MOCK_KPIS, MOCK_RISKS } from '@/data/mockData';
import { StatusBadge } from '@/components/ui/StatusBadge';

export default function PlatformGateway() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Hero Gateway Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 p-6 lg:p-10 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono font-bold text-cyan-300">
            <Cpu className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span>CLIMATESHIELD AI • LIVE INTELLIGENCE</span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            ClimateShield AI Platform
          </h1>
          
          <p className="text-sm lg:text-base text-slate-300 leading-relaxed">
            Multi-perspective emergency operations, community safety alerts, and climate disaster risk intelligence. Access specialized dashboards for citizens and authority emergency managers.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/authority"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 hover:shadow-cyan-500/30"
            >
              <ShieldAlert className="h-4 w-4" />
              Launch EOC Command Center
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/citizen"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-5 py-3 text-xs font-bold text-white transition-all hover:border-slate-600 hover:bg-slate-800"
            >
              <Shield className="h-4 w-4 text-cyan-400" />
              Access Citizen Portal
            </Link>

            <Link
              href="/demo"
              className="inline-flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-5 py-3 text-xs font-bold text-amber-300 transition-all hover:bg-amber-500/20"
            >
              <PlayCircle className="h-4 w-4" />
              Run Demo Scenario
            </Link>
          </div>
        </div>
      </div>

      {/* High Level Operations Metrics */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <h2 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            Active System Operations Summary
          </h2>
          <span className="text-[11px] font-mono text-emerald-400">TELEMETRY ONLINE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {MOCK_KPIS.map((kpi) => (
            <KpiCard key={kpi.id} kpi={kpi} />
          ))}
        </div>
      </div>

      {/* Gateway Cards (3 Core Routes) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Citizen Portal Card */}
        <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md transition-all hover:border-cyan-500/50 hover:bg-slate-900/90 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-cyan-400">
                <Shield className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded">/citizen</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300">
                Citizen Safety Portal
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Tailored for public emergency preparedness. Features active evacuation advisories, nearby shelter locator, safety check-in status, and incident report entry.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Live Neighborhood Risk Alerts
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Emergency Shelter Occupancy & Routing
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                Citizen Assistance & Incident Dispatch
              </li>
            </ul>
          </div>

          <Link
            href="/citizen"
            className="mt-6 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors group-hover:bg-cyan-500 group-hover:text-slate-950 group-hover:border-cyan-400"
          >
            <span>Open Citizen Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Authority EOC Card */}
        <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md transition-all hover:border-red-500/50 hover:bg-slate-900/90 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-400">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded">/authority</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-red-300">
                Authority EOC Command
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Designed for Emergency Operations Centers. Includes tactical GIS radar grid, crisis KPI cards, incident triage, and resource allocation tracking.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                GIS Radar Command Matrix
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Tactical Asset & Resource Allocation
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Incident Priority Triage Dispatch
              </li>
            </ul>
          </div>

          <Link
            href="/authority"
            className="mt-6 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors group-hover:bg-red-500 group-hover:text-white group-hover:border-red-400"
          >
            <span>Open EOC Command Desk</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Demo Mode Card */}
        <div className="group rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-md transition-all hover:border-amber-500/50 hover:bg-slate-900/90 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-amber-400">
                <PlayCircle className="h-6 w-6" />
              </div>
              <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2.5 py-1 rounded">/demo</span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300">
                Interactive Demo Scenario
              </h3>
              <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                Test disaster control flows under simulated stress conditions. Trigger coastal storm surge breaches, power grid failures, and inspect live risk telemetry.
              </p>
            </div>

            <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Category 4 Disaster Simulation
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Interactive Event Trigger Suite
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                System Metric Diagnostics & Logs
              </li>
            </ul>
          </div>

          <Link
            href="/demo"
            className="mt-6 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-white transition-colors group-hover:bg-amber-500 group-hover:text-slate-950 group-hover:border-amber-400"
          >
            <span>Launch Simulation Control</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Active Threat Preview List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="h-4 w-4 text-cyan-400" />
            Top Active Climate Threat Monitors
          </h3>
          <span className="text-xs font-mono text-slate-400">5 Monitored Sectors</span>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_RISKS.slice(0, 2).map((risk) => (
            <div key={risk.id} className="flex items-start justify-between rounded-xl border border-slate-800 bg-slate-950 p-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-cyan-400 font-semibold">{risk.id}</span>
                  <StatusBadge status={risk.severity} size="sm" />
                </div>
                <h4 className="text-sm font-bold text-white">{risk.title}</h4>
                <p className="text-xs text-slate-400 line-clamp-1">{risk.location}</p>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-slate-400">Prob:</span>{' '}
                <span className="font-bold text-amber-400">{risk.probability}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
