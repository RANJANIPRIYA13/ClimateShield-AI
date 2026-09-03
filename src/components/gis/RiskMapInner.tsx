'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RiskZoneEntity, ShelterEntity, HospitalEntity, CitizenReportEntity, RoadEntity } from '@/lib/db/types';

// Custom SVG Icons for Leaflet
const createCustomIcon = (svgHtml: string) => {
  return L.divIcon({
    html: svgHtml,
    className: 'custom-leaflet-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
};

const incidentIcon = createCustomIcon(`
  <div style="background: rgba(239, 68, 68, 0.2); border: 2px solid #EF4444; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(239,68,68,0.8);">
    <div style="background: #EF4444; width: 10px; height: 10px; border-radius: 50%;"></div>
  </div>
`);

const shelterIcon = createCustomIcon(`
  <div style="background: rgba(16, 185, 129, 0.2); border: 2px solid #10B981; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(16,185,129,0.8);">
    <div style="background: #10B981; width: 10px; height: 10px; border-radius: 50%;"></div>
  </div>
`);

const hospitalIcon = createCustomIcon(`
  <div style="background: rgba(6, 182, 212, 0.2); border: 2px solid #06B6D4; border-radius: 50%; width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(6,182,212,0.8);">
    <div style="background: #06B6D4; width: 10px; height: 10px; border-radius: 50%;"></div>
  </div>
`);

const userLocationIcon = createCustomIcon(`
  <div style="background: rgba(59, 130, 246, 0.3); border: 2px solid #3B82F6; border-radius: 50%; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 16px rgba(59,130,246,1);">
    <div style="background: #60A5FA; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>
  </div>
`);

// Geolocation Map Recenter Controller Component
function MapRecenterController({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
}

interface RiskMapInnerProps {
  zones: RiskZoneEntity[];
  shelters: ShelterEntity[];
  hospitals: HospitalEntity[];
  reports: CitizenReportEntity[];
  roads: RoadEntity[];
  selectedCategory: string;
  selectedRiskLevel: string;
  onZoneSelect: (zone: RiskZoneEntity) => void;
  userCoords: [number, number] | null;
  showShelters: boolean;
  showHospitals: boolean;
  showIncidents: boolean;
  showRoads: boolean;
  activeRoutePolyline?: {
    coords: [number, number][];
    color: string;
    dashArray?: string;
    name: string;
  } | null;
}

export default function RiskMapInner({
  zones,
  shelters,
  hospitals,
  reports,
  roads,
  selectedCategory,
  selectedRiskLevel,
  onZoneSelect,
  userCoords,
  showShelters,
  showHospitals,
  showIncidents,
  showRoads,
  activeRoutePolyline
}: RiskMapInnerProps) {
  // Filter zones by Category & Risk Level
  const filteredZones = zones.filter((zone) => {
    const matchesCat = selectedCategory === 'All' || zone.category === selectedCategory;
    const matchesRisk = selectedRiskLevel === 'All' || zone.riskLevel === selectedRiskLevel;
    return matchesCat && matchesRisk;
  });

  const getPolygonStyle = (level: string) => {
    switch (level) {
      case 'Critical':
        return { color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.45, weight: 2.5 };
      case 'High':
        return { color: '#F59E0B', fillColor: '#F59E0B', fillOpacity: 0.40, weight: 2.5 };
      case 'Moderate':
        return { color: '#06B6D4', fillColor: '#06B6D4', fillOpacity: 0.35, weight: 2 };
      case 'Low':
      default:
        return { color: '#10B981', fillColor: '#10B981', fillOpacity: 0.30, weight: 2 };
    }
  };

  // Sample polylines for blocked roads in Chennai
  const blockedRoadPolylines = [
    {
      id: 'RD-CHN-01',
      name: 'Velachery Main Road (Flooded 75cm)',
      coords: [[12.975, 80.215], [12.985, 80.225]] as [number, number][]
    },
    {
      id: 'RD-CHN-02',
      name: 'Saidapet Subway (Impassable 140cm)',
      coords: [[13.018, 80.218], [13.024, 80.226]] as [number, number][]
    }
  ];

  return (
    <MapContainer
      center={[12.985, 80.22]}
      zoom={12}
      scrollWheelZoom={true}
      className="w-full h-full min-h-[460px] rounded-xl z-0"
    >
      {/* Standard OpenStreetMap Tiles */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />

      <MapRecenterController center={userCoords} />

      {/* User GPS Geolocation Pin */}
      {userCoords && (
        <Marker position={userCoords} icon={userLocationIcon}>
          <Popup>
            <div className="text-xs font-mono">
              <strong className="text-blue-400">YOUR CURRENT LOCATION</strong>
              <div className="text-slate-300 mt-1">
                LAT: {userCoords[0].toFixed(4)}°, LNG: {userCoords[1].toFixed(4)}°
              </div>
            </div>
          </Popup>
        </Marker>
      )}

      {/* Chennai Risk Polygons */}
      {filteredZones.map((zone) => {
        const style = getPolygonStyle(zone.riskLevel);
        return (
          <Polygon
            key={zone.id}
            positions={zone.polygonCoords}
            pathOptions={style}
            eventHandlers={{
              click: () => onZoneSelect(zone),
              mouseover: (e) => {
                const layer = e.target;
                layer.setStyle({ fillOpacity: 0.65, weight: 3.5 });
              },
              mouseout: (e) => {
                const layer = e.target;
                layer.setStyle(style);
              }
            }}
          >
            <Popup>
              <div className="text-xs font-sans space-y-1">
                <div className="font-mono text-[10px] text-cyan-400 font-semibold">{zone.sectorCode}</div>
                <h4 className="font-bold text-white text-sm">{zone.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-red-400">Score: {zone.riskScore}/10</span>
                  <span className="text-slate-400">• {zone.riskLevel}</span>
                </div>
                <div className="text-[11px] text-slate-300">Rainfall: {zone.rainfallMmHr} mm/hr</div>
                <div className="text-[11px] text-amber-400 font-mono">Click to inspect full EOC diagnostics</div>
              </div>
            </Popup>
          </Polygon>
        );
      })}

      {/* Emergency Shelter Markers */}
      {showShelters &&
        shelters.map((shelter) => (
          <Marker
            key={shelter.id}
            position={[shelter.latitude, shelter.longitude]}
            icon={shelterIcon}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-mono text-[10px] text-emerald-400 font-semibold">EMERGENCY SHELTER</span>
                <h4 className="font-bold text-white">{shelter.name}</h4>
                <div className="text-slate-300">{shelter.address}</div>
                <div className="font-mono text-emerald-300 font-bold mt-1">
                  Occupancy: {shelter.occupancy} / {shelter.capacity} beds
                </div>
                <div className="text-[11px] text-slate-400">Contact: {shelter.contactPhone}</div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Emergency Hospital Markers */}
      {showHospitals &&
        hospitals.map((hosp) => (
          <Marker
            key={hosp.id}
            position={[hosp.latitude, hosp.longitude]}
            icon={hospitalIcon}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-mono text-[10px] text-cyan-400 font-semibold">EMERGENCY HOSPITAL</span>
                <h4 className="font-bold text-white">{hosp.name}</h4>
                <div className="text-slate-300">{hosp.address}</div>
                <div className="font-mono text-cyan-300 font-bold mt-1">
                  Available Beds: {hosp.availableBeds} | ICU: {hosp.icuBeds}
                </div>
                <div className="text-[11px] text-slate-400">Power Backup: {hosp.powerBackup ? 'Active' : 'Offline'}</div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Citizen Incident Markers */}
      {showIncidents &&
        reports.map((report) => (
          <Marker
            key={report.id}
            position={[report.latitude, report.longitude]}
            icon={incidentIcon}
          >
            <Popup>
              <div className="text-xs space-y-1">
                <span className="font-mono text-[10px] text-red-400 font-semibold">CITIZEN INCIDENT REPORT</span>
                <h4 className="font-bold text-white">{report.category}</h4>
                <div className="text-slate-300">{report.locationName}</div>
                <p className="text-[11px] text-slate-400 mt-1">{report.description}</p>
                <div className="font-mono text-amber-300 text-[10px] uppercase">Status: {report.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}

      {/* Blocked Road Polylines */}
      {showRoads &&
        blockedRoadPolylines.map((rd) => (
          <Polyline
            key={rd.id}
            positions={rd.coords}
            pathOptions={{ color: '#EF4444', weight: 4, dashArray: '8, 8' }}
          >
            <Popup>
              <div className="text-xs font-mono">
                <strong className="text-red-400">BLOCKED ROADWAY</strong>
                <div className="text-white font-bold">{rd.name}</div>
              </div>
            </Popup>
          </Polyline>
        ))}
      {/* Active Route Polyline (Green = Safest, Red = Shortest/Hazard) */}
      {activeRoutePolyline && (
        <Polyline
          positions={activeRoutePolyline.coords}
          pathOptions={{
            color: activeRoutePolyline.color || '#10B981',
            weight: 6,
            dashArray: activeRoutePolyline.dashArray
          }}
        >
          <Popup>
            <div className="text-xs font-mono">
              <strong className="text-emerald-400">EVACUATION ROUTE POLYLINE</strong>
              <div className="text-white font-bold">{activeRoutePolyline.name}</div>
            </div>
          </Popup>
        </Polyline>
      )}
    </MapContainer>
  );
}
