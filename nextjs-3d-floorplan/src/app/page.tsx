'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { TopHeader } from '../components/ui/TopHeader';
import { LeftSidebar } from '../components/ui/LeftSidebar';
import { RightSidebar } from '../components/ui/RightSidebar';
import { BOMModal } from '../components/ui/BOMModal';
import { CAD2DCanvas } from '../components/canvas/CAD2DCanvas';
import { useArchitectStore } from '../store/useArchitectStore';

// Dynamically import React Three Fiber 3D Canvas with SSR disabled
const ArchitectCanvas = dynamic(
  () => import('../components/canvas/ArchitectCanvas').then((mod) => mod.ArchitectCanvas),
  { ssr: false }
);

export default function Home() {
  const [isBOMOpen, setIsBOMOpen] = useState(false);
  const cameraMode = useArchitectStore((state) => state.settings.cameraMode);

  return (
    <main className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 font-sans select-none">
      {/* Header Bar */}
      <TopHeader onOpenBOM={() => setIsBOMOpen(true)} />

      {/* Main Interactive Workspace */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Control Panel */}
        <LeftSidebar />

        {/* Dynamic Canvas Container: 2D CAD Layout vs 3D Orbit / Eye-Level / Exploded */}
        <div className="flex-1 h-full relative">
          {cameraMode === '2d' ? <CAD2DCanvas /> : <ArchitectCanvas />}
        </div>

        {/* Right Properties & MEP Panel */}
        <RightSidebar />
      </div>

      {/* Bill of Materials Modal */}
      <BOMModal isOpen={isBOMOpen} onClose={() => setIsBOMOpen(false)} />
    </main>
  );
}
