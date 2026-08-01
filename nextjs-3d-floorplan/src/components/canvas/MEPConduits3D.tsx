'use client';

import React from 'react';
import { Room } from '../../types/floorplan';
import { useArchitectStore } from '../../store/useArchitectStore';

interface MEPConduits3DProps {
  rooms: Room[];
  wallHeight: number;
}

export function MEPConduits3D({ rooms, wallHeight }: MEPConduits3DProps) {
  const { showPlumbing, showSoil, showElectrical } = useArchitectStore((state) => state.settings);

  const shaft1X = 14; // West Shaft 1 Center
  const shaft1Z = 1;
  const shaft2X = 26; // North Shaft 2 Center
  const shaft2Z = 12;

  return (
    <group>
      {/* 1. PLUMBING LAYER (CPVC 25mm Water Supply - Sky Blue) */}
      {showPlumbing && (
        <group>
          {/* Main Riser in Shaft 1 */}
          <mesh position={[shaft1X, wallHeight / 2, shaft1Z]}>
            <cylinderGeometry args={[0.15, 0.15, wallHeight, 12]} />
            <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.6} />
          </mesh>

          {/* Ceiling Branch Pipes to Wet Rooms */}
          {rooms.map((r) => {
            const isWet =
              r.name.toLowerCase().includes('bath') ||
              r.name.toLowerCase().includes('toilet') ||
              r.name.toLowerCase().includes('kitchen');

            if (!isWet) return null;

            const rcx = r.x + r.w / 2;
            const rcz = r.y + r.h / 2;
            const dist = Math.hypot(rcx - shaft1X, rcz - shaft1Z);
            if (dist < 0.5) return null;

            const angle = Math.atan2(rcz - shaft1Z, rcx - shaft1X);

            return (
              <mesh
                key={'plumb_' + r.id}
                position={[(shaft1X + rcx) / 2, wallHeight - 1.2, (shaft1Z + rcz) / 2]}
                rotation={[0, -angle, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.08, 0.08, dist, 8]} />
                <meshStandardMaterial color="#38bdf8" roughness={0.3} metalness={0.6} />
              </mesh>
            );
          })}
        </group>
      )}

      {/* 2. DRAINAGE / SEWAGE LAYER (PVC 110mm Heavy Soil - Red) */}
      {showSoil && (
        <group>
          {/* Soil Sewage Riser in Shaft 1 */}
          <mesh position={[shaft1X + 0.4, wallHeight / 2, shaft1Z + 0.4]}>
            <cylinderGeometry args={[0.22, 0.22, wallHeight, 12]} />
            <meshStandardMaterial color="#ef4444" roughness={0.4} />
          </mesh>

          {/* Sloped Bathroom Waste Connections */}
          {rooms
            .filter(
              (r) =>
                r.name.toLowerCase().includes('bath') || r.name.toLowerCase().includes('toilet')
            )
            .map((r) => {
              const rcx = r.x + r.w / 2;
              const rcz = r.y + r.h / 2;
              const dist = Math.hypot(rcx - shaft1X, rcz - shaft1Z);
              if (dist < 0.5) return null;

              const angle = Math.atan2(rcz - shaft1Z, rcx - shaft1X);

              return (
                <mesh
                  key={'soil_' + r.id}
                  position={[(shaft1X + rcx) / 2, 0.4, (shaft1Z + rcz) / 2]}
                  rotation={[0, -angle, Math.PI / 2]}
                >
                  <cylinderGeometry args={[0.12, 0.12, dist, 8]} />
                  <meshStandardMaterial color="#ef4444" roughness={0.4} />
                </mesh>
              );
            })}
        </group>
      )}

      {/* 3. ELECTRICAL & AC CONDUIT LAYER (3-Phase Cable - Amber Gold) */}
      {showElectrical && (
        <group>
          {/* Main Power Riser in Shaft 2 */}
          <mesh position={[shaft2X, wallHeight / 2, shaft2Z]}>
            <cylinderGeometry args={[0.15, 0.15, wallHeight, 12]} />
            <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.7} />
          </mesh>

          {/* Sub-DB Box mounted on Wall */}
          <mesh position={[18, 5, 12]}>
            <boxGeometry args={[1.2, 1.8, 0.3]} />
            <meshStandardMaterial color="#3b82f6" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* Ceiling Conduits radiating to rooms */}
          {rooms.map((r) => {
            const rcx = r.x + r.w / 2;
            const rcz = r.y + r.h / 2;
            const dist = Math.hypot(rcx - 18, rcz - 12);
            if (dist < 0.5) return null;

            const angle = Math.atan2(rcz - 12, rcx - 18);

            return (
              <mesh
                key={'elec_' + r.id}
                position={[(18 + rcx) / 2, wallHeight - 0.8, (12 + rcz) / 2]}
                rotation={[0, -angle, Math.PI / 2]}
              >
                <cylinderGeometry args={[0.06, 0.06, dist, 8]} />
                <meshStandardMaterial color="#fbbf24" roughness={0.2} metalness={0.7} />
              </mesh>
            );
          })}
        </group>
      )}
    </group>
  );
}
