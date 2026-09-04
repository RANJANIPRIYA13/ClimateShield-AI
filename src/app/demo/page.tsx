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
  Layers,
  Radio,
  Clock,
  Bot,
  WifiOff,
  PhoneCall,
  Smartphone,
  Cpu,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ChevronRight,
  Volume2
} from 'lucide-react';
import { MapContainer } from '@/components/ui/MapContainer';
import { SimulationScenario } from '@/lib/ai/simulationEngine';
import { CopilotDrawer } from '@/components/ui/CopilotDrawer';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { ResilienceStatusPanel } from '@/components/ui/ResilienceStatusPanel';
import { RiskZoneEntity, ShelterEntity, RoadEntity, AlertEntity, CitizenReportEntity, RescueIncidentEntity } from '@/lib/db/types';

export default function DemoSimulationPage() {
  const [activeScenario, setActiveScenario] = useState<SimulationScenario>('NORMAL');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [lastUpdatedTime, setLastUpdatedTime] = useState<string>('Just now');
  const [scenarioSummary, setScenarioSummary] = useState<string>(
    '1. NORMAL BASELINE: Standard monsoonal readiness. Moderate rain (12 mm/h), roads clear, 850 shelter beds open.'
  );

  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [isPlayingChain, setIsPlayingChain] = useState<boolean>(false);
  const [showCopilot, setShowCopilot] = useState<boolean>(false);
  const [resiliencePayloads, setResiliencePayloads] = useState<any>(null);

  // Telemetry state
  const [zones, setZones] = useState<RiskZoneEntity[]>([]);
  const [incidents, setIncidents] = useState<RescueIncidentEntity[]>([]);
  const [shelters, setShelters] = useState<ShelterEntity[]>([]);
  const [roads, setRoads] = useState<RoadEntity[]>([]);
  const [alerts, setAlerts] = useState<AlertEntity[]>([]);
  const [reports, setReports] = useState<CitizenReportEntity[]>([]);

  // 14-Step Domino Scenario Chain Sequence
  const DOMINO_STEPS: { scenario: SimulationScenario; label: string; step: number }[] = [
    { scenario: 'NORMAL', label: '1. NORMAL BASELINE', step: 1 },
    { scenario: 'HEAVY_RAIN', label: '2. HEAVY RAIN SURGE', step: 2 },
    { scenario: 'HYPERLOCAL_RISK_INCREASE', label: '3. HYPERLOCAL RISK SPIKE', step: 3 },
    { scenario: 'WATER_LEVEL_RISE', label: '4. SUBWAY WATER RISE', step: 4 },
    { scenario: 'CITIZEN_REPORT', label: '5. CITIZEN REPORT FIRED', step: 5 },
    { scenario: 'ROAD_BECOMES_UNSAFE', label: '6. ROAD BLOCKAGE', step: 6 },
    { scenario: 'RISK_SCORE_RECALCULATES', label: '7. RISK RECALCULATION', step: 7 },
    { scenario: 'SAFE_ROUTE_RECALCULATES', label: '8. SAFE ROUTE DETOUR', step: 8 },
    { scenario: 'SHELTER_RECOMMENDATION_CHANGES', label: '9. SHELTER CAP SHIFT', step: 9 },
    { scenario: 'RESCUE_PRIORITY_CHANGES', label: '10. RESCUE PRIORITY 1', step: 10 },
    { scenario: 'AUTHORITY_ALERT', label: '11. EOC SIREN ALERT', step: 11 },
    { scenario: 'INTERNET_FAILURE', label: '12. INTERNET OUTAGE', step: 12 },
    { scenario: 'RESILIENT_FALLBACK', label: '13. MULTI-CHANNEL FALLBACK', step: 13 },
    { scenario: 'OFFLINE_RESILIENCE_CONFIRMED', label: '14. OFFLINE CONFIRMED', step: 14 }
  ];

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

  // Execute Single Simulation Scenario Step
  const handleRunScenario = async (sc: SimulationScenario, stepNum?: number) => {
    setIsExecuting(true);
    setActiveScenario(sc);
    if (stepNum) setCurrentStep(stepNum);

    try {
      const res = await fetch('/api/simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario: sc })
      });
      const json = await res.json();
      if (json.success) {
        setScenarioSummary(json.data.summary);
        if (json.data.resiliencePayloads) {
          setResiliencePayloads(json.data.resiliencePayloads);
        }
        await fetchTelemetry();
      }
    } catch (err) {
      console.error('Simulation execution error:', err);
    } finally {
      setIsExecuting(false);
    }
  };

  // Auto-play the complete 14-step domino chain sequence
  const handlePlayFullChain = async () => {
    setIsPlayingChain(true);
    for (let i = 0; i < DOMINO_STEPS.length; i++) {
      const stepItem = DOMINO_STEPS[i];
      await handleRunScenario(stepItem.scenario, stepItem.step);
      // Wait 1.8 seconds between steps so judges can watch domino chain unfold visually
      await new Promise((resolve) => setTimeout(resolve, 1800));
    }
    setIsPlayingChain(false);
  };

  const velacheryZone = zones.find((z) => z.sectorCode === 'CHN-VEL-01') || zones[0];
  const velacheryShelter = shelters.find((s) => s.id === 'SHL-CHN-01') || shelters[0];
  const blockedRoads = roads.filter((r) => r.status === 'Blocked' || r.status === 'Flooded');

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 lg:p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/30">
              <Play className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  ClimateShield AI — End-to-End Disaster Simulation Chain
                </h2>
                <StatusBadge status="LIVE" showPulse={true} size="sm" />
              </div>
              <p className="text-xs text-slate-300">
                Full 14-stage domino chain: Baseline → Heavy Rain → Hyperlocal Risk → Water Rise → Citizen Call → Safe Route Recalculation → Emergency Fallbacks.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePlayFullChain}
            disabled={isPlayingChain || isExecuting}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold font-mono transition-all border shadow-lg ${
              isPlayingChain
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse'
                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 hover:scale-105 border-emerald-400'
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span>{isPlayingChain ? 'DOMINO CHAIN RUNNING...' : 'AUTO-PLAY 14-STEP CHAIN'}</span>
          </button>

          <button
            onClick={() => setShowCopilot(true)}
            className="flex items-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3.5 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
          >
            <Bot className="h-4 w-4 text-cyan-400" />
            Copilot AI
          </button>
        </div>
      </div>

      {/* Resilience Matrix Panel */}
      <ResilienceStatusPanel />

      {/* 14 Domino Step Buttons */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-slate-300 uppercase flex items-center gap-2">
            <ChevronRight className="h-4 w-4 text-cyan-400" />
            SELECT DOMINO SCENARIO STEP (STEP {currentStep} OF 14):
          </span>
          <span className="text-[11px] font-mono text-slate-400">Click any step or use Auto-Play</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {DOMINO_STEPS.map((s) => {
            const isActive = activeScenario === s.scenario;
            return (
              <button
                key={s.scenario}
                onClick={() => handleRunScenario(s.scenario, s.step)}
                disabled={isExecuting || isPlayingChain}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'border-cyan-500 bg-cyan-500/20 text-white shadow-lg shadow-cyan-500/20 font-bold scale-[1.02]'
                    : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <div className="text-[10px] font-mono text-cyan-400 font-bold">STEP {s.step}</div>
                <div className="text-[11px] font-semibold truncate mt-0.5">{s.label.split('. ')[1]}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Summary & Provenance Banner */}
      <div className="rounded-xl border border-cyan-500/40 bg-slate-950 p-4 text-xs font-mono text-cyan-300 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xl">
        <div className="flex items-start gap-2.5">
          <CheckCircle2 className="h-5 w-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white uppercase text-sm">CURRENT DOMINO STAGE RESULT</span>
              <StatusBadge status="AI PREDICTION" size="sm" showPulse={false} />
            </div>
            <p className="text-slate-200 mt-1 leading-relaxed text-xs">{scenarioSummary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-400">Synced at {lastUpdatedTime}</span>
        </div>
      </div>

      {/* Resilient Channel Fallback Telemetry Displays (Shown on Step 13 & 14) */}
      {resiliencePayloads && (
        <div className="rounded-2xl border border-purple-500/40 bg-purple-950/20 p-5 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between border-b border-purple-500/30 pb-3">
            <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
              <WifiOff className="h-5 w-5 text-purple-400" />
              OFFLINE / MULTI-CHANNEL EMERGENCY FALLBACK PAYLOADS
            </h3>
            <StatusBadge status="DEMO" size="sm" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            {/* SMS Payload */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
              <div className="flex items-center justify-between text-cyan-400 font-bold border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3.5 w-3.5" />
                  SMS TELEPHONY
                </span>
                <StatusBadge status="LIVE" size="sm" showPulse={false} />
              </div>
              <pre className="text-[10px] text-slate-300 whitespace-pre-wrap bg-slate-950 p-2 rounded border border-slate-800">
                {resiliencePayloads.smsMessage || 'Dispatched via carrier'}
              </pre>
            </div>

            {/* IVR Voice Script */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
              <div className="flex items-center justify-between text-amber-400 font-bold border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1">
                  <Volume2 className="h-3.5 w-3.5" />
                  IVR BILINGUAL VOICE
                </span>
                <StatusBadge status="OFFICIAL" size="sm" showPulse={false} />
              </div>
              <pre className="text-[10px] text-slate-300 whitespace-pre-wrap bg-slate-950 p-2 rounded border border-slate-800">
                {resiliencePayloads.ivrScript || 'Voice script compiled'}
              </pre>
            </div>

            {/* Bluetooth Mesh Relay */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
              <div className="flex items-center justify-between text-emerald-400 font-bold border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1">
                  <Smartphone className="h-3.5 w-3.5" />
                  BLE MESH RELAY
                </span>
                <StatusBadge status="Ready" size="sm" showPulse={false} />
              </div>
              <div className="text-[10px] text-slate-300 bg-slate-950 p-2 rounded border border-slate-800 space-y-1">
                <div>Packet ID: {resiliencePayloads.meshRelayPacketId}</div>
                <div>Hops: 3 / 7 nodes</div>
                <div>Peer-to-Peer BLE Active</div>
              </div>
            </div>

            {/* Compact Radio String */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-3 space-y-2">
              <div className="flex items-center justify-between text-red-400 font-bold border-b border-slate-800 pb-1.5">
                <span className="flex items-center gap-1">
                  <Radio className="h-3.5 w-3.5" />
                  RADIO COMPACT FRAME
                </span>
                <StatusBadge status="Ready" size="sm" showPulse={false} />
              </div>
              <pre className="text-[10px] text-red-300 font-bold break-all bg-slate-950 p-2 rounded border border-slate-800">
                {resiliencePayloads.radioCompactString}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Main Map & Ground Incident Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-2">
          <h3 className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-2">
            <Layers className="h-4 w-4 text-cyan-400" />
            HYPERLOCAL GIS RISK MAP & INCIDENT RECALCULATION:
          </h3>
          <MapContainer className="min-h-[500px]" />
        </div>

        {/* Live Broadcast Alerts & Ground Reports List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 backdrop-blur-md">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Radio className="h-4 w-4 text-red-400" />
              Live EOC Siren Alerts ({alerts.length})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {alerts.map((alt) => (
                <div key={alt.id} className="rounded-xl border border-red-500/30 bg-red-950/20 p-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-red-300">{alt.headline}</span>
                    <StatusBadge status="OFFICIAL" size="sm" showPulse={false} />
                  </div>
                  <div className="text-[11px] text-slate-300 mt-1">{alt.actionRequired}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-3 backdrop-blur-md">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
              <Send className="h-4 w-4 text-amber-400" />
              Citizen Ground Reports ({reports.length})
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-xs">
              {reports.map((rep) => (
                <div key={rep.id} className="rounded-xl border border-slate-800 bg-slate-950 p-2.5 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-amber-300 text-[11px]">{rep.category}</span>
                    <StatusBadge status="CITIZEN REPORT" size="sm" showPulse={false} />
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
