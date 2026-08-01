'use client';

import React, { useRef } from 'react';
import { useArchitectStore } from '../../store/useArchitectStore';
import { FloorId, CameraViewMode } from '../../types/floorplan';
import { LayoutGrid, Box, Eye, Layers, Sun, Sunset, Moon, FileText, Download, Upload, Undo, Redo, Camera } from 'lucide-react';

interface TopHeaderProps {
  onOpenBOM: () => void;
}

export function TopHeader({ onOpenBOM }: TopHeaderProps) {
  const { floorConfig, settings, loadLayoutJSON } = useArchitectStore();
  const { setActiveFloor, setCameraMode, setTimeOfDay } = useArchitectStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const storeState = useArchitectStore.getState();
    const data = {
      appName: 'ArchitectStudio3D',
      version: '4.0',
      timestamp: new Date().toISOString(),
      plot: storeState.plot,
      floorConfig: storeState.floorConfig,
      floors: storeState.floors,
      floorFixed: storeState.floorFixed,
      floorWalls: storeState.floorWalls,
      furniture: storeState.furniture,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `floor-plan-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        loadLayoutJSON(json);
      } catch (err) {
        alert('Invalid JSON floor plan file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <header className="h-16 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 flex items-center justify-between gap-3 text-white z-20 shadow-2xl select-none">
      {/* Brand Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center font-extrabold text-xl shadow-lg shadow-indigo-500/30 hover:scale-105 active:scale-95 transition-transform cursor-pointer">
          📐
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight bg-gradient-to-r from-white via-indigo-100 to-indigo-300 bg-clip-text text-transparent">
            ArchitectStudio 3D
          </h1>
          <span className="text-[10px] text-indigo-400 block -mt-0.5 font-semibold tracking-wide uppercase">Photorealistic Engine</span>
        </div>
      </div>

      {/* Center Controls: Floor Tabs & View Modes */}
      <div className="flex items-center gap-2 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
        {/* Floor Selection */}
        <div className="flex items-center gap-1 border-r border-slate-800 pr-2 mr-1">
          {floorConfig.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFloor(f.id as FloorId)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
                settings.activeFloor === f.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* View Mode Buttons: 2D, 3D Orbit, Eye-Level, Exploded */}
        <button
          onClick={() => setCameraMode('2d')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
            settings.cameraMode === '2d'
              ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5" /> 2D Layout
        </button>

        <button
          onClick={() => setCameraMode('orbit')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
            settings.cameraMode === 'orbit'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Box className="w-3.5 h-3.5" /> 3D Orbit
        </button>

        <button
          onClick={() => setCameraMode('fps')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
            settings.cameraMode === 'fps'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Eye className="w-3.5 h-3.5" /> Eye-Level
        </button>

        <button
          onClick={() => setCameraMode('exploded')}
          className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 active:scale-95 ${
            settings.cameraMode === 'exploded'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-md shadow-amber-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Exploded
        </button>
      </div>

      {/* Right Action Tools: File Save/Load, Day/Night Lighting, & BOM */}
      <div className="flex items-center gap-2">
        {/* Save & Load JSON Buttons */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={handleExportJSON}
            title="Save Backup JSON File"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all active:scale-95"
          >
            <Download className="w-3.5 h-3.5" /> Save
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            title="Open Saved JSON File"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all active:scale-95"
          >
            <Upload className="w-3.5 h-3.5" /> Load
          </button>
          <input ref={fileInputRef} type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
        </div>

        {/* Lighting Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-2xl border border-slate-800">
          <button
            onClick={() => setTimeOfDay('day')}
            title="Bright Daylight ☀️"
            className={`p-2 rounded-xl transition-all duration-150 active:scale-90 ${
              settings.timeOfDay === 'day' ? 'bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-400/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTimeOfDay('sunset')}
            title="Sunset Golden Hour 🌅"
            className={`p-2 rounded-xl transition-all duration-150 active:scale-90 ${
              settings.timeOfDay === 'sunset' ? 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sunset className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            title="Night Interior Mode 🌙"
            className={`p-2 rounded-xl transition-all duration-150 active:scale-90 ${
              settings.timeOfDay === 'night' ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* Bill of Materials Button */}
        <button
          onClick={onOpenBOM}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all duration-150 active:scale-95"
        >
          <FileText className="w-4 h-4" /> BOM Calculator
        </button>
      </div>
    </header>
  );
}
