'use client';

import React, { useState } from 'react';
import { useArchitectStore } from '../../store/useArchitectStore';
import { FurnitureCategory, ActiveTool, PlotShape } from '../../types/floorplan';
import { ChevronDown, ChevronRight, Armchair, PlusCircle, Maximize2, MousePointer, PenTool, DoorClosed, LayoutGrid, Eraser, Shapes } from 'lucide-react';

export function LeftSidebar() {
  const { plot, setPlot, addFurniture, addRoom, settings, setActiveTool } = useArchitectStore();
  const [openSections, setOpenSections] = useState({
    tools: true,
    plot: true,
    furniture: true,
    addRoom: false,
  });

  const [plotW, setPlotW] = useState(plot.w);
  const [plotH, setPlotH] = useState(plot.h);
  const [plotShape, setPlotShape] = useState<PlotShape>(plot.shape || 'rectangular');

  const [customRoomName, setCustomRoomName] = useState('Custom Suite');
  const [customRoomW, setCustomRoomW] = useState(10);
  const [customRoomH, setCustomRoomH] = useState(10);

  const toggleSection = (sec: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const handleAddFurnitureItem = (name: string, category: FurnitureCategory, icon: string, w: number, h: number, color: string) => {
    addFurniture({
      name,
      category,
      floor: settings.activeFloor,
      x: Math.floor(plot.w / 2 - w / 2),
      y: Math.floor(plot.h / 2 - h / 2),
      w,
      h,
      height: 2.5,
      rotation: 0,
      color,
      icon,
    });
  };

  const handleAddCustomRoom = () => {
    addRoom(settings.activeFloor, {
      name: customRoomName,
      x: 2,
      y: 2,
      w: customRoomW,
      h: customRoomH,
      color: '#3b82f6',
      floorMaterial: 'oak_hardwood',
    });
  };

  return (
    <aside className="w-80 bg-slate-900/90 backdrop-blur-xl border-r border-slate-800 p-3 flex flex-col gap-3 overflow-y-auto text-slate-200 z-10 select-none">
      {/* 1. Interactive Tool Selector Palette */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => toggleSection('tools')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <span className="flex items-center gap-2"><MousePointer className="w-3.5 h-3.5 text-indigo-400" /> 🛠️ Interactive Tool Palette</span>
          {openSections.tools ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.tools && (
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-xs">
            {[
              { id: 'select', label: 'Pointer', icon: '👆' },
              { id: 'wall', label: 'Draw Wall', icon: '🧱' },
              { id: 'door', label: 'Add Door', icon: '🚪' },
              { id: 'window', label: 'Add Window', icon: '🪟' },
              { id: 'room', label: 'Add Room', icon: '🏠' },
              { id: 'eraser', label: 'Eraser', icon: '🧹' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTool(t.id as ActiveTool)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[10px] font-bold transition-all active:scale-95 ${
                  settings.activeTool === t.id
                    ? 'border-indigo-500 bg-indigo-600/30 text-white shadow-md shadow-indigo-600/20 scale-105'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-base mb-0.5">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Custom Plot Shape & Dimensions */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => toggleSection('plot')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <span className="flex items-center gap-2"><Maximize2 className="w-3.5 h-3.5 text-indigo-400" /> 📐 Custom Plot Shapes</span>
          {openSections.plot ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.plot && (
          <div className="mt-3 flex flex-col gap-2.5 text-xs">
            {/* Plot Shape Selector */}
            <div>
              <label className="text-[10px] text-slate-400 block font-semibold mb-1">Plot Geometry Shape</label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'rectangular', label: '⬛ Rectangle' },
                  { id: 'l_shaped', label: '🇱 L-Shaped' },
                  { id: 't_shaped', label: '🇹 T-Shaped' },
                  { id: 'irregular_polygon', label: '🔷 Irregular' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setPlotShape(s.id as PlotShape);
                      setPlot({ shape: s.id as PlotShape });
                    }}
                    className={`p-1.5 rounded-lg border text-left text-[10px] font-bold transition-all ${
                      plotShape === s.id
                        ? 'border-indigo-500 bg-indigo-600/20 text-white'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Plot Width & Length Inputs */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Width (W-E ft)</label>
                <input
                  type="number"
                  value={plotW}
                  onChange={(e) => setPlotW(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-semibold text-center focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Length (N-S ft)</label>
                <input
                  type="number"
                  value={plotH}
                  onChange={(e) => setPlotH(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-semibold text-center focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <button
              onClick={() => setPlot({ w: plotW, h: plotH, shape: plotShape })}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 rounded-lg text-xs transition-colors shadow-md shadow-indigo-600/20 active:scale-95"
            >
              Apply Plot Boundary ({plotW}' × {plotH}')
            </button>
          </div>
        )}
      </div>

      {/* 3. Furniture Catalog */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => toggleSection('furniture')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-emerald-400 transition-colors"
        >
          <span className="flex items-center gap-2"><Armchair className="w-3.5 h-3.5 text-emerald-400" /> 🛋️ 3D Furniture Catalog</span>
          {openSections.furniture ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.furniture && (
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleAddFurnitureItem('King Bed', 'bed', '🛏️', 6, 6, '#4f46e5')}
              className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 hover:bg-slate-850 text-left transition-all active:scale-95"
            >
              <span className="text-base">🛏️</span>
              <div>
                <span className="font-semibold block text-white text-[11px]">King Bed</span>
                <span className="text-[9px] text-slate-400">6' × 6'</span>
              </div>
            </button>

            <button
              onClick={() => handleAddFurnitureItem('L-Sofa Set', 'sofa', '🛋️', 6, 4, '#059669')}
              className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 hover:bg-slate-850 text-left transition-all active:scale-95"
            >
              <span className="text-base">🛋️</span>
              <div>
                <span className="font-semibold block text-white text-[11px]">L-Sofa Set</span>
                <span className="text-[9px] text-slate-400">6' × 4'</span>
              </div>
            </button>

            <button
              onClick={() => handleAddFurnitureItem('Dining Table', 'dining', '🍽️', 5, 4, '#b45309')}
              className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 hover:bg-slate-850 text-left transition-all active:scale-95"
            >
              <span className="text-base">🍽️</span>
              <div>
                <span className="font-semibold block text-white text-[11px]">Dining Set</span>
                <span className="text-[9px] text-slate-400">5' × 4'</span>
              </div>
            </button>

            <button
              onClick={() => handleAddFurnitureItem('Kitchen Counter', 'kitchen_island', '🍳', 5, 2.5, '#d97706')}
              className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 hover:bg-slate-850 text-left transition-all active:scale-95"
            >
              <span className="text-base">🍳</span>
              <div>
                <span className="font-semibold block text-white text-[11px]">Kitchen Island</span>
                <span className="text-[9px] text-slate-400">5' × 2.5'</span>
              </div>
            </button>

            <button
              onClick={() => handleAddFurnitureItem('Indoor Palm', 'plant', '🪴', 2, 2, '#16a34a')}
              className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 hover:bg-slate-850 text-left transition-all active:scale-95"
            >
              <span className="text-base">🪴</span>
              <div>
                <span className="font-semibold block text-white text-[11px]">Indoor Plant</span>
                <span className="text-[9px] text-slate-400">2' × 2'</span>
              </div>
            </button>

            <button
              onClick={() => handleAddFurnitureItem('TV Unit', 'tv_stand', '📺', 5, 1.5, '#3b82f6')}
              className="flex items-center gap-2 p-2 bg-slate-900 border border-slate-800 rounded-xl hover:border-emerald-500 hover:bg-slate-850 text-left transition-all active:scale-95"
            >
              <span className="text-base">📺</span>
              <div>
                <span className="font-semibold block text-white text-[11px]">TV Cabinet</span>
                <span className="text-[9px] text-slate-400">5' × 1.5'</span>
              </div>
            </button>
          </div>
        )}
      </div>

      {/* 4. Add Custom Room */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => toggleSection('addRoom')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-purple-400 transition-colors"
        >
          <span className="flex items-center gap-2"><PlusCircle className="w-3.5 h-3.5 text-purple-400" /> ➕ Add Custom Room</span>
          {openSections.addRoom ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.addRoom && (
          <div className="mt-3 flex flex-col gap-2 text-xs">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">Room Title</label>
              <input
                type="text"
                value={customRoomName}
                onChange={(e) => setCustomRoomName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-medium focus:outline-none focus:border-purple-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Width (ft)</label>
                <input
                  type="number"
                  value={customRoomW}
                  onChange={(e) => setCustomRoomW(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-semibold text-center focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-slate-400 block mb-1">Length (ft)</label>
                <input
                  type="number"
                  value={customRoomH}
                  onChange={(e) => setCustomRoomH(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-semibold text-center focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <button
              onClick={handleAddCustomRoom}
              className="mt-1 w-full bg-purple-600 hover:bg-purple-500 text-white font-semibold py-1.5 rounded-lg text-xs transition-colors shadow-md shadow-purple-600/20 active:scale-95"
            >
              Add Room to {settings.activeFloor} Floor
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
