'use client';

import React from 'react';
import { Room, WallSegment, OpeningItem } from '../../types/floorplan';
import { useArchitectStore } from '../../store/useArchitectStore';

interface ProceduralWallsProps {
  rooms: Room[];
  customWalls: WallSegment[];
  wallHeight: number;
}

export function ProceduralWalls({ rooms, customWalls, wallHeight }: ProceduralWallsProps) {
  const { floorOpenings, settings, selectItem } = useArchitectStore();
  const activeFloor = settings.activeFloor;
  const openings = floorOpenings[activeFloor] || [];
  const selectedId = settings.selectedItemId;
  const selectedType = settings.selectedItemType;

  const wallThick = 0.4;

  return (
    <group>
      {/* 1. ROOM PERIMETER WALLS WITH 3D DOORS & WINDOWS */}
      {rooms.map((r) => {
        const wallMatColor = r.wallColor || '#475569';
        const roomOpenings = openings.filter((op) => op.roomId === r.id);

        const northOp = roomOpenings.find((op) => op.wall === 'north');
        const southOp = roomOpenings.find((op) => op.wall === 'south');
        const westOp = roomOpenings.find((op) => op.wall === 'west');
        const eastOp = roomOpenings.find((op) => op.wall === 'east');

        return (
          <group key={'wall_' + r.id}>
            {/* North Wall with Openings */}
            <WallWithOpenings
              x={r.x + r.w / 2}
              y={wallHeight / 2}
              z={r.y}
              length={r.w}
              height={wallHeight}
              thickness={wallThick}
              rotation={0}
              color={wallMatColor}
              opening={northOp}
            />

            {/* South Wall with Openings */}
            <WallWithOpenings
              x={r.x + r.w / 2}
              y={wallHeight / 2}
              z={r.y + r.h}
              length={r.w}
              height={wallHeight}
              thickness={wallThick}
              rotation={0}
              color={wallMatColor}
              opening={southOp}
            />

            {/* West Wall with Openings */}
            <WallWithOpenings
              x={r.x}
              y={wallHeight / 2}
              z={r.y + r.h / 2}
              length={r.h}
              height={wallHeight}
              thickness={wallThick}
              rotation={Math.PI / 2}
              color={wallMatColor}
              opening={westOp}
            />

            {/* East Wall with Openings */}
            <WallWithOpenings
              x={r.x + r.w}
              y={wallHeight / 2}
              z={r.y + r.h / 2}
              length={r.h}
              height={wallHeight}
              thickness={wallThick}
              rotation={Math.PI / 2}
              color={wallMatColor}
              opening={eastOp}
            />
          </group>
        );
      })}

      {/* 2. CUSTOM DRAWN WALL SEGMENTS WITH 3D SELECTION */}
      {customWalls.map((w) => {
        const length = Math.hypot(w.x2 - w.x1, w.y2 - w.y1);
        if (length < 0.1) return null;
        const cx = (w.x1 + w.x2) / 2;
        const cz = (w.y1 + w.y2) / 2;
        const angle = Math.atan2(w.y2 - w.y1, w.x2 - w.x1);
        const isSelected = selectedId === w.id && selectedType === 'wall';

        return (
          <group
            key={w.id}
            position={[cx, (w.height || wallHeight) / 2, cz]}
            rotation={[0, -angle, 0]}
            onClick={(e) => {
              e.stopPropagation();
              selectItem(w.id, 'wall');
            }}
          >
            {/* Custom Wall Body */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[length, w.height || wallHeight, w.thickness || 0.5]} />
              <meshStandardMaterial color={isSelected ? '#f59e0b' : w.color || '#78350f'} roughness={0.6} />
            </mesh>

            {/* Selection Highlight Wireframe */}
            {isSelected && (
              <mesh>
                <boxGeometry args={[length + 0.2, (w.height || wallHeight) + 0.2, (w.thickness || 0.5) + 0.2]} />
                <meshBasicMaterial color="#fbbf24" wireframe />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
}

interface WallWithOpeningsProps {
  x: number;
  y: number;
  z: number;
  length: number;
  height: number;
  thickness: number;
  rotation: number;
  color: string;
  opening?: OpeningItem;
}

function WallWithOpenings({ x, y, z, length, height, thickness, rotation, color, opening }: WallWithOpeningsProps) {
  const { selectedItemId, selectedItemType } = useArchitectStore((state) => state.settings);
  const selectItem = useArchitectStore((state) => state.selectItem);

  if (!opening) {
    // Solid Wall segment
    return (
      <mesh position={[x, y, z]} rotation={[0, rotation, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, height, thickness]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>
    );
  }

  // Wall with Door or Window Cutout
  const opWidth = opening.width || 3;
  const isDoor = opening.type === 'door' || opening.type === 'double_door';
  const opHeight = isDoor ? 7.0 : 4.0;
  const opYCenter = isDoor ? opHeight / 2 : height - opHeight / 2 - 1.5;

  const leftSegLen = Math.max(0.1, opening.offset);
  const rightSegLen = Math.max(0.1, length - leftSegLen - opWidth);

  const isSelected = selectedItemId === opening.id && selectedItemType === 'opening';

  return (
    <group position={[x, 0, z]} rotation={[0, rotation, 0]}>
      {/* Left Solid Wall Segment */}
      <mesh position={[-length / 2 + leftSegLen / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[leftSegLen, height, thickness]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* Right Solid Wall Segment */}
      <mesh position={[length / 2 - rightSegLen / 2, height / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[rightSegLen, height, thickness]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* Header Wall Segment above Door/Window */}
      <mesh position={[-length / 2 + leftSegLen + opWidth / 2, height - (height - opHeight) / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[opWidth, height - opHeight, thickness]} />
        <meshStandardMaterial color={color} roughness={0.5} />
      </mesh>

      {/* 3D FRAME & GLASS / WOOD PANEL */}
      <group
        position={[-length / 2 + leftSegLen + opWidth / 2, opYCenter, 0]}
        onClick={(e) => {
          e.stopPropagation();
          selectItem(opening.id, 'opening');
        }}
      >
        {isDoor ? (
          /* 3D WOODEN DOOR FRAME & PANEL */
          <group>
            {/* Outer Wooden Frame */}
            <mesh castShadow>
              <boxGeometry args={[opWidth, opHeight, thickness + 0.1]} />
              <meshStandardMaterial color="#854d0e" roughness={0.4} />
            </mesh>
            {/* Inner Door Panel */}
            <mesh position={[0, 0, 0.05]} castShadow>
              <boxGeometry args={[opWidth - 0.2, opHeight - 0.2, 0.15]} />
              <meshStandardMaterial color={isSelected ? '#fbbf24' : '#a16207'} roughness={0.3} />
            </mesh>
            {/* Brass Door Handle */}
            <mesh position={[opWidth / 2 - 0.5, 0, 0.15]} castShadow>
              <sphereGeometry args={[0.15, 16, 16]} />
              <meshStandardMaterial color="#fef08a" metalness={0.9} roughness={0.1} />
            </mesh>
          </group>
        ) : (
          /* 3D GLASS WINDOW FRAME & TRANSLUCENT PANE */
          <group>
            {/* Metallic Window Frame */}
            <mesh castShadow>
              <boxGeometry args={[opWidth, opHeight, thickness + 0.1]} />
              <meshStandardMaterial color="#334155" roughness={0.2} metalness={0.8} />
            </mesh>
            {/* Translucent Blue Glass Pane */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[opWidth - 0.2, opHeight - 0.2, 0.08]} />
              <meshStandardMaterial
                color={isSelected ? '#a855f7' : '#38bdf8'}
                roughness={0.1}
                metalness={0.9}
                opacity={0.5}
                transparent
              />
            </mesh>
          </group>
        )}

        {/* Selection Highlight */}
        {isSelected && (
          <mesh>
            <boxGeometry args={[opWidth + 0.2, opHeight + 0.2, thickness + 0.3]} />
            <meshBasicMaterial color="#a855f7" wireframe />
          </mesh>
        )}
      </group>
    </group>
  );
}
