'use client';

import React from 'react';
import { Room, PlotConfig } from '../../types/floorplan';
import { useArchitectStore } from '../../store/useArchitectStore';

interface Vastu3DOverlayProps {
  rooms: Room[];
  plot: PlotConfig;
}

export function Vastu3DOverlay({ rooms, plot }: Vastu3DOverlayProps) {
  const showVastu = useArchitectStore((state) => state.settings.showVastu);

  if (!showVastu) return null;

  return (
    <group>
      {/* Vastu Room Zone Highlights */}
      {rooms.map((r) => {
        if (!r.vastu) return null;

        return (
          <mesh key={'vastu_' + r.id} position={[r.x + r.w / 2, 0.12, r.y + r.h / 2]}>
            <boxGeometry args={[r.w - 0.2, 0.12, r.h - 0.2]} />
            <meshBasicMaterial color="#c084fc" opacity={0.25} transparent />
          </mesh>
        );
      })}

      {/* 3D Vastu Compass Center Mark */}
      <group position={[plot.w / 2, 0.2, plot.h / 2]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[3, 3.4, 32]} />
          <meshBasicMaterial color="#a855f7" opacity={0.6} transparent />
        </mesh>
      </group>
    </group>
  );
}
