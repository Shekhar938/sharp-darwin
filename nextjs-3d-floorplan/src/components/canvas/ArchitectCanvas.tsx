'use client';

import React, { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { useArchitectStore } from '../../store/useArchitectStore';
import { EnvironmentLighting } from './EnvironmentLighting';
import { ProceduralFloors } from './ProceduralFloors';
import { ProceduralWalls } from './ProceduralWalls';
import { Furniture3D } from './Furniture3D';
import { MEPConduits3D } from './MEPConduits3D';
import { Vastu3DOverlay } from './Vastu3DOverlay';
import { FPSCameraController } from './FPSCameraController';

export function ArchitectCanvas() {
  const plot = useArchitectStore((state) => state.plot);
  const floors = useArchitectStore((state) => state.floors);
  const floorConfig = useArchitectStore((state) => state.floorConfig);
  const customWalls = useArchitectStore((state) => state.floorWalls);
  const furniture = useArchitectStore((state) => state.furniture);
  const settings = useArchitectStore((state) => state.settings);
  const selectItem = useArchitectStore((state) => state.selectItem);

  const activeFloor = settings.activeFloor;
  const isExploded = settings.cameraMode === 'exploded';
  const roomWallHeight = 10.0;

  // Custom Plot Shape 3D Geometry
  const plotGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const pw = plot.w;
    const ph = plot.h;

    switch (plot.shape) {
      case 'l_shaped':
        shape.moveTo(0, 0);
        shape.lineTo(pw, 0);
        shape.lineTo(pw, ph * 0.6);
        shape.lineTo(pw * 0.5, ph * 0.6);
        shape.lineTo(pw * 0.5, ph);
        shape.lineTo(0, ph);
        break;
      case 't_shaped':
        shape.moveTo(pw * 0.25, 0);
        shape.lineTo(pw * 0.75, 0);
        shape.lineTo(pw * 0.75, ph * 0.4);
        shape.lineTo(pw, ph * 0.4);
        shape.lineTo(pw, ph);
        shape.lineTo(0, ph);
        shape.lineTo(0, ph * 0.4);
        shape.lineTo(pw * 0.25, ph * 0.4);
        break;
      case 'irregular_polygon':
        shape.moveTo(0, ph * 0.2);
        shape.lineTo(pw * 0.8, 0);
        shape.lineTo(pw, ph * 0.7);
        shape.lineTo(pw * 0.6, ph);
        shape.lineTo(0, ph);
        break;
      case 'rectangular':
      default:
        shape.moveTo(0, 0);
        shape.lineTo(pw, 0);
        shape.lineTo(pw, ph);
        shape.lineTo(0, ph);
        break;
    }
    shape.closePath();

    return new THREE.ShapeGeometry(shape);
  }, [plot.w, plot.h, plot.shape]);

  return (
    <div id="fpsCanvasOverlay" className="w-full h-full relative bg-slate-900 overflow-hidden cursor-crosshair">
      <Canvas
        shadows
        camera={{
          position: [plot.w * 1.2, 25, plot.h * 1.4],
          fov: 55,
          near: 0.1,
          far: 500,
        }}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            selectItem(null, null);
          }
        }}
      >
        {/* Bright Studio Lighting & Sun Environment */}
        <EnvironmentLighting />

        {/* Orbit Camera Controls (Active when in Orbit or Exploded mode) */}
        {settings.cameraMode !== 'fps' && (
          <OrbitControls
            makeDefault
            target={[plot.w / 2, 5, plot.h / 2]}
            maxPolarAngle={Math.PI / 2 - 0.05}
            minDistance={5}
            maxDistance={120}
          />
        )}

        {/* True FPS PointerLock Camera & WASD Controller (5 ft person eye level) */}
        <FPSCameraController />

        {/* Studio Custom Plot Shape Ground Slab */}
        <mesh geometry={plotGeometry} position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <meshStandardMaterial color="#1e293b" roughness={0.6} />
        </mesh>

        {/* Studio Grid Lines */}
        {settings.showGrid && (
          <Grid
            position={[plot.w / 2, 0, plot.h / 2]}
            args={[plot.w * 2, plot.h * 2]}
            cellSize={1}
            cellThickness={1.2}
            cellColor="#475569"
            sectionSize={5}
            sectionThickness={2.0}
            sectionColor="#818cf8"
            fadeDistance={100}
          />
        )}

        {/* Render Floor Levels */}
        {floorConfig.map((fConf, idx) => {
          const fKey = fConf.id;
          const isVisible = isExploded || activeFloor === fKey;
          const yOffset = isExploded ? idx * 14 : 0;

          if (!isVisible) return null;

          const fRooms = floors[fKey] || [];
          const fWalls = customWalls[fKey] || [];
          const fFurniture = settings.showFurniture
            ? furniture.filter((item) => item.floor === fKey)
            : [];

          return (
            <group key={fKey} position={[0, yOffset, 0]}>
              {/* Floor Tiles */}
              <ProceduralFloors rooms={fRooms} />

              {/* 3D Walls (10 ft height) */}
              <ProceduralWalls rooms={fRooms} customWalls={fWalls} wallHeight={roomWallHeight} />

              {/* 3D Furniture & Decor */}
              <Furniture3D items={fFurniture} />

              {/* 3D MEP Pipe & Electrical Conduits */}
              <MEPConduits3D rooms={fRooms} wallHeight={roomWallHeight} />

              {/* 3D Vastu Overlay */}
              <Vastu3DOverlay rooms={fRooms} plot={plot} />
            </group>
          );
        })}
      </Canvas>

      {/* Floating Interactive FPS Instruction Overlay */}
      {settings.cameraMode === 'fps' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-xl border border-emerald-500/50 text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-2xl flex items-center gap-4 animate-bounce">
          <span className="text-base">🚶</span>
          <div>
            <span className="block text-emerald-400 font-extrabold">5 FT Eye-Level FPS Walk (10 FT Room Walls)</span>
            <span className="text-[11px] text-slate-300 font-normal">
              Click screen to lock mouse & rotate camera 360°. Walk with <kbd className="bg-emerald-600 px-1.5 py-0.5 rounded text-[10px]">W</kbd> <kbd className="bg-emerald-600 px-1.5 py-0.5 rounded text-[10px]">A</kbd> <kbd className="bg-emerald-600 px-1.5 py-0.5 rounded text-[10px]">S</kbd> <kbd className="bg-emerald-600 px-1.5 py-0.5 rounded text-[10px]">D</kbd> keys. Press <kbd className="bg-slate-700 px-1.5 py-0.5 rounded text-[10px]">Esc</kbd> to unlock mouse.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
