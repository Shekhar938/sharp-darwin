'use client';

import React from 'react';
import { FurnitureItem } from '../../types/floorplan';
import { useArchitectStore } from '../../store/useArchitectStore';

interface Furniture3DProps {
  items: FurnitureItem[];
}

export function Furniture3D({ items }: Furniture3DProps) {
  const { selectedItemId, selectedItemType } = useArchitectStore((state) => state.settings);
  const selectItem = useArchitectStore((state) => state.selectItem);

  return (
    <group>
      {items.map((item) => {
        const isSelected = selectedItemId === item.id && selectedItemType === 'furniture';
        const rotRad = (item.rotation * Math.PI) / 180;
        const posX = item.x + item.w / 2;
        const posZ = item.y + item.h / 2;
        const h = item.height || 2.5;

        return (
          <group
            key={item.id}
            position={[posX, 0, posZ]}
            rotation={[0, rotRad, 0]}
            onClick={(e) => {
              e.stopPropagation();
              selectItem(item.id, 'furniture');
            }}
          >
            {/* Base Furniture Box */}
            <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
              <boxGeometry args={[item.w, h, item.h]} />
              <meshStandardMaterial
                color={isSelected ? '#6366f1' : item.color}
                roughness={0.5}
                metalness={0.1}
              />
            </mesh>

            {/* Accent Cushion / Detail */}
            {item.category === 'bed' && (
              <mesh position={[0, h + 0.2, -item.h / 3]} castShadow>
                <boxGeometry args={[item.w * 0.8, 0.4, item.h * 0.3]} />
                <meshStandardMaterial color="#fef08a" roughness={0.8} />
              </mesh>
            )}

            {item.category === 'sofa' && (
              <mesh position={[0, h * 0.7, -item.h / 2 + 0.3]} castShadow>
                <boxGeometry args={[item.w, h * 0.8, 0.5]} />
                <meshStandardMaterial color="#065f46" roughness={0.6} />
              </mesh>
            )}

            {/* Selection Outline */}
            {isSelected && (
              <mesh position={[0, h / 2, 0]}>
                <boxGeometry args={[item.w + 0.2, h + 0.2, item.h + 0.2]} />
                <meshBasicMaterial color="#a855f7" wireframe />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}
