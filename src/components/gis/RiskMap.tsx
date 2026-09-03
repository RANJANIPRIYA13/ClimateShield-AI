'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { clsx } from 'clsx';
import {
  Compass,
  Filter,
  Navigation,
  Layers,
  X,
  ShieldAlert,
  Droplets,
  Thermometer,
  CloudRain,
  Mountain,
  Users,
  AlertTriangle,
  Clock,
  Activity,
  Home,
  Hospital,
  AlertCircle
} from 'lucide-react';
import { RiskZoneEntity, ShelterEntity, HospitalEntity, CitizenReportEntity, RoadEntity } from '@/lib/db/types';

// Dynamically import RiskMapInner with ssr: false to prevent Next.js SSR window errors
const RiskMapInner = dynamic(() => import('./RiskMapInner'), {
  ssr: false,
  loading: () => (
    <div className="flex h-[460px] w-full flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950 p-6 text-center">
      <div className="h-12 w-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-400 animate-spin mb-3" />
      <div className="font-mono text-xs font-bold text-cyan-400 uppercase tracking-wider">
        Loading Chennai Leaflet GIS Engine...
      </div>
    </div>
  ),
});

interface RiskMapProps {
  className?: string;
  activeRoutePolyline?: {
    coords: [number, number][];
    color: string;
    dashArray?: string;
    name: string;
  } | null;
}

export const RiskMap: React.FC<RiskMapProps> = ({ className, activeRoutePolyline }) => {
  const [zones, setZones] = useState<RiskZoneEntity[]>([]);
  const [shelters, setShelters] = useState<ShelterEntity[]>([]);
  const [hospitals, setHospitals] = useState<HospitalEntity[]>([]);
  const [reports, setReports] = useState<CitizenReportEntity[]>([]);
  const [roads, setRoads] = useState<RoadEntity[]>([]);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>('All');
  const [selectedZone, setSelectedZone] = useState<RiskZoneEntity | null>(null);
  
  const [userCoords, setUserCoords] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState<boolean>(false);

  // Layer Visibility Toggles
  const [showShelters, setShowShelters] = useState<boolean>(true);
  const [showHospitals, setShowHospitals] = useState<boolean>(true);
  const [showIncidents, setShowIncidents] = useState<boolean>(true);
  const [showRoads, setShowRoads] = useState<boolean>(true);

  // Load backend API data
  useEffect(() => {
    async function fetchData() {
      try {
        const [resZones, resShelters, resHospitals, resReports, resRoads] = await Promise.all([
          fetch('/api/risk-zones').then((r) => r.json()),
          fetch('/api/shelters').then((r) => r.json()),
          fetch('/api/hospitals').then((r) => r.json()),
          fetch('/api/citizen-reports').then((r) => r.json()),
          fetch('/api/roads').then((r) => r.json()),
        ]);

        if (resZones.success) setZones(resZones.data);
        if (resShelters.success) setShelters(resShelters.data);
        if (resHospitals.success) setHospitals(resHospitals.data);
        if (resReports.success) setReports(resReports.data);
        if (resRoads.success) setRoads(resRoads.data);
      } catch (err) {
        console.error('Failed to load GIS data from API:', err);
      }
    }
    fetchData();
  }, []);

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    setLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoords([pos.coords.latitude, pos.coords.longitude]);
          setLocating(false);
        },
        (err) => {
          console.warn('GPS location error, falling back to Velachery center:', err.message);
          setUserCoords([12.9785, 80.2206]);
          setLocating(false);
        }
      );
    } else {
      setUserCoords([12.9785, 80.2206]);
      setLocating(false);
    }
  };

  return (
    <div className={clsx('relative overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-1 shadow-2xl backdrop-blur-md flex flex-col', className)}>
      {/* GIS Header Controls */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 rounded-t-lg bg-slate-900/90 px-4 py-3 border-b border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs text-cyan-400 font-bold">
            <Compass className="h-4 w-4 text-cyan-400 animate-spin" style={{ animationDuration: '25s' }} />
            <span>CHENNAI HYPERLOCAL GIS RISK MATRIX</span>
          </div>
          <span className="text-xs text-slate-600">|</span>
          <span className="font-mono text-[11px] text-slate-400">
            LEAFLET + OSM REAL-TIME FEED
          </span>
        </div>

        {/* Locate Me GPS Button */}
        <button
          onClick={handleLocateMe}
          disabled={locating}
          className="flex items-center gap-1.5 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-all hover:bg-cyan-500/20"
        >
          <Navigation className={clsx('h-3.5 w-3.5', locating && 'animate-spin')} />
          <span>{locating ? 'Locating GPS...' : 'Locate Me'}</span>
        </button>
      </div>

      {/* Filter Toolbar Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 bg-slate-950 px-4 py-2.5 border-b border-slate-800/80 text-xs">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-slate-500 text-[11px] font-semibold uppercase">Category:</span>
          {['All', 'Flood', 'Heat', 'Cyclone', 'Landslide'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                'rounded px-2.5 py-1 text-xs transition-all font-medium',
                selectedCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Risk Level Filters */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-slate-500 text-[11px] font-semibold uppercase">Risk Level:</span>
          {['All', 'Low', 'Moderate', 'High', 'Critical'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedRiskLevel(lvl)}
              className={clsx(
                'rounded px-2.5 py-1 text-xs transition-all font-medium',
                selectedRiskLevel === lvl
                  ? lvl === 'Critical'
                    ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
                    : lvl === 'High'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                    : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              )}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Layer Toggles */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => setShowIncidents(!showIncidents)}
            className={clsx('px-2 py-0.5 rounded text-[11px] flex items-center gap-1', showIncidents ? 'bg-red-500/20 text-red-300' : 'text-slate-500')}
          >
            <AlertCircle className="h-3 w-3" /> Incidents
          </button>
          <button
            onClick={() => setShowShelters(!showShelters)}
            className={clsx('px-2 py-0.5 rounded text-[11px] flex items-center gap-1', showShelters ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500')}
          >
            <Home className="h-3 w-3" /> Shelters
          </button>
          <button
            onClick={() => setShowHospitals(!showHospitals)}
            className={clsx('px-2 py-0.5 rounded text-[11px] flex items-center gap-1', showHospitals ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-500')}
          >
            <Hospital className="h-3 w-3" /> Hospitals
          </button>
        </div>
      </div>

      {/* Leaflet Dynamic Canvas Area */}
      <div className="relative min-h-[460px] w-full flex-1">
        <RiskMapInner
          zones={zones}
          shelters={shelters}
          hospitals={hospitals}
          reports={reports}
          roads={roads}
          selectedCategory={selectedCategory}
          selectedRiskLevel={selectedRiskLevel}
          onZoneSelect={(zone) => setSelectedZone(zone)}
          userCoords={userCoords}
          showShelters={showShelters}
          showHospitals={showHospitals}
          showIncidents={showIncidents}
          showRoads={showRoads}
          activeRoutePolyline={activeRoutePolyline}
        />

        {/* Tactical Map Legend overlay (Bottom Left) */}
        <div className="absolute bottom-3 left-3 z-[400] rounded-xl border border-slate-800/90 bg-slate-950/90 p-3 backdrop-blur-md text-[11px] space-y-1.5 shadow-2xl">
          <div className="font-mono text-slate-400 font-bold border-b border-slate-800 pb-1 mb-1">
            MAP LEGEND
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-red-500/80 border border-red-400" />
            <span className="text-slate-200">Critical Risk Sector</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-amber-500/80 border border-amber-400" />
            <span className="text-slate-200">High Risk Sector</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded bg-cyan-500/80 border border-cyan-400" />
            <span className="text-slate-200">Moderate Risk Sector</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-red-500 animate-ping inline-block" />
            <span className="text-slate-300">Active Incident Marker</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block" />
            <span className="text-slate-300">Evacuation Shelter</span>
          </div>
        </div>

        {/* Detailed Zone Inspection Drawer (Bottom Right / Side Panel) */}
        {selectedZone && (
          <div className="absolute top-3 right-3 bottom-3 z-[450] w-96 rounded-xl border border-slate-700 bg-slate-950/95 p-5 shadow-2xl backdrop-blur-xl overflow-y-auto space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-cyan-400 uppercase">
                    {selectedZone.sectorCode} • {selectedZone.city}
                  </span>
                  <span className="rounded bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[9px] font-mono text-cyan-300 font-semibold">
                    AI-assisted decision support
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white">{selectedZone.name}</h3>
              </div>
              <button
                onClick={() => setSelectedZone(null)}
                className="rounded-lg border border-slate-800 bg-slate-900 p-1 text-slate-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Core Metrics Grid (All 14 Required Fields) */}
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-slate-500 block text-[10px]">RISK SCORE</span>
                <span className="text-base font-extrabold text-red-400">{selectedZone.riskScore} / 10</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-slate-500 block text-[10px]">RISK LEVEL</span>
                <span className="text-base font-extrabold text-amber-400">{selectedZone.riskLevel}</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-slate-500 block text-[10px]">AI CONFIDENCE</span>
                <span className="text-sm font-bold text-cyan-300">{selectedZone.confidencePct}%</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-slate-500 block text-[10px]">RAINFALL RATE</span>
                <span className="text-sm font-bold text-cyan-300">{selectedZone.rainfallMmHr} mm/h</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-slate-500 block text-[10px]">WATER LEVEL</span>
                <span className="text-sm font-bold text-amber-300">+{selectedZone.waterLevelM} m</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
                <span className="text-slate-500 block text-[10px]">ELEVATION</span>
                <span className="text-sm font-bold text-slate-200">{selectedZone.elevationM} m MSL</span>
              </div>
            </div>

            {/* Demographics & Vulnerable Population */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5 text-cyan-400" /> Total Population:</span>
                <span className="font-bold text-white font-mono">{selectedZone.population.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1"><AlertTriangle className="h-3.5 w-3.5 text-red-400" /> Vulnerable Population:</span>
                <span className="font-bold text-red-400 font-mono">{selectedZone.vulnerablePopulation?.toLocaleString() || '18,400'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/80 text-[11px]">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-slate-500" /> Last Updated:</span>
                <span className="text-slate-300 font-mono">{selectedZone.lastUpdated}</span>
              </div>
            </div>

            {/* Historical Risk Context */}
            <div className="text-xs space-y-1">
              <span className="font-mono text-slate-500 font-bold uppercase text-[10px]">HISTORICAL DISASTER CONTEXT:</span>
              <p className="text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                {selectedZone.historicalRisk}
              </p>
            </div>

            {/* Contributing Factors */}
            <div className="text-xs space-y-1.5">
              <span className="font-mono text-slate-500 font-bold uppercase text-[10px]">CONTRIBUTING RISK FACTORS:</span>
              <ul className="space-y-1">
                {selectedZone.contributingFactors?.map((factor, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-slate-300 text-[11px]">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0 mt-1" />
                    <span>{factor}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommended Action */}
            <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-3.5 text-xs text-red-200 space-y-1">
              <div className="font-bold text-red-300 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4 text-red-400" />
                RECOMMENDED ACTION:
              </div>
              <p className="text-[11px] leading-relaxed text-slate-200">{selectedZone.recommendedAction}</p>
            </div>

            {/* Transparent AI Weighted Model Algorithm Box */}
            <div className="rounded-xl border border-cyan-500/30 bg-slate-900 p-3.5 text-xs space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                  <Activity className="h-3.5 w-3.5 text-cyan-400" />
                  EXPLAINABLE AI WEIGHTED MODEL
                </span>
                <span className="text-[9px] font-mono text-slate-400">0–100 SCALE</span>
              </div>

              <div className="text-[11px] text-slate-300 space-y-1 font-mono">
                <div className="flex justify-between"><span>• Rainfall Rate:</span><span className="text-cyan-400 font-bold">× 0.30</span></div>
                <div className="flex justify-between"><span>• Elevation MSL:</span><span className="text-cyan-400 font-bold">× 0.20</span></div>
                <div className="flex justify-between"><span>• Water Inundation:</span><span className="text-cyan-400 font-bold">× 0.20</span></div>
                <div className="flex justify-between"><span>• Historical Index:</span><span className="text-cyan-400 font-bold">× 0.10</span></div>
                <div className="flex justify-between"><span>• Vulnerability:</span><span className="text-cyan-400 font-bold">× 0.10</span></div>
                <div className="flex justify-between"><span>• Citizen Reports:</span><span className="text-cyan-400 font-bold">× 0.10</span></div>
              </div>

              <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 leading-snug">
                <span className="font-semibold text-slate-300">Notice:</span> AI-assisted decision support model. Provides guidance based on deterministic weighted metrics. Does not claim scientific validation.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
