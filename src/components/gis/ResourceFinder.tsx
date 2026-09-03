'use client';

import React, { useState, useMemo } from 'react';
import {
  Home,
  Hospital,
  Utensils,
  Droplet,
  Zap,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Phone,
  MapPin,
  ShieldCheck,
  AlertCircle,
  Navigation
} from 'lucide-react';
import { CHENNAI_EMERGENCY_RESOURCES, EmergencyResourceItem } from '@/lib/db/resourceData';

interface ResourceFinderProps {
  onNavigate?: (resource: EmergencyResourceItem) => void;
}

export const ResourceFinder: React.FC<ResourceFinderProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'distance' | 'available'>('distance');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredResources = useMemo(() => {
    return CHENNAI_EMERGENCY_RESOURCES.filter((res) => {
      if (selectedCategory !== 'All' && res.category !== selectedCategory) return false;
      if (selectedStatus === 'Open' && res.status !== 'Open') return false;
      if (selectedStatus === 'Ready' && res.status !== 'Ready') return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          res.name.toLowerCase().includes(q) ||
          res.address.toLowerCase().includes(q) ||
          res.sectorName.toLowerCase().includes(q)
        );
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'distance') {
        return a.distanceKm - b.distanceKm;
      } else {
        return b.available - a.available;
      }
    });
  }, [selectedCategory, selectedStatus, sortBy, searchQuery]);

  const categories = [
    { id: 'All', label: 'All Resources', icon: ShieldCheck },
    { id: 'Shelter', label: 'Shelters', icon: Home },
    { id: 'Hospital', label: 'Hospitals', icon: Hospital },
    { id: 'Food Center', label: 'Food Centers', icon: Utensils },
    { id: 'Water Station', label: 'Water Stations', icon: Droplet },
    { id: 'Charging Station', label: 'Charging Stations', icon: Zap }
  ];

  return (
    <div className="space-y-5">
      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all font-semibold shrink-0 ${
                isActive
                  ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300 shadow'
                  : 'border-slate-800 bg-slate-900/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search, Filter & Sort Controls Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Search Input */}
        <div className="relative">
          <Search className="h-4 w-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources, sectors..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 pl-9 pr-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          <span className="text-slate-400 font-mono text-[11px]">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent text-slate-200 focus:outline-none w-full font-semibold"
          >
            <option value="All" className="bg-slate-900">All Statuses</option>
            <option value="Open" className="bg-slate-900">Open Only</option>
            <option value="Ready" className="bg-slate-900">Ready Only</option>
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950 px-3 py-2">
          <ArrowUpDown className="h-4 w-4 text-slate-500 shrink-0" />
          <span className="text-slate-400 font-mono text-[11px]">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-transparent text-slate-200 focus:outline-none w-full font-semibold"
          >
            <option value="distance" className="bg-slate-900">Nearest Distance</option>
            <option value="available" className="bg-slate-900">Highest Available Capacity</option>
          </select>
        </div>
      </div>

      {/* Resource Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredResources.map((res) => {
          const occupancyPct = res.capacity > 0 ? Math.round((res.occupied / res.capacity) * 100) : 0;
          return (
            <div
              key={res.id}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-3.5 shadow-lg hover:border-slate-700 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-[10px] font-bold text-cyan-400 uppercase">
                      {res.category} • {res.sectorName}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[9px] font-mono font-bold uppercase ${
                        res.status === 'Open'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : res.status === 'Ready'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {res.status}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-white">{res.name}</h4>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                    <span>{res.address}</span>
                  </div>
                </div>
                <span className="font-mono text-xs font-bold text-cyan-300 shrink-0">
                  {res.distanceKm} km
                </span>
              </div>

              {/* Capacity Progress Bar */}
              <div className="space-y-1 font-mono text-xs border-t border-slate-800/80 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Capacity & Available Units:</span>
                  <span className="font-bold text-white">
                    {res.available.toLocaleString()} / {res.capacity.toLocaleString()} available
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      occupancyPct >= 90
                        ? 'bg-red-500'
                        : occupancyPct > 60
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                  />
                </div>
              </div>

              {/* Medical & Accessibility Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-slate-950/60 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-300 flex items-start gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Medical:</strong> {res.medicalSupport}</span>
                </div>
                <div className="text-slate-300 flex items-start gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong>Access:</strong> {res.accessibility}</span>
                </div>
              </div>

              {/* Facilities tags */}
              <div className="flex flex-wrap gap-1.5">
                {res.facilities.map((fac) => (
                  <span
                    key={fac}
                    className="rounded bg-slate-800 border border-slate-700/60 px-2 py-0.5 text-[10px] text-slate-300 font-mono"
                  >
                    • {fac}
                  </span>
                ))}
              </div>

              {/* Footer Phone & Navigation Trigger */}
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                <a
                  href={`tel:${res.contactPhone}`}
                  className="flex items-center gap-1.5 text-slate-300 hover:text-cyan-300 font-mono text-[11px]"
                >
                  <Phone className="h-3.5 w-3.5 text-cyan-400" />
                  <span>{res.contactPhone}</span>
                </a>

                {onNavigate && (
                  <button
                    onClick={() => onNavigate(res)}
                    className="flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-3 py-1.5 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20"
                  >
                    <Navigation className="h-3.5 w-3.5" />
                    <span>Safe Route</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
