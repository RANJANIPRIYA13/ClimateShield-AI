'use client';

import React, { useState } from 'react';
import { Wifi, WifiOff, Radio, ShieldCheck, Phone, Cpu, Smartphone, SignalHigh, Server, Zap } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { getAdapterStatuses } from '@/lib/adapters';

interface ResilienceStatusPanelProps {
  compact?: boolean;
  onSimulateOfflineChange?: (isOffline: boolean) => void;
}

export const ResilienceStatusPanel: React.FC<ResilienceStatusPanelProps> = ({
  compact = false,
  onSimulateOfflineChange
}) => {
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const adapterStatuses = getAdapterStatuses();

  const handleToggleOffline = () => {
    const nextState = !isOfflineSimulated;
    setIsOfflineSimulated(nextState);
    if (onSimulateOfflineChange) {
      onSimulateOfflineChange(nextState);
    }
  };

  const weatherAdapter = adapterStatuses.find(a => a.type === 'weather');
  const satelliteAdapter = adapterStatuses.find(a => a.type === 'satellite');
  const iotAdapter = adapterStatuses.find(a => a.type === 'iot');

  const channelItems = [
    {
      label: 'Internet Connection',
      icon: isOfflineSimulated ? WifiOff : Wifi,
      value: isOfflineSimulated ? 'OFFLINE' : 'ONLINE',
      badge: isOfflineSimulated ? 'Critical' : 'Safe',
      subtext: isOfflineSimulated ? 'Subsea fiber / cell outage' : 'Gigabit Fiber Uplink'
    },
    {
      label: 'Realtime Telemetry',
      icon: Server,
      value: isOfflineSimulated ? 'DEGRADED' : 'CONNECTED',
      badge: isOfflineSimulated ? 'Warning' : 'LIVE',
      subtext: isOfflineSimulated ? 'Using local SW cache' : 'WebSocket 12ms latency'
    },
    {
      label: 'Weather Radar Feed',
      icon: Zap,
      value: weatherAdapter?.mode === 'LIVE' ? 'LIVE' : 'DEMO',
      badge: weatherAdapter?.mode === 'LIVE' ? 'LIVE' : 'DEMO',
      subtext: weatherAdapter?.name || 'IMD Radar Grid'
    },
    {
      label: 'Satellite Remote-Sensing',
      icon: Cpu,
      value: satelliteAdapter?.mode === 'LIVE' ? 'LIVE' : 'DEMO',
      badge: satelliteAdapter?.mode === 'LIVE' ? 'LIVE' : 'DEMO',
      subtext: satelliteAdapter?.name || 'Sentinel-2 SAR Flood Data'
    },
    {
      label: 'IoT Subway Sensors',
      icon: SignalHigh,
      value: iotAdapter?.mode === 'LIVE' ? 'LIVE' : 'DEMO',
      badge: iotAdapter?.mode === 'LIVE' ? 'LIVE' : 'DEMO',
      subtext: iotAdapter?.name || 'Subway Water Level Telemetry'
    },
    {
      label: 'Citizen Hazard Network',
      icon: Smartphone,
      value: 'ACTIVE',
      badge: 'CITIZEN REPORT',
      subtext: 'Verified crowdsourced reports'
    },
    {
      label: 'SMS Telephony Gateway',
      icon: Phone,
      value: typeof process !== 'undefined' && process.env.TWILIO_ACCOUNT_SID ? 'CONFIGURED' : 'DEMO',
      badge: typeof process !== 'undefined' && process.env.TWILIO_ACCOUNT_SID ? 'OFFICIAL' : 'DEMO',
      subtext: 'Simulated cell alert dispatch'
    },
    {
      label: 'IVR Voice Broadcast',
      icon: Phone,
      value: typeof process !== 'undefined' && process.env.TWILIO_ACCOUNT_SID ? 'CONFIGURED' : 'DEMO',
      badge: typeof process !== 'undefined' && process.env.TWILIO_ACCOUNT_SID ? 'OFFICIAL' : 'DEMO',
      subtext: 'Bilingual voice script builder'
    },
    {
      label: 'Bluetooth Mesh Protocol',
      icon: Radio,
      value: 'READY',
      badge: 'Ready',
      subtext: 'Device-to-device BLE hop'
    },
    {
      label: 'Radio Broadcast Protocol',
      icon: ShieldCheck,
      value: 'READY',
      badge: 'Ready',
      subtext: 'Compact emergency radio string'
    }
  ];

  if (compact) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 shadow-lg">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
          <span className="font-mono text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Radio className="h-4 w-4 text-cyan-400 animate-pulse" />
            RESILIENCE ARCHITECTURE MATRIX
          </span>
          <button
            onClick={handleToggleOffline}
            className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all border ${
              isOfflineSimulated
                ? 'bg-red-500/20 border-red-500/50 text-red-300'
                : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
          >
            {isOfflineSimulated ? 'OFFLINE SIMULATED' : 'TOGGLE OFFLINE MODE'}
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {channelItems.map((item, i) => (
            <div key={i} className="rounded-lg border border-slate-800/80 bg-slate-950/60 p-2 text-center">
              <div className="text-[10px] text-slate-400 truncate">{item.label}</div>
              <div className="mt-1 flex items-center justify-center">
                <StatusBadge status={item.badge} size="sm" showPulse={false} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 lg:p-6 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Radio className="h-5 w-5 text-cyan-400 animate-pulse" />
            SYSTEM RESILIENCE & MULTI-CHANNEL ADAPTER MATRIX
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Realtime telemetry status across Internet, Offline PWA, Telephony, BLE Mesh, and Radio Fallback channels.
          </p>
        </div>

        <button
          onClick={handleToggleOffline}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all border ${
            isOfflineSimulated
              ? 'bg-red-500/20 border-red-500/60 text-red-300 shadow-lg shadow-red-500/20'
              : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20'
          }`}
        >
          {isOfflineSimulated ? (
            <>
              <WifiOff className="h-4 w-4 text-red-400 animate-pulse" />
              <span>SIMULATING NETWORK BLACKOUT</span>
            </>
          ) : (
            <>
              <Wifi className="h-4 w-4 text-emerald-400" />
              <span>TEST OFFLINE FALLBACK MODE</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {channelItems.map((item, index) => {
          const IconComp = item.icon;
          return (
            <div
              key={index}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-300 truncate">{item.label}</span>
                  <IconComp className="h-4 w-4 text-cyan-400 shrink-0" />
                </div>
                <div className="text-[10px] text-slate-500 font-mono line-clamp-1">{item.subtext}</div>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/60">
                <span className="font-mono text-xs font-bold text-white">{item.value}</span>
                <StatusBadge status={item.badge} size="sm" showPulse={false} />
              </div>
            </div>
          );
        })}
      </div>

      {isOfflineSimulated && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-200 flex items-start gap-2">
          <WifiOff className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">OFFLINE EMERGENCY FALLBACK ACTIVATED: </span>
            The system is operating without internet. Service Worker cache is maintaining map data & shelters. Citizen reports are queued locally. SMS alerts, IVR calls, BLE Mesh relay, and compact Radio strings are active for uninterrupted disaster response.
          </div>
        </div>
      )}
    </div>
  );
};
