'use client';

import React, { useState, useEffect } from 'react';
import {
  Play,
  RotateCcw,
  CloudRain,
  AlertTriangle,
  ShieldAlert,
  Send,
  Home,
  CheckCircle2,
  Activity,
  Layers,
  Radio,
  Clock,
  Bot,
  ArrowRight
} from 'lucide-react';
import { MapContainer } from '@/components/ui/MapContainer';
import { SimulationScenario } from '@/lib/ai/simulationEngine';
import { CopilotDrawer } from '@/components/ui/CopilotDrawer';
import { RiskZoneEntity, ShelterEntity, RoadEntity, AlertEntity, CitizenReportEntity, RescueIncidentEntity } from '@/lib/db/types';

export default function DemoSimulationPage() {
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>('NORMAL');
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');
  const [scenarioSummary, setScenarioSummary] = useState<string>(
    'Simulation running in NORMAL baseline readiness. Rain rate: 12 mm/h, subways open, 850 shelter beds available.'
  );

  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [showCopilot, setShowCopilot] = useState<boolean>(false);

  // Telemetry state
  const [zones, setZones] = useState<RiskZoneEntity[]>([]);
  const [incidents, setIncidents] = useState<RescueIncidentEntity[]>([]);
  const [shelters, setShelters] = useState<ShelterEntity[]>([]);
  const [roads, setRoads] = useState<RoadEntity[]>([]);
  const [alerts, setAlerts] = useState<AlertEntity[]>([]);
  const [reports, setReports] = useState<CitizenReportEntity[]>([]);

  // Fetch telemetry from backend store
  const fetchTelemetry = async () => {
    try {
      const [resZ, resI, resS, resR, resA, resC] = await Promise.all([
        fetch('/api/risk-zones').then((r) => r.json()),
        fetch('/api/incidents').then((r) => r.json()),
        fetch('/api/shelters').then((r) => r.json()),
        fetch('/api/roads').then((r) => r.json()),
        fetch('/api/alerts').then((r) => r.json()),
        fetch('/api/citizen-reports').then((r) => r.json())
      ]);

      if (resZ.success) setZones(resZ.data);
      if (resI.success) setIncidents(resI.data);
      if (resS.success) setShelters(resS.data);
      if (resR.success) setRoads(resR.data);
      if (resA.success) setAlerts(resA.data);
      if (resC.success) setReports(resC.data);

      setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (err) {
      console.error('Failed to fetch simulation telemetry:', err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  // Execute Simulation Scenario
  const handleRunScenario = async (sc: SimulationScenario) => {
    setIsExecuting(true);
    setActiveScenario(sc);
    try {
      const res = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: sc })
      });
      const json = await res.json();
      if (json.success) {
        setScenarioSummary(json.data.summary);
        await fetchTelemetry();
      }
    } catch (err) {
      console.error('Simulation execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  const velacheryZone = zones.find((z) => z.sectorCode === 'CHN-VEL-01') || zones[0];
  const velacheryShelter = shelters.find((s) => s.id === 'SHL-CHN-01') || shelters[0];
  const blockedRoads = roads.filter((r) => r.status === 'Blocked' || r.status === 'Flooded');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Realtime Simulation Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 lg:p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/30">
              <Play className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Realtime Disaster Simulation & Stress Test Engine
                </h2>
                {/* LIVE Indicator Badge */}
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-0.5 font-mono text-[10px] font-bold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  LIVE SIMULATOR ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Trigger climate disaster scenarios to observe real-time risk score escalation, Leaflet GIS map layers, incident triage, and shelter capacity mutations.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Last Updated Timestamp */}
          <div className="flex items-center gap-1.5 font-mono text-xs text-slate-300 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span>Last Updated: {lastUpdatedTime}</span>
          </div>

          <button
            onClick={() => setShowCopilot(true)}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-4 py-2 text-xs font-bold text-slate-950 shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all"
          >
            <Bot className="h-4 w-4" />
            Launch Copilot AI
          </button>
        </div>
      </div>

      {/* 6 Simulation Scenario Control Buttons */}
      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-slate-300 uppercase">
          SELECT DISASTER SIMULATION SCENARIO MODE:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { id: 'NORMAL', label: '1. NORMAL', icon: RotateCcw, color: 'emerald' },
            { id: 'HEAVY_RAIN', label: '2. HEAVY RAIN', icon: CloudRain, color: 'cyan' },
            { id: 'FLOOD_ESCALATION', label: '3. FLOOD BREACH', icon: AlertTriangle, color: 'red' },
            { id: 'ROAD_CLOSURE', label: '4. ROAD CLOSURE', icon: ShieldAlert, color: 'amber' },
            { id: 'NEW_CITIZEN_REPORT', label: '5. CITIZEN CALL', icon: Send, color: 'blue' },
            { id: 'SHELTER_CAPACITY_DROP', label: '6. SHELTER DROP', icon: Home, color: 'purple' },
          ].map((sc) => {
            const Icon = sc.icon;
            const isActive = activeScenario === sc.id;
            return (
              <button
                key={sc.id}
                onClick={() => handleRunScenario(sc.id as SimulationScenario)}
                disabled={isExecuting}
                className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all space-y-1.5 ${
                  isActive
                    ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-xl shadow-cyan-500/20 font-bold scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-cyan-300' : 'text-slate-400'}`} />
                <span className="text-xs font-mono font-semibold">{sc.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Scenario Summary Banner */}
      <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 p-4 text-xs font-mono text-cyan-300 flex items-start justify-between gap-3 shadow-lg">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white uppercase">ACTIVE SCENARIO RESULT:</span>
            <p className="text-slate-300 mt-0.5 leading-relaxed">{scenarioSummary}</p>
          </div>
        </div>
        <span className="font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30 shrink-0">
          STATE SYNCED
        </span>
      </div>

      {/* Real-time Telemetry Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <span className="text-slate-400 text-[10px] block">VELACHERY RISK SCORE</span>
          <div className="text-2xl font-extrabold text-red-400 mt-1">
            {velacheryZone?.riskScore || 9.4} / 10
          </div>
          <span className="text-amber-300 text-[10px]">Level: {velacheryZone?.riskLevel || 'Critical'}</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <span className="text-slate-400 text-[10px] block">RAINFALL & WATER DEPTH</span>
          <div className="text-xl font-extrabold text-cyan-300 mt-1">
            {velacheryZone?.rainfallMmHr || 52.4} mm/h
          </div>
          <span className="text-cyan-400 text-[10px]">Water Level: +{velacheryZone?.waterLevelM || 1.85}m</span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <span className="text-slate-400 text-[10px] block">SHELTER OCCUPANCY</span>
          <div className="text-xl font-extrabold text-emerald-400 mt-1">
            {velacheryShelter?.occupancy} / {velacheryShelter?.capacity}
          </div>
          <span className="text-emerald-300 text-[10px]">
            {Math.round(((velacheryShelter?.occupancy || 480) / (velacheryShelter?.capacity || 800)) * 100)}% Full
          </span>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 backdrop-blur-md">
          <span className="text-slate-400 text-[10px] block">BLOCKED ROADWAYS</span>
          <div className="text-xl font-extrabold text-amber-400 mt-1">
            {blockedRoads.length} Blocked
          </div>
          <span className="text-slate-300 text-[10px]">{blockedRoads[0]?.name || 'Saidapet Subway'}</span>
        </div>
      </div>

      {/* Main Map & Telemetry Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            REALTIME LEAFLET GIS MATRIX & TELEMETRY MUTATIONS:
          </h3>
          <MapContainer className="min-h-[500px]" />
        </div>

        {/* Live Broadcast Alerts & Ground Reports List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 backdrop-blur-md">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Radio className="h-4 w-4 text-red-400" />
              Live EOC Siren Broadcast Alerts
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alerts.map((alt) => (
                <div key={alt.id} className="rounded-xl border border-red-500/30 bg-red-950/20 p-2.5 text-xs">
                  <div className="font-bold text-red-300">{alt.headline}</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{alt.actionRequired}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 backdrop-blur-md">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Send className="h-4 w-4 text-amber-400" />
              Citizen Ground Incident Reports ({reports.length})
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-xs">
              {reports.map((rep) => (
                <div key={rep.id} className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold text-amber-300 text-[11px]">{rep.category}</span>
                    <span className="text-[10px] text-red-400 font-bold">{rep.urgency}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">{rep.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <CopilotDrawer isOpen={showCopilot} onClose={() => setShowCopilot(false)} />
    </div>
  );
}
