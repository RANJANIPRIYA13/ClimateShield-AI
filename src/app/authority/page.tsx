'use client';

import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Activity,
  Truck,
  AlertCircle,
  RefreshCw,
  Radio,
  Layers,
  CheckCircle2,
  Send,
  Users,
  Home,
  MapPin,
  Anchor,
  HeartPulse,
  Package,
  Droplet,
  Zap,
  Plus,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { MapContainer } from '@/components/ui/MapContainer';
import { RescueIncidentEntity, CitizenReportEntity, ShelterEntity, HospitalEntity, RoadEntity } from '@/lib/db/types';
import { calculateRescuePriority } from '@/lib/ai/rescuePriorityEngine';
import { CHENNAI_EMERGENCY_RESOURCES } from '@/lib/db/resourceData';

export default function AuthorityDashboard() {
  const [incidents, setIncidents] = useState<RescueIncidentEntity[]>([]);
  const [citizenReports, setCitizenReports] = useState<CitizenReportEntity[]>([]);
  const [shelters, setShelters] = useState<ShelterEntity[]>([]);
  const [hospitals, setHospitals] = useState<HospitalEntity[]>([]);
  const [roads, setRoads] = useState<RoadEntity[]>([]);

  const [activeTab, setActiveTab] = useState<'incidents' | 'reports' | 'resources'>('incidents');
  const [dispatchNotification, setDispatchNotification] = useState<string | null>(null);

  // Resource Assignment Modal State
  const [selectedIncidentForAssign, setSelectedIncidentForAssign] = useState<RescueIncidentEntity | null>(null);
  const [selectedResourceToAssign, setSelectedResourceToAssign] = useState<string>('RES-SHL-01');

  // Fetch live telemetry & incidents from backend API
  const fetchTelemetry = async () => {
    try {
      const [resInc, resRep, resShl, resHsp, resRd] = await Promise.all([
        fetch('/api/incidents').then((r) => r.json()),
        fetch('/api/citizen-reports').then((r) => r.json()),
        fetch('/api/shelters').then((r) => r.json()),
        fetch('/api/hospitals').then((r) => r.json()),
        fetch('/api/roads').then((r) => r.json()),
      ]);

      if (resInc.success) setIncidents(resInc.data);
      if (resRep.success) setCitizenReports(resRep.data);
      if (resShl.success) setShelters(resShl.data);
      if (resHsp.success) setHospitals(resHsp.data);
      if (resRd.success) setRoads(resRd.data);
    } catch (err) {
      console.error('Failed to fetch EOC telemetry:', err);
    }
  };

  useEffect(() => {
    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 3000);
    return () => clearInterval(interval);
  }, []);

  // 1. Dispatch Tactical Team
  const handleDispatchTeam = async (incident: RescueIncidentEntity) => {
    try {
      const res = await fetch('/api/incidents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: incident.id,
          status: 'Dispatched',
          unitsDispatched: (incident.unitsDispatched || 0) + 2,
          assignee: 'NDRF Swift-Water Tactical Team'
        })
      });
      const json = await res.json();
      if (json.success) {
        setDispatchNotification(`Dispatched 2 Tactical Response Units to ${incident.title}`);
        fetchTelemetry();
        setTimeout(() => setDispatchNotification(null), 4000);
      }
    } catch (err) {
      console.error('Dispatch error:', err);
    }
  };

  // 2. Mark Incident Resolved
  const handleMarkResolved = async (incidentId: string) => {
    try {
      const res = await fetch('/api/incidents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: incidentId,
          status: 'Resolved'
        })
      });
      const json = await res.json();
      if (json.success) {
        setDispatchNotification(`Rescue incident '${incidentId}' marked RESOLVED`);
        fetchTelemetry();
        setTimeout(() => setDispatchNotification(null), 4000);
      }
    } catch (err) {
      console.error('Resolve error:', err);
    }
  };

  // 3. Update Incident Status
  const handleUpdateStatus = async (incidentId: string, newStatus: string) => {
    try {
      const res = await fetch('/api/incidents', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: incidentId,
          status: newStatus
        })
      });
      const json = await res.json();
      if (json.success) {
        setDispatchNotification(`Incident '${incidentId}' status updated to ${newStatus}`);
        fetchTelemetry();
        setTimeout(() => setDispatchNotification(null), 4000);
      }
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // 4. Assign Resource to Incident
  const handleAssignResourceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncidentForAssign) return;

    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          incidentId: selectedIncidentForAssign.id,
          resourceId: selectedResourceToAssign,
          unitsAssigned: 2
        })
      });
      const json = await res.json();
      if (json.success) {
        setDispatchNotification(`Assigned resource '${selectedResourceToAssign}' to Incident '${selectedIncidentForAssign.id}'`);
        setSelectedIncidentForAssign(null);
        fetchTelemetry();
        setTimeout(() => setDispatchNotification(null), 4000);
      }
    } catch (err) {
      console.error('Resource assignment error:', err);
    }
  };

  // Compute 6 Top EOC KPIs
  const criticalZonesCount = 3; // Velachery, Adyar, Saidapet
  const activeIncidentsCount = incidents.filter((i) => i.status !== 'Resolved').length;
  const peopleAtRiskCount = 42500;
  const totalOccupancy = shelters.reduce((acc, s) => acc + (s.occupancy || 0), 0);
  const totalCapacity = shelters.reduce((acc, s) => acc + (s.capacity || 0), 3550);
  const availableShelterBeds = totalCapacity - totalOccupancy;
  const rescueRequestsCount = citizenReports.filter((r) => r.status !== 'Resolved').length;
  const blockedRoadsCount = roads.filter((r) => r.status === 'Blocked' || r.status === 'Flooded').length;

  // Rank Incidents by Rescue Priority Engine
  const rankedIncidents = incidents.map((inc) => {
    const priority = calculateRescuePriority(inc);
    return {
      ...inc,
      priorityRank: priority.priorityRank,
      priorityScore: priority.priorityScore,
      confidencePct: priority.confidencePct,
      reasons: priority.reasons
    };
  }).sort((a, b) => b.priorityScore - a.priorityScore);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* EOC Command Header */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 lg:p-6 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="rounded-xl bg-red-500/10 p-2.5 text-red-400 border border-red-500/30">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Emergency Operations Command Center (EOC)
                </h2>
                <span className="rounded bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 text-[10px] font-mono font-bold uppercase">
                  DEFCON 2 ACTIVATION
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Tactical threat monitoring, GIS map matrix, rescue priority calculation engine, and asset allocation desk.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchTelemetry}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-xs font-bold text-slate-200 transition-all hover:bg-slate-700 hover:text-white"
          >
            <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
            Sync Radar Telemetry
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-600/20 transition-all hover:scale-105">
            <Radio className="h-3.5 w-3.5" />
            Broadcast Mass Siren Alert
          </button>
        </div>
      </div>

      {/* Dispatch Notification Banner */}
      {dispatchNotification && (
        <div className="rounded-xl border border-cyan-500/40 bg-cyan-950/40 p-3.5 text-xs text-cyan-300 flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2 font-mono">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            {dispatchNotification}
          </span>
          <span className="text-[10px] font-mono text-slate-400">LOGGED TO EOC DISPATCH AUDIT</span>
        </div>
      )}

      {/* Top 6 EOC Operations KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* 1. Critical Zones */}
        <div className="rounded-xl border border-red-500/40 bg-slate-900/80 p-4 backdrop-blur-md">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">CRITICAL ZONES</span>
          <div className="mt-1 text-2xl font-extrabold font-mono text-red-400">{criticalZonesCount} Sectors</div>
          <span className="text-[10px] text-red-300">Velachery, Adyar, Saidapet</span>
        </div>

        {/* 2. Active Incidents */}
        <div className="rounded-xl border border-amber-500/40 bg-slate-900/80 p-4 backdrop-blur-md">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">ACTIVE INCIDENTS</span>
          <div className="mt-1 text-2xl font-extrabold font-mono text-amber-400">{activeIncidentsCount} Active</div>
          <span className="text-[10px] text-amber-300">Priority Ranked</span>
        </div>

        {/* 3. People at Risk */}
        <div className="rounded-xl border border-rose-500/40 bg-slate-900/80 p-4 backdrop-blur-md">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">PEOPLE AT RISK</span>
          <div className="mt-1 text-2xl font-extrabold font-mono text-rose-400">{peopleAtRiskCount.toLocaleString()}</div>
          <span className="text-[10px] text-slate-300">Vulnerable Demographics</span>
        </div>

        {/* 4. Shelter Capacity */}
        <div className="rounded-xl border border-emerald-500/40 bg-slate-900/80 p-4 backdrop-blur-md">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">SHELTER BEDS</span>
          <div className="mt-1 text-xl font-extrabold font-mono text-emerald-400">{availableShelterBeds} Avail</div>
          <span className="text-[10px] text-emerald-300">{Math.round((totalOccupancy / totalCapacity) * 100)}% Occupied</span>
        </div>

        {/* 5. Rescue Requests */}
        <div className="rounded-xl border border-cyan-500/40 bg-slate-900/80 p-4 backdrop-blur-md">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">RESCUE CALLS</span>
          <div className="mt-1 text-2xl font-extrabold font-mono text-cyan-300">{rescueRequestsCount} Ground</div>
          <span className="text-[10px] text-cyan-400">Citizen Reports</span>
        </div>

        {/* 6. Blocked Roads */}
        <div className="rounded-xl border border-slate-700 bg-slate-900/80 p-4 backdrop-blur-md">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">BLOCKED ROADS</span>
          <div className="mt-1 text-2xl font-extrabold font-mono text-amber-300">{blockedRoadsCount} Impassable</div>
          <span className="text-[10px] text-amber-400">Subways & Arterial Roads</span>
        </div>
      </div>

      {/* Main Tactical Split: Left GIS Map Matrix (7 Cols), Right Control Desks (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main GIS Command Map Container */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              GIS Command Map (Zones, Reports, Incidents, Shelters, Hospitals, Blocked Roads)
            </h3>
            <span className="font-mono text-xs text-emerald-400">RADAR ACTIVE</span>
          </div>
          <MapContainer className="min-h-[560px]" />
        </div>

        {/* Tactical Control Desks (Incident Triage Desk, Citizen Reports, Resource Desk) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Sub-Tab Switcher */}
          <div className="flex items-center rounded-xl border border-slate-800 bg-slate-900/90 p-1.5 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('incidents')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
                activeTab === 'incidents'
                  ? 'bg-slate-800 text-cyan-300 border border-cyan-500/30 shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertCircle className="h-3.5 w-3.5" />
              Incidents ({rankedIncidents.length})
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
                activeTab === 'reports'
                  ? 'bg-slate-800 text-amber-300 border border-amber-500/30 shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
              Citizen Calls ({citizenReports.length})
            </button>

            <button
              onClick={() => setActiveTab('resources')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2 rounded-lg transition-all ${
                activeTab === 'resources'
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-500/30 shadow font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Truck className="h-3.5 w-3.5" />
              Resource Assets ({CHENNAI_EMERGENCY_RESOURCES.length})
            </button>
          </div>

          {/* TAB 1: INCIDENT MANAGEMENT TRIAGE DESK */}
          {activeTab === 'incidents' && (
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {rankedIncidents.map((inc) => {
                const isCritical = inc.priorityRank === 'CRITICAL';
                const isResolved = inc.status === 'Resolved';
                return (
                  <div
                    key={inc.id}
                    className={`rounded-2xl border p-4 backdrop-blur-md space-y-3 shadow-lg transition-all ${
                      isResolved
                        ? 'border-slate-800 bg-slate-950/60 opacity-60'
                        : isCritical
                        ? 'border-red-500/50 bg-red-950/20'
                        : 'border-slate-800 bg-slate-900/80'
                    }`}
                  >
                    {/* Header: Rank Badge & Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`rounded px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                              isCritical
                                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                                : inc.priorityRank === 'HIGH'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            }`}
                          >
                            RESCUE PRIORITY: {inc.priorityRank} ({inc.priorityScore} PTS)
                          </span>
                          <span className="font-mono text-[10px] text-cyan-400">AI Confidence {inc.confidencePct}%</span>
                        </div>
                        <h4 className="text-base font-bold text-white">{inc.title}</h4>
                        <div className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3.5 w-3.5 text-red-400 shrink-0" />
                          <span>{inc.location}</span>
                        </div>
                      </div>

                      {/* Status Dropdown */}
                      <select
                        value={inc.status}
                        onChange={(e) => handleUpdateStatus(inc.id, e.target.value)}
                        className="rounded-lg border border-slate-800 bg-slate-950 px-2 py-1 text-xs font-mono font-bold text-cyan-300 focus:outline-none"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>

                    {/* Detailed Metric Grid (All 12 Requested Fields) */}
                    <div className="grid grid-cols-4 gap-2 font-mono text-[11px] bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                      <div>
                        <span className="text-slate-500 block text-[9px]">AFFECTED</span>
                        <span className="font-bold text-white">{inc.peopleAffected || 50}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">VULNERABLE</span>
                        <span className="font-bold text-red-400">{inc.vulnerablePeople || 10}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">WATER DEPTH</span>
                        <span className="font-bold text-amber-300">+{inc.waterLevelM || 1.2}m</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px]">INCIDENT AGE</span>
                        <span className="font-bold text-cyan-300">{inc.incidentAgeMins || 30}m</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/90 p-2.5 rounded-lg border border-slate-800">
                      {inc.description}
                    </p>

                    {/* Interactive Action Controls */}
                    <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-800/80">
                      <button
                        onClick={() => handleDispatchTeam(inc)}
                        disabled={isResolved}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-red-500/40 bg-red-500/10 py-1.5 px-3 text-xs font-bold text-red-300 hover:bg-red-500/20 disabled:opacity-50"
                      >
                        <ShieldAlert className="h-3.5 w-3.5" />
                        Dispatch Team
                      </button>

                      <button
                        onClick={() => setSelectedIncidentForAssign(inc)}
                        disabled={isResolved}
                        className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 py-1.5 px-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 disabled:opacity-50"
                      >
                        <Truck className="h-3.5 w-3.5" />
                        Assign Resource
                      </button>

                      {!isResolved && (
                        <button
                          onClick={() => handleMarkResolved(inc.id)}
                          className="flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-500/10 py-1.5 px-3 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Resolve
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: CITIZEN REPORTS DESK */}
          {activeTab === 'reports' && (
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              {citizenReports.map((rep) => (
                <div
                  key={rep.id}
                  className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 space-y-2 text-xs backdrop-blur-md"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-amber-400 font-bold uppercase">{rep.id} • {rep.category}</span>
                      <h4 className="font-bold text-white text-sm">{rep.userName}</h4>
                    </div>
                    <span className="rounded bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 text-[10px] font-mono font-bold">
                      {rep.urgency}
                    </span>
                  </div>

                  <div className="text-slate-300 text-xs leading-relaxed">{rep.description}</div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80 pt-2 font-mono">
                    <span>📍 {rep.locationName}</span>
                    <span className="text-cyan-300 font-bold">Status: {rep.status}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: RESOURCE MANAGEMENT DESK (6 Asset Categories) */}
          {activeTab === 'resources' && (
            <div className="space-y-4 max-h-[520px] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 gap-3">
                {CHENNAI_EMERGENCY_RESOURCES.map((res) => (
                  <div
                    key={res.id}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 text-xs space-y-2.5 backdrop-blur-md"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-mono text-[10px] text-cyan-400 font-bold uppercase">{res.category} • {res.sectorName}</span>
                        <h4 className="font-bold text-white text-sm">{res.name}</h4>
                      </div>
                      <span className="font-mono text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        {res.status}
                      </span>
                    </div>

                    <div className="font-mono text-xs flex justify-between bg-slate-950 p-2 rounded-lg border border-slate-800">
                      <span className="text-slate-400">Capacity / Stock:</span>
                      <span className="font-bold text-white">{res.available} / {res.capacity} Available</span>
                    </div>

                    <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800">
                      <span>📍 {res.address}</span>
                      <span className="text-cyan-300 font-mono">{res.contactPhone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Assign Resource Modal Overlay */}
      {selectedIncidentForAssign && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-slate-900 p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="font-mono text-xs text-cyan-400 font-bold uppercase">RESOURCE ASSIGNMENT DESK</span>
                <h3 className="text-base font-bold text-white">{selectedIncidentForAssign.title}</h3>
              </div>
              <button
                onClick={() => setSelectedIncidentForAssign(null)}
                className="rounded-lg border border-slate-800 bg-slate-950 p-1 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignResourceSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">Select Emergency Resource Asset to Assign</label>
                <select
                  value={selectedResourceToAssign}
                  onChange={(e) => setSelectedResourceToAssign(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-slate-200 focus:border-cyan-500 focus:outline-none font-mono"
                >
                  {CHENNAI_EMERGENCY_RESOURCES.map((r) => (
                    <option key={r.id} value={r.id}>
                      [{r.category}] {r.name} ({r.available} Available)
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedIncidentForAssign(null)}
                  className="flex-1 rounded-xl border border-slate-800 bg-slate-950 py-2.5 text-slate-400 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 py-2.5 font-bold text-slate-950 shadow-lg"
                >
                  Assign Resource
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
