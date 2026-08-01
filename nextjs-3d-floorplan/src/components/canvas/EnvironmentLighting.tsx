'use client';

import React from 'react';
import { useArchitectStore } from '../../store/useArchitectStore';

export function EnvironmentLighting() {
  const { timeOfDay } = useArchitectStore((state) => state.settings);
  const plot = useArchitectStore((state) => state.plot);

  const cx = plot.w / 2;
  const cz = plot.h / 2;

  const isNight = timeOfDay === 'night';
  const isSunset = timeOfDay === 'sunset';

  // Bright Key Light Positions
  const sunPosition: [number, number, number] = isSunset
    ? [cx + 40, 18, cz - 20]
    : isNight
    ? [cx - 10, 35, cz - 30]
    : [cx + 15, 55, cz + 20];

  const dirIntensity = isSunset ? 2.5 : isNight ? 0.8 : 3.2;
  const dirColor = isSunset ? '#fed7aa' : isNight ? '#bfdbfe' : '#ffffff';
  
  // High-visibility Ambient Light (Eliminates pitch black shadows)
  const ambIntensity = isNight ? 0.8 : isSunset ? 1.4 : 2.0;
  const ambColor = isNight ? '#3b82f6' : isSunset ? '#fb923c' : '#ffffff';

  return (
    <>
      {/* High-Intensity Ambient Fill Light */}
      <ambientLight intensity={ambIntensity} color={ambColor} />

      {/* Hemisphere Light for Realistic Architectural Sky/Ground Fill */}
      <hemisphereLight args={['#ffffff', '#334155', isNight ? 1.0 : 2.2]} />

      {/* Primary Key Sun Light with Soft Contact Shadows */}
      <directionalLight
        position={sunPosition}
        intensity={dirIntensity}
        color={dirColor}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={150}
        shadow-camera-left={-plot.w * 2}
        shadow-camera-right={plot.w * 2}
        shadow-camera-top={plot.h * 2}
        shadow-camera-bottom={-plot.h * 2}
        shadow-bias={-0.0001}
      />

      {/* Secondary Fill Light from Opposite Angle (Eliminates dark corners) */}
      <directionalLight
        position={[cx - 30, 40, cz - 30]}
        intensity={isNight ? 0.5 : 1.5}
        color="#f8fafc"
      />

      {/* Ceiling Spotlights for Room Interior Visibility */}
      <pointLight position={[cx, 12, cz]} intensity={25} color="#ffffff" distance={60} />
      <pointLight position={[5, 10, 5]} intensity={18} color="#fef08a" distance={30} />
      <pointLight position={[20, 10, 20]} intensity={18} color="#fef08a" distance={30} />
      <pointLight position={[10, 10, 25]} intensity={18} color="#fef08a" distance={30} />
    </>
  );
}
