'use client';

import React from 'react';
import { RiskMap } from '@/components/gis/RiskMap';

interface MapContainerProps {
  className?: string;
}

export const MapContainer: React.FC<MapContainerProps> = ({ className }) => {
  return <RiskMap className={className} />;
};
