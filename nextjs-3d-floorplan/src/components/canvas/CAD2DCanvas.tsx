'use client';

import React, { useState } from 'react';
import { useArchitectStore } from '../../store/useArchitectStore';

export function CAD2DCanvas() {
  const {
    plot,
    floors,
    floorFixed,
    floorWalls,
    floorOpenings,
    settings,
    selectItem,
    updateRoom,
    updateOpening,
    updateWallSegment,
    addWallSegment,
    addOpening,
    deleteRoom,
    deleteWallSegment,
    deleteOpening,
  } = useArchitectStore();

  const activeFloor = settings.activeFloor;
  const activeTool = settings.activeTool;

  const activeRooms = floors[activeFloor] || [];
  const activeFixed = floorFixed[activeFloor] || [];
  const activeWalls = floorWalls[activeFloor] || [];
  const activeOpenings = floorOpenings[activeFloor] || [];

  const S = 20; // 1 foot = 20 pixels
  const PAD = 40;
  const svgW = plot.w * S + PAD * 2;
  const svgH = plot.h * S + PAD * 2;

  // Active Wall Drawing State
  const [drawingWall, setDrawingWall] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  // Active Dragging State (Room, Opening, or Custom Wall)
  const [dragItem, setDragItem] = useState<{
    id: string;
    type: 'room' | 'fixed' | 'opening' | 'wall';
    startX: number;
    startY: number;
    itemX: number;
    itemY: number;
    initialOffset?: number;
    initialX1?: number;
    initialY1?: number;
    initialX2?: number;
    initialY2?: number;
  } | null>(null);

  const handlePointerDownSVG = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ptX = Math.round((e.clientX - rect.left - PAD) / S);
    const ptY = Math.round((e.clientY - rect.top - PAD) / S);

    if (activeTool === 'wall') {
      setDrawingWall({ x1: ptX, y1: ptY, x2: ptX, y2: ptY });
    }
  };

  const handlePointerMoveSVG = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ptX = Math.round((e.clientX - rect.left - PAD) / S);
    const ptY = Math.round((e.clientY - rect.top - PAD) / S);

    if (activeTool === 'wall' && drawingWall) {
      setDrawingWall((prev) => (prev ? { ...prev, x2: ptX, y2: ptY } : null));
    }

    if (dragItem) {
      const dx = Math.round((e.clientX - dragItem.startX) / S);
      const dy = Math.round((e.clientY - dragItem.startY) / S);

      if (dragItem.type === 'room') {
        const newX = Math.max(0, Math.min(plot.w - 2, dragItem.itemX + dx));
        const newY = Math.max(0, Math.min(plot.h - 2, dragItem.itemY + dy));
        updateRoom(activeFloor, dragItem.id, { x: newX, y: newY });
      } else if (dragItem.type === 'opening' && dragItem.initialOffset !== undefined) {
        const newOffset = Math.max(0, Math.min(25, dragItem.initialOffset + (dx || dy)));
        updateOpening(activeFloor, dragItem.id, { offset: newOffset });
      }
    }
  };

  const handlePointerUpSVG = () => {
    if (activeTool === 'wall' && drawingWall) {
      const len = Math.hypot(drawingWall.x2 - drawingWall.x1, drawingWall.y2 - drawingWall.y1);
      if (len >= 1) {
        addWallSegment(activeFloor, {
          x1: drawingWall.x1,
          y1: drawingWall.y1,
          x2: drawingWall.x2,
          y2: drawingWall.y2,
          thickness: 0.5,
          height: 10,
          color: '#78350f',
        });
      }
      setDrawingWall(null);
    }
    setDragItem(null);
  };

  const handleRoomClick = (e: React.PointerEvent, r: typeof activeRooms[0]) => {
    e.stopPropagation();
    if (activeTool === 'eraser') {
      deleteRoom(activeFloor, r.id);
      return;
    }

    if (activeTool === 'door') {
      addOpening(activeFloor, {
        type: 'door',
        roomId: r.id,
        wall: 'south',
        offset: 2,
        width: 3,
      });
      return;
    }

    if (activeTool === 'window') {
      addOpening(activeFloor, {
        type: 'window',
        roomId: r.id,
        wall: 'north',
        offset: 2,
        width: 4,
      });
      return;
    }

    selectItem(r.id, 'room');
    setDragItem({
      id: r.id,
      type: 'room',
      startX: e.clientX,
      startY: e.clientY,
      itemX: r.x,
      itemY: r.y,
    });
  };

  const handleOpeningClick = (e: React.PointerEvent, op: typeof activeOpenings[0]) => {
    e.stopPropagation();
    if (activeTool === 'eraser') {
      deleteOpening(activeFloor, op.id);
      return;
    }

    selectItem(op.id, 'opening');
    setDragItem({
      id: op.id,
      type: 'opening',
      startX: e.clientX,
      startY: e.clientY,
      itemX: 0,
      itemY: 0,
      initialOffset: op.offset,
    });
  };

  const handleWallClick = (e: React.SyntheticEvent, w: typeof activeWalls[0]) => {
    e.stopPropagation();
    if (activeTool === 'eraser') {
      deleteWallSegment(activeFloor, w.id);
      return;
    }

    selectItem(w.id, 'wall');
  };

  // Generate SVG Polygon path for custom plot shapes
  const getPlotShapePath = () => {
    const pw = plot.w * S;
    const ph = plot.h * S;
    const x0 = PAD;
    const y0 = PAD;

    switch (plot.shape) {
      case 'l_shaped':
        return `M ${x0} ${y0} L ${x0 + pw} ${y0} L ${x0 + pw} ${y0 + ph * 0.6} L ${x0 + pw * 0.5} ${y0 + ph * 0.6} L ${x0 + pw * 0.5} ${y0 + ph} L ${x0} ${y0 + ph} Z`;
      case 't_shaped':
        return `M ${x0 + pw * 0.25} ${y0} L ${x0 + pw * 0.75} ${y0} L ${x0 + pw * 0.75} ${y0 + ph * 0.4} L ${x0 + pw} ${y0 + ph * 0.4} L ${x0 + pw} ${y0 + ph} L ${x0} ${y0 + ph} L ${x0} ${y0 + ph * 0.4} L ${x0 + pw * 0.25} ${y0 + ph * 0.4} Z`;
      case 'irregular_polygon':
        return `M ${x0} ${y0 + ph * 0.2} L ${x0 + pw * 0.8} ${y0} L ${x0 + pw} ${y0 + ph * 0.7} L ${x0 + pw * 0.6} ${y0 + ph} L ${x0} ${y0 + ph} Z`;
      case 'rectangular':
      default:
        return `M ${x0} ${y0} L ${x0 + pw} ${y0} L ${x0 + pw} ${y0 + ph} L ${x0} ${y0 + ph} Z`;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 overflow-auto p-4 select-none">
      {/* Dynamic Cursor Banner */}
      <div className="mb-2 px-4 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-bold text-slate-300 flex items-center gap-2">
        <span>Active Tool:</span>
        <span className="text-indigo-400 uppercase tracking-wider font-extrabold">{activeTool}</span>
        {activeTool === 'select' && <span className="text-[10px] text-slate-400 font-normal">(Click & drag any room, door, window, or wall to reposition)</span>}
        {activeTool === 'wall' && <span className="text-[10px] text-amber-400 font-normal">(Click & drag on grid to draw custom wall)</span>}
        {activeTool === 'door' && <span className="text-[10px] text-emerald-400 font-normal">(Click room edge to add door cutout)</span>}
        {activeTool === 'window' && <span className="text-[10px] text-sky-400 font-normal">(Click room edge to add window cutout)</span>}
      </div>

      <svg
        width={svgW}
        height={svgH}
        className="bg-slate-900 border-2 border-slate-800 rounded-2xl shadow-2xl"
        onPointerDown={handlePointerDownSVG}
        onPointerMove={handlePointerMoveSVG}
        onPointerUp={handlePointerUpSVG}
        onClick={() => selectItem(null, null)}
      >
        <defs>
          <pattern id="cadGrid2D" width={S} height={S} patternUnits="userSpaceOnUse">
            <path d={`M ${S} 0 L 0 0 0 ${S}`} fill="none" stroke="#1e293b" strokeWidth="0.8" />
          </pattern>
        </defs>

        {/* CAD Grid Background */}
        <rect width={svgW} height={svgH} fill="#0b0f19" />
        <rect x={PAD} y={PAD} width={plot.w * S} height={plot.h * S} fill="url(#cadGrid2D)" />

        {/* Custom Plot Shape Boundary Path */}
        <path d={getPlotShapePath()} fill="none" stroke="#6366f1" strokeWidth="2.5" strokeDasharray="6,3" />

        {/* Plot Dimensions Rulers */}
        <text x={PAD + (plot.w * S) / 2} y={PAD - 12} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700">
          {plot.w}' WEST ({plot.shape.toUpperCase()})
        </text>
        <text x={PAD + (plot.w * S) / 2} y={PAD + plot.h * S + 24} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="700">
          {plot.w}' EAST ROAD
        </text>

        {/* Render Fixed Features */}
        {activeFixed.map((ff) => {
          const fx = PAD + ff.x * S;
          const fy = PAD + ff.y * S;
          const fw = ff.w * S;
          const fh = ff.h * S;
          const isSelected = settings.selectedItemId === ff.id;

          return (
            <g
              key={ff.id}
              transform={`translate(${fx}, ${fy})`}
              onClick={(e) => {
                e.stopPropagation();
                selectItem(ff.id, 'fixed');
              }}
              className="cursor-pointer"
            >
              <rect
                width={fw}
                height={fh}
                fill={ff.color}
                fillOpacity={0.4}
                stroke={isSelected ? '#fbbf24' : ff.color}
                strokeWidth={isSelected ? 3 : 1.5}
                rx="4"
              />
              <text x={fw / 2} y={fh / 2} textAnchor="middle" fill="#f8fafc" fontSize="10" fontWeight="700">
                {ff.icon || '📍'} {ff.name}
              </text>
            </g>
          );
        })}

        {/* Render Rooms */}
        {activeRooms.map((r) => {
          const rx = PAD + r.x * S;
          const ry = PAD + r.y * S;
          const rw = r.w * S;
          const rh = r.h * S;
          const isSelected = settings.selectedItemId === r.id;

          return (
            <g
              key={r.id}
              transform={`translate(${rx}, ${ry})`}
              onPointerDown={(e) => handleRoomClick(e, r)}
              className="cursor-move"
            >
              <rect
                width={rw}
                height={rh}
                fill={r.color}
                fillOpacity={isSelected ? 0.75 : 0.45}
                stroke={isSelected ? '#a855f7' : '#64748b'}
                strokeWidth={isSelected ? 3 : 1.5}
                rx="6"
              />
              <text x={rw / 2} y={rh / 2 - 4} textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="800">
                {r.icon || '🏠'} {r.name}
              </text>
              <text x={rw / 2} y={rh / 2 + 10} textAnchor="middle" fill="#cbd5e1" fontSize="9" fontWeight="600">
                {r.w}' × {r.h}' ({r.w * r.h} sqft)
              </text>
            </g>
          );
        })}

        {/* Render Interactive Door & Window Openings on 2D Blueprint */}
        {activeOpenings.map((op) => {
          const targetRoom = activeRooms.find((r) => r.id === op.roomId);
          if (!targetRoom) return null;

          let opX = PAD + (targetRoom.x + op.offset) * S;
          let opY = PAD + (targetRoom.y + targetRoom.h) * S;
          let isVert = false;

          if (op.wall === 'north') {
            opY = PAD + targetRoom.y * S;
          } else if (op.wall === 'west') {
            opX = PAD + targetRoom.x * S;
            opY = PAD + (targetRoom.y + op.offset) * S;
            isVert = true;
          } else if (op.wall === 'east') {
            opX = PAD + (targetRoom.x + targetRoom.w) * S;
            opY = PAD + (targetRoom.y + op.offset) * S;
            isVert = true;
          }

          const isDoor = op.type === 'door' || op.type === 'double_door';
          const isSelected = settings.selectedItemId === op.id;

          return (
            <g
              key={op.id}
              onPointerDown={(e) => handleOpeningClick(e, op)}
              className="cursor-move"
            >
              {isDoor ? (
                // 2D Door Opening & Arc Swing with Selection Glow
                <g transform={`translate(${opX}, ${opY})`}>
                  <rect
                    x={-2}
                    y={-4}
                    width={isVert ? 8 : op.width * S}
                    height={isVert ? op.width * S : 8}
                    fill={isSelected ? '#f59e0b' : '#fbbf24'}
                    stroke={isSelected ? '#ffffff' : '#b45309'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    rx="2"
                  />
                  <path
                    d={isVert ? `M 0 0 A ${op.width * S} ${op.width * S} 0 0 1 ${op.width * S} ${op.width * S}` : `M 0 0 A ${op.width * S} ${op.width * S} 0 0 1 ${op.width * S} ${op.width * S}`}
                    fill="none"
                    stroke="#fbbf24"
                    strokeWidth="1.5"
                    strokeDasharray="3,3"
                  />
                  <text x={op.width * S / 2} y={-8} textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="800">
                    🚪 Door ({op.width}')
                  </text>
                </g>
              ) : (
                // 2D Window Opening & Glass Line with Selection Glow
                <g transform={`translate(${opX}, ${opY})`}>
                  <rect
                    x={-2}
                    y={-4}
                    width={isVert ? 8 : op.width * S}
                    height={isVert ? op.width * S : 8}
                    fill={isSelected ? '#a855f7' : '#38bdf8'}
                    stroke={isSelected ? '#ffffff' : '#0284c7'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    rx="2"
                  />
                  <text x={op.width * S / 2} y={-8} textAnchor="middle" fill="#38bdf8" fontSize="9" fontWeight="800">
                    🪟 Window ({op.width}')
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Render Interactive Custom Drawn Wall Segments */}
        {activeWalls.map((w) => {
          const isSelected = settings.selectedItemId === w.id;
          return (
            <g
              key={w.id}
              onClick={(e) => handleWallClick(e, w)}
              className="cursor-pointer"
            >
              <line
                x1={PAD + w.x1 * S}
                y1={PAD + w.y1 * S}
                x2={PAD + w.x2 * S}
                y2={PAD + w.y2 * S}
                stroke={isSelected ? '#f59e0b' : w.color || '#78350f'}
                strokeWidth={isSelected ? (w.thickness * S) + 4 : w.thickness * S}
                strokeLinecap="round"
              />
            </g>
          );
        })}

        {/* Active Wall Drawing Line Preview */}
        {drawingWall && (
          <line
            x1={PAD + drawingWall.x1 * S}
            y1={PAD + drawingWall.y1 * S}
            x2={PAD + drawingWall.x2 * S}
            y2={PAD + drawingWall.y2 * S}
            stroke="#fbbf24"
            strokeWidth={10}
            strokeDasharray="4,4"
          />
        )}
      </svg>
    </div>
  );
}
