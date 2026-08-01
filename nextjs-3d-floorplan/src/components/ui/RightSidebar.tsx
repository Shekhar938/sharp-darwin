'use client';

import React, { useState } from 'react';
import { useArchitectStore } from '../../store/useArchitectStore';
import { MaterialType } from '../../types/floorplan';
import { ChevronDown, ChevronRight, Sliders, Droplets, Flame, Zap, Compass, Trash2, DoorClosed, Building2, Plus, PenTool, RotateCw } from 'lucide-react';

export function RightSidebar() {
  const {
    settings,
    floors,
    floorFixed,
    floorOpenings,
    floorWalls,
    furniture,
    setRoomMaterial,
    setRoomWallColor,
    updateRoom,
    deleteRoom,
    updateFurniture,
    deleteFurniture,
    updateFixedFeature,
    deleteFixedFeature,
    updateOpening,
    deleteOpening,
    updateWallSegment,
    deleteWallSegment,
    toggleMEPLayer,
    addOpening,
    addWallSegment,
    selectItem,
  } = useArchitectStore();

  const [openSections, setOpenSections] = useState({
    props: true,
    doors: true,
    fixed: true,
    mep: true,
  });

  const toggleSection = (sec: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  const selectedId = settings.selectedItemId;
  const selectedType = settings.selectedItemType;
  const activeFloor = settings.activeFloor;

  const activeRooms = floors[activeFloor] || [];
  const activeFixed = floorFixed[activeFloor] || [];
  const activeOpenings = floorOpenings[activeFloor] || [];
  const activeWalls = floorWalls[activeFloor] || [];

  const selectedRoom = selectedType === 'room' ? activeRooms.find((r) => r.id === selectedId) : null;
  const selectedFurniture = selectedType === 'furniture' ? furniture.find((f) => f.id === selectedId) : null;
  const selectedFixed = selectedType === 'fixed' ? activeFixed.find((f) => f.id === selectedId) : null;
  const selectedOpening = selectedType === 'opening' ? activeOpenings.find((op) => op.id === selectedId) : null;
  const selectedWall = selectedType === 'wall' ? activeWalls.find((w) => w.id === selectedId) : null;

  const handleAddDoor = (type: 'door' | 'double_door') => {
    const targetRoomId = selectedRoom ? selectedRoom.id : activeRooms[0]?.id || 'r_1';
    addOpening(activeFloor, {
      type,
      roomId: targetRoomId,
      wall: 'south',
      offset: 3,
      width: type === 'double_door' ? 4 : 3,
    });
  };

  const handleAddWindow = (type: 'window' | 'ventilator') => {
    const targetRoomId = selectedRoom ? selectedRoom.id : activeRooms[0]?.id || 'r_1';
    addOpening(activeFloor, {
      type,
      roomId: targetRoomId,
      wall: 'north',
      offset: 2,
      width: type === 'ventilator' ? 2 : 4,
    });
  };

  const handleAddCustomWallPreset = () => {
    addWallSegment(activeFloor, {
      x1: 4,
      y1: 15,
      x2: 14,
      y2: 15,
      thickness: 0.5,
      height: 10,
      color: '#78350f',
    });
  };

  return (
    <aside className="w-80 bg-slate-900/90 backdrop-blur-xl border-l border-slate-800 p-3 flex flex-col gap-3 overflow-y-auto text-slate-200 z-10 select-none">
      {/* 1. Selection Properties & Live Customizer */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => toggleSection('props')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <span className="flex items-center gap-2"><Sliders className="w-3.5 h-3.5 text-indigo-400" /> ⚙️ Item Properties & Customizer</span>
          {openSections.props ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.props && (
          <div className="mt-3 flex flex-col gap-3 text-xs">
            {/* ROOM CUSTOMIZER */}
            {selectedRoom ? (
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-indigo-400 text-xs uppercase">Room Customizer</span>
                  <button
                    onClick={() => deleteRoom(activeFloor, selectedRoom.id)}
                    className="p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Room Title</label>
                  <input
                    type="text"
                    value={selectedRoom.name}
                    onChange={(e) => updateRoom(activeFloor, selectedRoom.id, { name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold text-xs focus:border-indigo-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">X Pos (ft)</label>
                    <input
                      type="number"
                      value={selectedRoom.x}
                      onChange={(e) => updateRoom(activeFloor, selectedRoom.id, { x: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Y Pos (ft)</label>
                    <input
                      type="number"
                      value={selectedRoom.y}
                      onChange={(e) => updateRoom(activeFloor, selectedRoom.id, { y: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Width (ft)</label>
                    <input
                      type="number"
                      value={selectedRoom.w}
                      onChange={(e) => updateRoom(activeFloor, selectedRoom.id, { w: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Length (ft)</label>
                    <input
                      type="number"
                      value={selectedRoom.h}
                      onChange={(e) => updateRoom(activeFloor, selectedRoom.id, { h: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block font-semibold mb-1.5">Floor Texture Material</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'oak_hardwood', label: '🪵 Teak Wood', color: '#d97706' },
                      { id: 'marble', label: '🏛️ Marble', color: '#f8fafc' },
                      { id: 'slate_tile', label: '🧱 Slate Tile', color: '#475569' },
                      { id: 'carpet', label: '🧵 Carpet', color: '#f5f5f4' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setRoomMaterial(activeFloor, selectedRoom.id, m.id as MaterialType)}
                        className={`px-2 py-1.5 rounded-lg border text-left text-[11px] font-semibold transition-all flex items-center gap-1.5 ${
                          (selectedRoom.floorMaterial || 'oak_hardwood') === m.id
                            ? 'border-indigo-500 bg-indigo-600/20 text-white'
                            : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : selectedOpening ? (
              /* DOOR / WINDOW OPENING CUSTOMIZER */
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-amber-400 text-xs uppercase">Opening Customizer</span>
                  <button
                    onClick={() => deleteOpening(activeFloor, selectedOpening.id)}
                    className="p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                {/* Opening Type Selector */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Opening Type</label>
                  <select
                    value={selectedOpening.type}
                    onChange={(e) => updateOpening(activeFloor, selectedOpening.id, { type: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold text-xs"
                  >
                    <option value="door">🚪 Single Door</option>
                    <option value="double_door">🚪 Double Door</option>
                    <option value="window">🪟 Glass Window</option>
                    <option value="ventilator">🪟 Ventilator</option>
                  </select>
                </div>

                {/* Wall Side Selector */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Wall Side Alignment</label>
                  <div className="grid grid-cols-4 gap-1">
                    {['north', 'south', 'east', 'west'].map((w) => (
                      <button
                        key={w}
                        onClick={() => updateOpening(activeFloor, selectedOpening.id, { wall: w as any })}
                        className={`p-1.5 rounded-lg border text-center text-[10px] font-extrabold uppercase transition-all ${
                          selectedOpening.wall === w ? 'border-amber-500 bg-amber-600/30 text-white' : 'border-slate-800 bg-slate-900 text-slate-400'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Offset Position Slider */}
                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mb-1">
                    <span>Wall Offset Position</span>
                    <span className="font-mono text-amber-400">{selectedOpening.offset} ft</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={selectedOpening.offset}
                    onChange={(e) => updateOpening(activeFloor, selectedOpening.id, { offset: Number(e.target.value) })}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                {/* Opening Width */}
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">Width (ft)</label>
                  <input
                    type="number"
                    value={selectedOpening.width}
                    onChange={(e) => updateOpening(activeFloor, selectedOpening.id, { width: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                  />
                </div>
              </div>
            ) : selectedWall ? (
              /* CUSTOM WALL CUSTOMIZER */
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-amber-400 text-xs uppercase">Custom Wall Customizer</span>
                  <button
                    onClick={() => deleteWallSegment(activeFloor, selectedWall.id)}
                    className="p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Start X1 (ft)</label>
                    <input
                      type="number"
                      value={selectedWall.x1}
                      onChange={(e) => updateWallSegment(activeFloor, selectedWall.id, { x1: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Start Y1 (ft)</label>
                    <input
                      type="number"
                      value={selectedWall.y1}
                      onChange={(e) => updateWallSegment(activeFloor, selectedWall.id, { y1: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">End X2 (ft)</label>
                    <input
                      type="number"
                      value={selectedWall.x2}
                      onChange={(e) => updateWallSegment(activeFloor, selectedWall.id, { x2: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">End Y2 (ft)</label>
                    <input
                      type="number"
                      value={selectedWall.y2}
                      onChange={(e) => updateWallSegment(activeFloor, selectedWall.id, { y2: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                </div>
              </div>
            ) : selectedFurniture ? (
              /* FURNITURE CUSTOMIZER */
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-emerald-400 text-xs uppercase">Furniture Customizer</span>
                  <button
                    onClick={() => deleteFurniture(selectedFurniture.id)}
                    className="p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Furniture Name</label>
                  <input
                    type="text"
                    value={selectedFurniture.name}
                    onChange={(e) => updateFurniture(selectedFurniture.id, { name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mb-1">
                    <span className="flex items-center gap-1"><RotateCw className="w-3 h-3 text-emerald-400" /> Rotation Angle</span>
                    <span className="font-mono text-emerald-400">{selectedFurniture.rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    step="15"
                    value={selectedFurniture.rotation}
                    onChange={(e) => updateFurniture(selectedFurniture.id, { rotation: Number(e.target.value) })}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Width (ft)</label>
                    <input
                      type="number"
                      value={selectedFurniture.w}
                      onChange={(e) => updateFurniture(selectedFurniture.id, { w: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Length (ft)</label>
                    <input
                      type="number"
                      value={selectedFurniture.h}
                      onChange={(e) => updateFurniture(selectedFurniture.id, { h: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                </div>
              </div>
            ) : selectedFixed ? (
              /* FIXED STRUCTURE CUSTOMIZER */
              <div className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-extrabold text-amber-400 text-xs uppercase">Structure Customizer</span>
                  <button
                    onClick={() => deleteFixedFeature(activeFloor, selectedFixed.id)}
                    className="p-1.5 bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-[10px] font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                <div>
                  <label className="text-[10px] text-slate-400 block mb-1 font-semibold">Structure Name</label>
                  <input
                    type="text"
                    value={selectedFixed.name}
                    onChange={(e) => updateFixedFeature(activeFloor, selectedFixed.id, { name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-bold text-xs focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Width (ft)</label>
                    <input
                      type="number"
                      value={selectedFixed.w}
                      onChange={(e) => updateFixedFeature(activeFloor, selectedFixed.id, { w: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block mb-1">Length (ft)</label>
                    <input
                      type="number"
                      value={selectedFixed.h}
                      onChange={(e) => updateFixedFeature(activeFloor, selectedFixed.id, { h: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white font-semibold text-center"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-3 text-slate-500 text-xs font-medium">
                Click any 2D room, door/window cutout, custom wall, or 3D element to customize properties
              </div>
            )}
          </div>
        )}
      </div>

      {/* 2. Interactive Doors, Windows & Custom Wall Palette */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => toggleSection('doors')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-amber-400 transition-colors"
        >
          <span className="flex items-center gap-2"><DoorClosed className="w-3.5 h-3.5 text-amber-400" /> 🚪 Doors, Windows & Custom Walls</span>
          {openSections.doors ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.doors && (
          <div className="mt-3 flex flex-col gap-2 text-xs">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => handleAddDoor('door')}
                className="p-2 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-xl text-amber-300 font-semibold flex items-center gap-1.5 transition-all active:scale-95 text-left"
              >
                <Plus className="w-3.5 h-3.5" /> 🚪 Single Door (3')
              </button>
              <button
                onClick={() => handleAddDoor('double_door')}
                className="p-2 bg-slate-900 border border-slate-800 hover:border-amber-500 rounded-xl text-amber-300 font-semibold flex items-center gap-1.5 transition-all active:scale-95 text-left"
              >
                <Plus className="w-3.5 h-3.5" /> 🚪 Double Door (4')
              </button>
              <button
                onClick={() => handleAddWindow('window')}
                className="p-2 bg-slate-900 border border-slate-800 hover:border-sky-500 rounded-xl text-sky-300 font-semibold flex items-center gap-1.5 transition-all active:scale-95 text-left"
              >
                <Plus className="w-3.5 h-3.5" /> 🪟 Window (4')
              </button>
              <button
                onClick={() => handleAddWindow('ventilator')}
                className="p-2 bg-slate-900 border border-slate-800 hover:border-sky-500 rounded-xl text-sky-300 font-semibold flex items-center gap-1.5 transition-all active:scale-95 text-left"
              >
                <Plus className="w-3.5 h-3.5" /> 🪟 Ventilator (2')
              </button>
            </div>

            <button
              onClick={handleAddCustomWallPreset}
              className="w-full p-2 bg-amber-600/20 border border-amber-500/40 hover:bg-amber-600/30 text-amber-300 font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <PenTool className="w-3.5 h-3.5" /> 🧱 Add 10' Custom Wall
            </button>
          </div>
        )}
      </div>

      {/* 3. Structural Features Manager */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => toggleSection('fixed')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-purple-400 transition-colors"
        >
          <span className="flex items-center gap-2"><Building2 className="w-3.5 h-3.5 text-purple-400" /> 🏗️ Structural Features Manager</span>
          {openSections.fixed ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.fixed && (
          <div className="mt-3 flex flex-col gap-1.5 text-[11px]">
            {activeFixed.map((ff) => (
              <button
                key={ff.id}
                onClick={() => selectItem(ff.id, 'fixed')}
                className={`p-2 rounded-xl border flex items-center justify-between text-left transition-all ${
                  settings.selectedItemId === ff.id
                    ? 'border-purple-500 bg-purple-600/20 text-white font-bold'
                    : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <span>{ff.icon || '📍'} {ff.name}</span>
                <span className="text-[9px] text-slate-400 font-mono">{ff.w}'×{ff.h}'</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 4. 3D MEP Infrastructure Layers */}
      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => toggleSection('mep')}
          className="w-full flex items-center justify-between font-bold text-xs uppercase tracking-wider text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-cyan-400" /> ⚡ 3D MEP Infrastructure</span>
          {openSections.mep ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </button>

        {openSections.mep && (
          <div className="mt-3 flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 text-sky-400 font-semibold">
                <Droplets className="w-4 h-4" />
                <span>Water Supply (CPVC)</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showPlumbing}
                onChange={() => toggleMEPLayer('plumbing')}
                className="w-4 h-4 accent-sky-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 text-rose-400 font-semibold">
                <Flame className="w-4 h-4" />
                <span>Soil Sewage (110mm PVC)</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showSoil}
                onChange={() => toggleMEPLayer('soil')}
                className="w-4 h-4 accent-rose-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-2 bg-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-center gap-2 text-amber-400 font-semibold">
                <Zap className="w-4 h-4" />
                <span>Electrical Riser & Conduits</span>
              </div>
              <input
                type="checkbox"
                checked={settings.showElectrical}
                onChange={() => toggleMEPLayer('electrical')}
                className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
