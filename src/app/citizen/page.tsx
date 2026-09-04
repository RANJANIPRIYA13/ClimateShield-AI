'use client';

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Home,
  MapPin,
  Send,
  CheckCircle,
  Navigation,
  Radio,
  PhoneCall,
  Globe,
  AlertTriangle,
  Hospital as HospitalIcon,
  ShieldAlert,
  ArrowRight,
  Clock,
  CheckCircle2,
  Camera,
  Activity,
  Layers,
  Phone
} from 'lucide-react';
import { i18n, Language } from '@/lib/i18n';
import { RiskMap } from '@/components/gis/RiskMap';
import { ShelterCard } from '@/components/ui/ShelterCard';
import { AlertCard } from '@/components/ui/AlertCard';
import { ResourceFinder } from '@/components/gis/ResourceFinder';
import { calculateSafeRoutes, RouteCalculationResult, RouteOption } from '@/lib/ai/routeEngine';
import { ResilienceStatusPanel } from '@/components/ui/ResilienceStatusPanel';
import { ShelterEntity, HospitalEntity, RoadEntity, AlertEntity, CitizenReportEntity } from '@/lib/db/types';

export default function CitizenDashboard() {
  const [lang, setLang] = useState<Language>('en');
  const t = i18n[lang];

  const [activeSubTab, setActiveSubTab] = useState<'home' | 'map' | 'route' | 'shelters' | 'report' | 'alerts' | 'emergency'>('home');
  const [safetyStatus, setSafetyStatus] = useState<'safe' | 'assistance' | null>(null);

  // API Data State
  const [shelters, setShelters] = useState<ShelterEntity[]>([]);
  const [hospitals, setHospitals] = useState<HospitalEntity[]>([]);
  const [roads, setRoads] = useState<RoadEntity[]>([]);
  const [alerts, setAlerts] = useState<AlertEntity[]>([]);

  // Safe Route Calculation State
  const [routeOrigin, setRouteOrigin] = useState('Velachery Lowlands (Zone 4)');
  const [routeDestination, setRouteDestination] = useState('Velachery Community Hall Shelter');
  const [routeResult, setRouteResult] = useState<RouteCalculationResult>(calculateSafeRoutes());
  const [selectedRouteId, setSelectedRouteId] = useState<string>('ROUTE-SAFE-01');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);

  const handleGenerateRoutes = async () => {
    setIsCalculatingRoute(true);
    try {
      const res = await fetch('/api/routes/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ origin: routeOrigin, destination: routeDestination })
      });
      const json = await res.json();
      if (json.success) {
        setRouteResult(json.data);
        setSelectedRouteId(json.data.recommendedRouteId);
      }
    } catch (err) {
      console.error('Route calculation error:', err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };
  const [hazardType, setHazardType] = useState('Flash Flood / High Water Level');
  const [locationName, setLocationName] = useState('Velachery Main Road & Lake View Colony');
  const [waterLevelInput, setWaterLevelInput] = useState('2.5 feet (75 cm)');
  const [descriptionInput, setDetailsInput] = useState('');
  const [photoSelected, setPhotoSelected] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionResult, setSubmissionResult] = useState<{
    report: CitizenReportEntity;
    verification: any;
  } | null>(null);

  // Fetch live API data
  useEffect(() => {
    async function loadData() {
      try {
        const [resShl, resHsp, resRd, resAlt] = await Promise.all([
          fetch('/api/shelters').then((r) => r.json()),
          fetch('/api/hospitals').then((r) => r.json()),
          fetch('/api/roads').then((r) => r.json()),
          fetch('/api/alerts').then((r) => r.json()),
        ]);

        if (resShl.success) setShelters(resShl.data);
        if (resHsp.success) setHospitals(resHsp.data);
        if (resRd.success) setRoads(resRd.data);
        if (resAlt.success) setAlerts(resAlt.data);
      } catch (err) {
        console.error('Failed to load citizen portal data:', err);
      }
    }
    loadData();
  }, []);

  // Handle Hazard Report Submission
  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Submit report to backend POST /api/citizen-reports
      const res = await fetch('/api/citizen-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userName: 'Citizen User (Velachery)',
          category: hazardType,
          locationName: locationName,
          latitude: 12.9785,
          longitude: 80.2206,
          urgency: 'Critical',
          description: `[Observed Water Depth: ${waterLevelInput}] - ${descriptionInput || 'Flash flood water rising near residential complex'}`
        })
      });

      const json = await res.json();
      if (json.success) {
        // 2. Call verification scoring API POST /api/citizen-reports/verify
        const verifyRes = await fetch('/api/citizen-reports/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reportId: json.data.id })
        });
        const verifyJson = await verifyRes.json();

        setSubmissionResult({
          report: json.data,
          verification: verifyJson.data
        });
      }
    } catch (err) {
      console.error('Report submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nearestShelter = shelters[0] || {
    name: 'Velachery Community Hall Emergency Shelter',
    address: 'Inner Ring Road, Vijayanagar, Velachery',
    occupancy: 480,
    capacity: 800,
    contactPhone: '+91 44 2243 0011'
  };

  const nearestHospital = hospitals[0] || {
    name: 'Apollo Speciality Hospital Velachery',
    address: '100 Feet Road, Karaikudi Nagar, Velachery',
    availableBeds: 34,
    icuBeds: 8,
    contactPhone: '+91 44 2244 7788'
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Citizen Header Bar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 lg:p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-cyan-500/10 p-2.5 text-cyan-400 border border-cyan-500/30">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  {t.citizenPortalTitle}
                </h2>
                <span className="rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                  ZONE 4 SECTOR
                </span>
              </div>
              <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                <span>{t.currentLocation}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Controls: Language Switcher & Safety Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* English / Tamil Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'ta' : 'en')}
            className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-2 text-xs font-mono font-bold text-cyan-300 transition-all hover:bg-cyan-500/20"
          >
            <Globe className="h-4 w-4" />
            <span>{lang === 'en' ? 'தமிழ் (TA)' : 'English (EN)'}</span>
          </button>

          {safetyStatus === 'safe' ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300">
              <CheckCircle className="h-4 w-4 text-emerald-400" />
              <span>{t.registeredSafe}</span>
            </div>
          ) : (
            <button
              onClick={() => setSafetyStatus('safe')}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
            >
              <CheckCircle className="h-4 w-4" />
              {t.iAmSafe}
            </button>
          )}

          <button
            onClick={() => setSafetyStatus('assistance')}
            className="inline-flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2 text-xs font-bold text-red-300 transition-all hover:bg-red-500/20"
          >
            <PhoneCall className="h-4 w-4 text-red-400" />
            {t.requestAssistance}
          </button>
        </div>
      </div>

      {safetyStatus === 'assistance' && (
        <div className="rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-xs text-red-200 animate-fadeIn">
          <div className="font-bold text-sm flex items-center gap-2 text-red-300">
            <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
            {t.assistanceSent}
          </div>
          <p className="mt-1 text-slate-300">
            Your location (Velachery Zone 4) has been transmitted to EOC Response Dispatchers. If you are in immediate life danger, call 108 immediately.
          </p>
        </div>
      )}

      {/* Resilience Channel Status Matrix */}
      <ResilienceStatusPanel compact={true} />

      {/* Sub-Section Navigation Tabs */}
      <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/90 p-1.5 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'home', label: t.home, icon: Home },
          { id: 'map', label: t.riskMap, icon: Layers },
          { id: 'route', label: t.safeRoute, icon: Navigation },
          { id: 'shelters', label: t.shelters, icon: Home },
          { id: 'report', label: t.reportHazard, icon: Send },
          { id: 'alerts', label: t.alerts, icon: Radio },
          { id: 'emergency', label: t.emergency, icon: PhoneCall },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 min-w-[100px] flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-teal-500/10 text-cyan-300 border border-cyan-500/40 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. TAB: HOME VIEW */}
      {activeSubTab === 'home' && (
        <div className="space-y-6">
          {/* Prominent GET TO SAFETY Banner Card */}
          <div className="relative overflow-hidden rounded-2xl border border-red-500/50 bg-gradient-to-r from-red-950/80 via-slate-900 to-slate-900 p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-red-500/40 bg-red-500/20 px-3 py-0.5 text-xs font-mono font-bold text-red-300">
                  <AlertTriangle className="h-3.5 w-3.5 text-red-400 animate-pulse" />
                  <span>EVACUATION ADVISORY IN EFFECT</span>
                </div>
                <h3 className="text-2xl font-extrabold text-white">
                  {t.getToSafety}
                </h3>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  Water level in Velachery Lowlands reached 1.85m (+52.4 mm/h rainfall). Evacuate ground floor residence now to Velachery Community Shelter.
                </p>
              </div>

              <button
                onClick={() => setActiveSubTab('route')}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 px-6 py-3 text-sm font-bold text-white shadow-xl shadow-red-600/30 transition-all hover:scale-105"
              >
                <Navigation className="h-4 w-4" />
                <span>Open Safe Evacuation Route</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Current Risk Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-red-500/40 bg-slate-900/80 p-5 backdrop-blur-md">
              <span className="font-mono text-xs font-semibold text-slate-400 uppercase">{t.riskScore}</span>
              <div className="mt-2 text-3xl font-extrabold font-mono text-red-400 flex items-baseline gap-2">
                <span>94 / 100</span>
                <span className="text-xs text-red-300 font-sans">Extreme Threat</span>
              </div>
            </div>

            <div className="rounded-xl border border-amber-500/40 bg-slate-900/80 p-5 backdrop-blur-md">
              <span className="font-mono text-xs font-semibold text-slate-400 uppercase">{t.riskLevel}</span>
              <div className="mt-2 text-3xl font-extrabold font-mono text-amber-400 flex items-baseline gap-2">
                <span>CRITICAL</span>
                <span className="text-xs text-slate-400 font-sans">Level 4</span>
              </div>
            </div>

            <div className="rounded-xl border border-cyan-500/40 bg-slate-900/80 p-5 backdrop-blur-md">
              <span className="font-mono text-xs font-semibold text-slate-400 uppercase">{t.aiConfidence}</span>
              <div className="mt-2 text-3xl font-extrabold font-mono text-cyan-300 flex items-baseline gap-2">
                <span>96%</span>
                <span className="text-[10px] text-cyan-400 font-sans">{t.aiDisclaimer}</span>
              </div>
            </div>
          </div>

          {/* Why Risk is High & What to Do Now (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <AlertTriangle className="h-4 w-4 text-amber-400" />
                {t.whyRiskHigh}
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                  <span><strong>Monsoon Precipitation:</strong> Sustained heavy rainfall of 52.4 mm/h recorded at Velachery station.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                  <span><strong>Water Accumulation:</strong> Inundation depth reached 1.85 meters in Lake View Colony basements.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                  <span><strong>Low Elevation Basin:</strong> Sector sits at low elevation (2.1m MSL) near Pallikaranai marshland runoff outlet.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400 mt-1 shrink-0" />
                  <span><strong>High Tide Backwater:</strong> Kovalam creek backwater pushing sea surge into drainage canals.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                {t.whatToDoNow}
              </h4>
              <ul className="space-y-2 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <span><strong>Immediate Evacuation:</strong> Move ground floor belongings and family to Velachery Shelter (0.8 km).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <span><strong>Electrical Safety:</strong> Switch off main circuit breaker before evacuating inundated premises.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <span><strong>Emergency Supplies:</strong> Pack identification documents, prescription medicines, and cell phone charger.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <span><strong>Avoid Flooded Roads:</strong> Do not drive through Saidapet Subway or Vijayanagar low points.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Nearest Shelter, Hospital, and Road Warnings Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Nearest Shelter Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-400 uppercase">{t.nearestShelter}</span>
                  <span className="font-mono text-xs text-slate-400">0.8 km</span>
                </div>
                <h4 className="text-sm font-bold text-white">{nearestShelter.name}</h4>
                <p className="text-xs text-slate-400">{nearestShelter.address}</p>
                <div className="font-mono text-xs text-emerald-300 font-bold">
                  Beds: {nearestShelter.occupancy} / {nearestShelter.capacity} occupied
                </div>
              </div>

              <button
                onClick={() => setActiveSubTab('route')}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-2 px-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
              >
                <Navigation className="h-3.5 w-3.5" />
                Navigate to Shelter
              </button>
            </div>

            {/* Nearest Hospital Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-cyan-400 uppercase">{t.nearestHospital}</span>
                  <span className="font-mono text-xs text-slate-400">1.2 km</span>
                </div>
                <h4 className="text-sm font-bold text-white">{nearestHospital.name}</h4>
                <p className="text-xs text-slate-400">{nearestHospital.address}</p>
                <div className="font-mono text-xs text-cyan-300 font-bold">
                  Available Beds: {nearestHospital.availableBeds} | ICU: {nearestHospital.icuBeds}
                </div>
              </div>

              <a
                href={`tel:${nearestHospital.contactPhone}`}
                className="mt-3 flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 py-2 px-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
              >
                <Phone className="h-3.5 w-3.5" />
                Call Hospital ({nearestHospital.contactPhone})
              </a>
            </div>

            {/* Road Warnings Card */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-mono text-xs font-bold text-amber-400 uppercase">{t.roadWarnings}</span>
                <span className="font-mono text-xs text-red-400">2 Blocked</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="rounded-lg border border-red-500/30 bg-red-950/30 p-2.5">
                  <div className="font-bold text-red-300">Saidapet Railway Subway</div>
                  <div className="text-[11px] text-slate-300">Water Depth: 1.4m (Impassable)</div>
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-950/30 p-2.5">
                  <div className="font-bold text-amber-300">Velachery Main Road</div>
                  <div className="text-[11px] text-slate-300">Water Depth: 75cm (Boats/4x4 Only)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: RISK MAP VIEW */}
      {activeSubTab === 'map' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              {t.riskMap} - Chennai Sector Boundaries & Telemetry
            </h3>
          </div>
          <RiskMap className="min-h-[500px]" />
        </div>
      )}

      {/* 3. TAB: SAFE ROUTE VIEW */}
      {activeSubTab === 'route' && (
        <div className="space-y-6">
          {/* Origin & Destination Route Query Panel */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 backdrop-blur-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Navigation className="h-5 w-5 text-emerald-400" />
                  {t.safeRoute} Engine - Multi-Option Route Optimizer
                </h3>
                <p className="text-xs text-slate-300">
                  Calculates evacuation corridors weighted by flood penalties, subway blockages, and hazard severity.
                </p>
              </div>
              <span className="font-mono text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/30">
                COST PENALTY MODEL ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Origin Location</label>
                <select
                  value={routeOrigin}
                  onChange={(e) => setRouteOrigin(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Velachery Lowlands (Zone 4)">Velachery Lowlands (Zone 4)</option>
                  <option value="Adyar Riverbank (Zone 2)">Adyar Riverbank (Zone 2)</option>
                  <option value="Saidapet Subway Sector (Zone 5)">Saidapet Subway Sector (Zone 5)</option>
                  <option value="T Nagar Commercial Hub (Zone 4)">T Nagar Commercial Hub (Zone 4)</option>
                  <option value="Guindy Industrial Estate (Zone 3)">Guindy Industrial Estate (Zone 3)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">Destination Facility</label>
                <select
                  value={routeDestination}
                  onChange={(e) => setRouteDestination(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Velachery Community Hall Shelter">Velachery Community Hall Shelter</option>
                  <option value="Kotturpuram Community High School Shelter">Kotturpuram Community High School Shelter</option>
                  <option value="Apollo Speciality Hospital Velachery">Apollo Speciality Hospital Velachery</option>
                  <option value="Perungudi World Trade Center Relief Hub">Perungudi World Trade Center Relief Hub</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleGenerateRoutes}
                  disabled={isCalculatingRoute}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 p-2.5 text-xs font-bold text-slate-950 transition-all hover:scale-[1.01]"
                >
                  <Navigation className="h-4 w-4" />
                  <span>{isCalculatingRoute ? 'Calculating Cost Penalty...' : 'Calculate Safe Routes'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Generated Route Options Grid (Safest vs Shortest) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routeResult.routes.map((rt) => {
              const isSelected = selectedRouteId === rt.id;
              const isSafest = rt.type === 'safest';
              return (
                <div
                  key={rt.id}
                  onClick={() => setSelectedRouteId(rt.id)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all space-y-3 backdrop-blur-md ${
                    isSelected
                      ? isSafest
                        ? 'border-emerald-500 bg-emerald-950/20 shadow-xl shadow-emerald-500/10'
                        : 'border-red-500 bg-red-950/20 shadow-xl shadow-red-500/10'
                      : 'border-slate-800 bg-slate-900/70 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`rounded px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase ${
                            isSafest
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-red-500/20 text-red-300 border border-red-500/40'
                          }`}
                        >
                          {isSafest ? 'RECOMMENDED SAFEST ROUTE' : 'SHORTEST DIRECT (HIGH HAZARD)'}
                        </span>
                        {isSelected && (
                          <span className="font-mono text-[9px] text-cyan-400 font-bold">✓ ACTIVE ON MAP</span>
                        )}
                      </div>
                      <h4 className="text-base font-bold text-white">{rt.name}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 font-mono text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800">
                    <div>
                      <span className="text-slate-500 text-[10px] block">DISTANCE</span>
                      <span className="font-bold text-white">{rt.distanceKm} km</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">ETA</span>
                      <span className="font-bold text-cyan-300">{rt.etaMins} mins</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">RISK SCORE</span>
                      <span className={`font-bold ${isSafest ? 'text-emerald-400' : 'text-red-400'}`}>
                        {rt.riskScore} / 100 ({rt.riskLevel})
                      </span>
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="font-mono text-slate-400 font-bold uppercase text-[10px]">SAFETY EXPLANATION:</span>
                    <p className="text-slate-300 leading-relaxed bg-slate-900 p-2.5 rounded-lg border border-slate-800 text-[11px]">
                      {rt.safetyExplanation}
                    </p>
                  </div>

                  {/* Route Cost Equation Breakdown */}
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 text-[11px] font-mono space-y-1">
                    <div className="text-slate-400 font-bold flex items-center justify-between">
                      <span>ROUTE COST PENALTY:</span>
                      <span className={`font-bold ${isSafest ? 'text-emerald-400' : 'text-red-400'}`}>
                        {rt.costBreakdown.totalRouteCost.toFixed(1)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Cost = {rt.costBreakdown.distanceKm}km × {rt.costBreakdown.floodPenalty} (flood) × {rt.costBreakdown.roadClosurePenalty} (closure) × {rt.costBreakdown.hazardPenalty} (hazard)
                    </div>
                  </div>

                  <div className="text-xs space-y-1">
                    <span className="font-mono text-red-400 font-bold uppercase text-[10px]">ROADS TO AVOID:</span>
                    <ul className="space-y-1">
                      {rt.roadsToAvoid.map((rd, idx) => (
                        <li key={idx} className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                          <AlertTriangle className="h-3 w-3 text-red-400 shrink-0" />
                          <span>{rd}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Leaflet Route Map Overlay */}
          <div className="space-y-2">
            <h4 className="text-xs font-mono font-bold text-slate-300 uppercase">
              EVACUATION ROUTE POLYLINE VISUALIZATION ON GIS CANVAS:
            </h4>
            <RiskMap
              className="min-h-[460px]"
              activeRoutePolyline={(() => {
                const currentRoute = routeResult?.routes?.find((r) => r.id === selectedRouteId) || routeResult?.routes?.[0];
                if (!currentRoute) return null;
                return {
                  coords: currentRoute.polylineCoords,
                  color: currentRoute.type === 'safest' ? '#10B981' : '#EF4444',
                  dashArray: currentRoute.type === 'shortest' ? '6, 6' : undefined,
                  name: currentRoute.name
                };
              })()}
            />
          </div>
        </div>
      )}

      {/* 4. TAB: SHELTERS & RESOURCE FINDER VIEW */}
      {activeSubTab === 'shelters' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Home className="h-4 w-4 text-emerald-400" />
              {t.shelters} & Emergency Resource Directory
            </h3>
            <span className="font-mono text-xs text-emerald-400">LIVE RESOURCE REPOSITORY</span>
          </div>

          <ResourceFinder onNavigate={() => setActiveSubTab('route')} />
        </div>
      )}

      {/* 5. TAB: REPORT HAZARD VIEW */}
      {activeSubTab === 'report' && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-2xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Send className="h-5 w-5 text-amber-400" />
              {t.reportFormTitle}
            </h3>
            <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded">
              TRANSMITS TO EOC DESK
            </span>
          </div>

          {submissionResult ? (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 p-5 space-y-4 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle className="h-6 w-6 text-emerald-400 shrink-0" />
                <span>{t.reportSubmittedTitle}</span>
              </div>

              <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 space-y-2 font-mono text-slate-300">
                <div className="flex justify-between"><span>REPORT ID:</span><span className="text-cyan-400 font-bold">{submissionResult.report.id}</span></div>
                <div className="flex justify-between"><span>REPORT STATUS:</span><span className="text-amber-400 font-bold">{submissionResult.report.status}</span></div>
                <div className="flex justify-between"><span>AI CONFIDENCE SCORE:</span><span className="text-emerald-400 font-bold">{submissionResult.verification.confidence_score}%</span></div>
                <div className="flex justify-between"><span>VERIFICATION:</span><span className="text-emerald-300 font-bold">{submissionResult.verification.verification_status}</span></div>
              </div>

              <div className="space-y-1">
                <span className="font-mono text-slate-400 font-bold uppercase text-[10px]">AI VERIFICATION REASONS:</span>
                {submissionResult.verification.reasons?.map((reason: string, idx: number) => (
                  <div key={idx} className="text-slate-300 text-[11px]">{reason}</div>
                ))}
              </div>

              <button
                onClick={() => setSubmissionResult(null)}
                className="w-full rounded-xl bg-cyan-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-cyan-400"
              >
                Submit Another Report
              </button>
            </div>
          ) : (
            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{t.hazardType}</label>
                <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                >
                  <option value="Flash Flood / High Water Level">Flash Flood / High Water Level</option>
                  <option value="Downed Power Line / Outage">Downed Power Line / Electrical Hazard</option>
                  <option value="Blocked Roadway">Road Inundation / Debris Blockade</option>
                  <option value="Medical Emergency">Medical Rescue Needed</option>
                  <option value="Extreme Heat Distress">Extreme Heat Wave Distress</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{t.waterLevelInput}</label>
                <input
                  type="text"
                  value={waterLevelInput}
                  onChange={(e) => setWaterLevelInput(e.target.value)}
                  placeholder="e.g. 2.5 feet (75 cm)"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{t.description}</label>
                <textarea
                  rows={3}
                  value={descriptionInput}
                  onChange={(e) => setDetailsInput(e.target.value)}
                  placeholder="Describe ground observation details..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              {/* Photo Evidence Selector Simulation */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <Camera className="h-4 w-4 text-cyan-400" />
                  <span>{t.uploadPhoto}</span>
                </div>
                <span className="font-mono text-emerald-400 text-[11px] font-bold">
                  {photoSelected ? '✓ Image Attached (flood_photo.jpg)' : 'Select Image'}
                </span>
              </div>

              {/* GPS Telemetry Indicator */}
              <div className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300">
                  <MapPin className="h-4 w-4 text-red-400" />
                  <span>{t.gpsDetected}</span>
                </div>
                <span className="font-mono text-cyan-300 font-bold">12.9785° N, 80.2206° E</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3 text-xs font-bold text-slate-950 shadow-lg transition-all hover:scale-[1.01]"
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? 'Transmitting Report...' : t.submitReportBtn}</span>
              </button>
            </form>
          )}
        </div>
      )}

      {/* 6. TAB: ALERTS VIEW */}
      {activeSubTab === 'alerts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Radio className="h-4 w-4 text-red-400" />
              {t.alerts} - Public Emergency Advisories & Broadcast Sirens
            </h3>
            <span className="font-mono text-xs text-slate-400">{alerts.length} Active Alerts</span>
          </div>

          <div className="space-y-4">
            {alerts.map((alt) => (
              <AlertCard key={alt.id} alert={alt} />
            ))}
          </div>
        </div>
      )}

      {/* 7. TAB: EMERGENCY VIEW */}
      {activeSubTab === 'emergency' && (
        <div className="max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/90 p-6 backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-red-400" />
              {t.emergencyHelplines}
            </h3>
            <span className="font-mono text-xs text-red-400 font-bold uppercase">24/7 TOLL FREE</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <a
              href="tel:108"
              className="flex items-center justify-between rounded-xl border border-red-500/40 bg-red-950/30 p-4 transition-all hover:bg-red-900/40"
            >
              <div>
                <div className="font-bold text-red-300 text-sm">{t.ambulance}</div>
                <div className="text-slate-400 text-[11px]">Medical Rescues & Ambulances</div>
              </div>
              <span className="font-mono text-lg font-extrabold text-red-400">108</span>
            </a>

            <a
              href="tel:101"
              className="flex items-center justify-between rounded-xl border border-amber-500/40 bg-amber-950/30 p-4 transition-all hover:bg-amber-900/40"
            >
              <div>
                <div className="font-bold text-amber-300 text-sm">{t.fireRescue}</div>
                <div className="text-slate-400 text-[11px]">Flood Extraction & Fire Team</div>
              </div>
              <span className="font-mono text-lg font-extrabold text-amber-400">101</span>
            </a>

            <a
              href="tel:1070"
              className="flex items-center justify-between rounded-xl border border-cyan-500/40 bg-cyan-950/30 p-4 transition-all hover:bg-cyan-900/40"
            >
              <div>
                <div className="font-bold text-cyan-300 text-sm">{t.stateEmergency}</div>
                <div className="text-slate-400 text-[11px]">State Disaster Operations</div>
              </div>
              <span className="font-mono text-lg font-extrabold text-cyan-400">1070</span>
            </a>

            <a
              href="tel:1913"
              className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-4 transition-all hover:bg-emerald-900/40"
            >
              <div>
                <div className="font-bold text-emerald-300 text-sm">{t.gccHelpline}</div>
                <div className="text-slate-400 text-[11px]">Chennai Corp Control Room</div>
              </div>
              <span className="font-mono text-lg font-extrabold text-emerald-400">1913</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
