'use client';

import React from 'react';
import { Room, MaterialType } from '../../types/floorplan';
import { useArchitectStore } from '../../store/useArchitectStore';

interface ProceduralFloorsProps {
  rooms: Room[];
}

function getMaterialProps(mat?: MaterialType) {
  switch (mat) {
    case 'marble':
      return { color: '#f8fafc', roughness: 0.1, metalness: 0.2 };
    case 'slate_tile':
      return { color: '#475569', roughness: 0.5, metalness: 0.1 };
    case 'carpet':
      return { color: '#f5f5f4', roughness: 0.9, metalness: 0.0 };
    case 'oak_hardwood':
    default:
      return { color: '#d97706', roughness: 0.35, metalness: 0.05 };
  }
}

export function ProceduralFloors({ rooms }: ProceduralFloorsProps) {
  const { selectedItemId, selectedItemType } = useArchitectStore((state) => state.settings);
  const selectItem = useArchitectStore((state) => state.selectItem);

  return (
    <group>
      {rooms.map((r) => {
        const matProps = getMaterialProps(r.floorMaterial);
        const isSelected = selectedItemId === r.id && selectedItemType === 'room';

        return (
          <group key={r.id} position={[r.x + r.w / 2, 0.05, r.y + r.h / 2]}>
            {/* Main Floor Slab Tile */}
            <mesh
              receiveShadow
              onClick={(e) => {
                e.stopPropagation();
                selectItem(r.id, 'room');
              }}
            >
              <boxGeometry args={[r.w - 0.04, 0.1, r.h - 0.04]} />
              <meshStandardMaterial
                color={isSelected ? '#6366f1' : matProps.color}
                roughness={matProps.roughness}
                metalness={matProps.metalness}
              />
            </mesh>

            {/* Selection Highlight Outline */}
            {isSelected && (
              <mesh position={[0, 0.06, 0]}>
                <boxGeometry args={[r.w, 0.02, r.h]} />
                <meshBasicMaterial color="#a855f7" wireframe />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
