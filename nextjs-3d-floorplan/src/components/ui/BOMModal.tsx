'use client';

import React from 'react';
import { useArchitectStore } from '../../store/useArchitectStore';
import { X, FileText, Printer } from 'lucide-react';

interface BOMModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BOMModal({ isOpen, onClose }: BOMModalProps) {
  const { plot, floors, furniture } = useArchitectStore();

  if (!isOpen) return null;

  // Calculate stats
  let totalBuiltupSqft = 0;
  let roomCount = 0;

  Object.values(floors).forEach((floorRooms) => {
    floorRooms.forEach((r) => {
      totalBuiltupSqft += r.w * r.h;
      roomCount += 1;
    });
  });

  const wallPaintSqft = Math.round(totalBuiltupSqft * 2.8);
  const paintGallons = Math.ceil(wallPaintSqft / 350);
  const totalFurnitureCount = furniture.length;

  const estimatedCost = Math.round(totalBuiltupSqft * 1850); // Estimated ₹1850 / sq ft construction cost

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl text-slate-100 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h2 className="text-lg font-bold text-white">Bill of Materials (BOM) & Quantity Takeoff</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Plot Area</span>
            <span className="text-base font-extrabold text-indigo-400">{plot.w * plot.h} sqft</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Built-up Area</span>
            <span className="text-base font-extrabold text-emerald-400">{totalBuiltupSqft} sqft</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Total Rooms</span>
            <span className="text-base font-extrabold text-purple-400">{roomCount} Suites</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
            <span className="text-[10px] text-slate-400 block font-medium uppercase">Furniture Units</span>
            <span className="text-base font-extrabold text-amber-400">{totalFurnitureCount} Items</span>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 text-slate-300 border-b border-slate-800">
                <th className="p-3">Material / Line Item</th>
                <th className="p-3">Quantity</th>
                <th className="p-3">Unit Specs</th>
                <th className="p-3 text-right">Est. Budget</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              <tr>
                <td className="p-3 font-semibold text-white">Flooring Tiles & Teak Hardwood</td>
                <td className="p-3">{totalBuiltupSqft} sq. ft.</td>
                <td className="p-3 text-slate-400">PBR Hardwood & Marble Tiles</td>
                <td className="p-3 text-right font-mono font-semibold text-emerald-400">₹{(totalBuiltupSqft * 180).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">Wall Surface Paint & Primer</td>
                <td className="p-3">{paintGallons} Gallons ({wallPaintSqft} sq. ft.)</td>
                <td className="p-3 text-slate-400">Emulsion Interior Paint</td>
                <td className="p-3 text-right font-mono font-semibold text-emerald-400">₹{(paintGallons * 3500).toLocaleString()}</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">MEP Plumbing & CPVC Piping</td>
                <td className="p-3">25mm CPVC & 110mm PVC</td>
                <td className="p-3 text-slate-400">Shaft 1 Plumbing Stack</td>
                <td className="p-3 text-right font-mono font-semibold text-emerald-400">₹1,45,000</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-white">3-Phase Electrical Wiring & DB</td>
                <td className="p-3">35mm² Copper Cable</td>
                <td className="p-3 text-slate-400">Shaft 2 Electrical Riser</td>
                <td className="p-3 text-right font-mono font-semibold text-emerald-400">₹1,85,000</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-[10px] text-slate-400 block font-medium">Estimated Turnkey Budget</span>
            <span className="text-xl font-black text-indigo-400">₹{estimatedCost.toLocaleString()}</span>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg shadow-indigo-600/25"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}
