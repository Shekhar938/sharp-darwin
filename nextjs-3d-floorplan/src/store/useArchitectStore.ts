import { create } from 'zustand';
import { FloorId, Room, FixedFeature, WallSegment, PlotConfig, ViewerSettings, FurnitureItem, MaterialType, ActiveTool, OpeningItem, PlotShape } from '../types/floorplan';

interface ArchitectState {
  plot: PlotConfig;
  floorConfig: Array<{ id: FloorId; label: string }>;
  floors: Record<FloorId, Room[]>;
  floorFixed: Record<FloorId, FixedFeature[]>;
  floorWalls: Record<FloorId, WallSegment[]>;
  floorOpenings: Record<FloorId, OpeningItem[]>;
  furniture: FurnitureItem[];
  settings: ViewerSettings;

  // Actions
  setPlot: (plotUpdates: Partial<PlotConfig>) => void;
  setActiveFloor: (floor: FloorId) => void;
  setActiveTool: (tool: ActiveTool) => void;
  setCameraMode: (mode: ViewerSettings['cameraMode']) => void;
  setTimeOfDay: (time: ViewerSettings['timeOfDay']) => void;
  toggleMEPLayer: (layer: 'plumbing' | 'soil' | 'electrical' | 'vastu' | 'furniture') => void;
  selectItem: (id: string | null, type: ViewerSettings['selectedItemType']) => void;
  
  // Room Actions
  addRoom: (floor: FloorId, room: Omit<Room, 'id'>) => void;
  updateRoom: (floor: FloorId, id: string, updates: Partial<Room>) => void;
  setRoomMaterial: (floor: FloorId, id: string, material: MaterialType) => void;
  setRoomWallColor: (floor: FloorId, id: string, color: string) => void;
  deleteRoom: (floor: FloorId, id: string) => void;

  // Fixed Feature Actions
  updateFixedFeature: (floor: FloorId, id: string, updates: Partial<FixedFeature>) => void;
  deleteFixedFeature: (floor: FloorId, id: string) => void;

  // Custom Wall Actions
  addWallSegment: (floor: FloorId, wall: Omit<WallSegment, 'id'>) => void;
  updateWallSegment: (floor: FloorId, id: string, updates: Partial<WallSegment>) => void;
  deleteWallSegment: (floor: FloorId, id: string) => void;

  // Door & Window Opening Actions
  addOpening: (floor: FloorId, opening: Omit<OpeningItem, 'id' | 'floor'>) => void;
  updateOpening: (floor: FloorId, id: string, updates: Partial<OpeningItem>) => void;
  deleteOpening: (floor: FloorId, id: string) => void;

  // Furniture Actions
  addFurniture: (item: Omit<FurnitureItem, 'id'>) => void;
  updateFurniture: (id: string, updates: Partial<FurnitureItem>) => void;
  deleteFurniture: (id: string) => void;

  // Load Preset Backup JSON
  loadLayoutJSON: (jsonData: any) => void;
}

const INITIAL_PLOT: PlotConfig = { w: 27, h: 33, shape: 'rectangular' };

const INITIAL_FLOOR_CONFIG: Array<{ id: FloorId; label: string }> = [
  { id: 'ground', label: 'Ground Floor' },
  { id: 'first', label: '1st Floor' },
  { id: 'second', label: '2nd Floor' },
  { id: 'third', label: '3rd Floor' },
];

const INITIAL_FLOORS: Record<FloorId, Room[]> = {
  ground: [
    { id: 'g_bed2', name: 'Bedroom 2', x: 0, y: 0, w: 10, h: 10, color: '#312e81', floorMaterial: 'oak_hardwood', vastu: 'South-West (100 sqft)' },
    { id: 'g_bath', name: 'Bathroom', x: 10, y: 3, w: 8, h: 5, color: '#155e75', floorMaterial: 'slate_tile', vastu: 'West / NW (40 sqft)' },
    { id: 'g_kit', name: 'Kitchen', x: 0, y: 17, w: 9, h: 6, color: '#78350f', floorMaterial: 'marble', vastu: 'South-East (54 sqft)' },
  ],
  first: [
    { id: 'f_bed2', name: 'Bedroom 2', x: 0, y: 0, w: 11, h: 10, color: '#312e81', floorMaterial: 'oak_hardwood', vastu: 'South-West (100 sqft)' },
    { id: 'f_bath1', name: 'Bathroom', x: 11, y: 2, w: 6, h: 5.5, color: '#155e75', floorMaterial: 'slate_tile', vastu: 'West / NW (40 sqft)' },
    { id: 'f_bed3', name: 'Bedroom 3', x: 17, y: 0, w: 10, h: 11, color: '#4c1d95', floorMaterial: 'oak_hardwood', vastu: 'North-West (90 sqft)' },
    { id: 'f_bath2', name: 'Bathroom', x: 19, y: 11, w: 6, h: 5, color: '#0e7490', floorMaterial: 'slate_tile', vastu: 'East / NE (24 sqft)' },
    { id: 'f_kit', name: 'Kitchen', x: 0, y: 17, w: 10, h: 6, color: '#78350f', floorMaterial: 'marble', vastu: 'South-East (54 sqft)' },
    { id: 'f_din', name: 'Dining Area', x: 10, y: 19, w: 10.5, h: 7.5, color: '#831843', floorMaterial: 'marble', vastu: 'East (48 sqft)' },
    { id: 'f_balc', name: 'Balcony', x: 20.5, y: 20, w: 6.5, h: 6.5, color: '#14532d', floorMaterial: 'slate_tile' },
    { id: 'f_pooja', name: 'Pooja Room', x: 23, y: 16, w: 4, h: 4, color: '#b45309', floorMaterial: 'marble' },
  ],
  second: [
    { id: 's_bed2', name: 'Bedroom 2', x: 0, y: 0, w: 10, h: 10, color: '#312e81', floorMaterial: 'oak_hardwood' },
    { id: 's_bath', name: 'Bathroom', x: 10, y: 2, w: 8, h: 5, color: '#155e75', floorMaterial: 'slate_tile' },
    { id: 's_bed3', name: 'Bedroom 3', x: 18, y: 0, w: 9, h: 11, color: '#4c1d95', floorMaterial: 'oak_hardwood' },
    { id: 's_bath2', name: 'Bathroom', x: 17, y: 11, w: 8, h: 5.5, color: '#0e7490', floorMaterial: 'slate_tile' },
    { id: 's_kit', name: 'Kitchen', x: 0, y: 17, w: 9, h: 6, color: '#78350f', floorMaterial: 'marble' },
    { id: 's_din', name: 'Dining Area', x: 9, y: 20, w: 5.5, h: 6, color: '#831843', floorMaterial: 'marble' },
    { id: 's_bed1', name: 'Bedroom', x: 14.5, y: 16.5, w: 10, h: 9.5, color: '#3730a3', floorMaterial: 'oak_hardwood' },
  ],
  third: [
    { id: 't_bed2', name: 'Bedroom 2', x: 0, y: 0, w: 10, h: 10, color: '#312e81', floorMaterial: 'oak_hardwood' },
    { id: 't_bath', name: 'Bathroom', x: 10, y: 2, w: 8, h: 4.5, color: '#155e75', floorMaterial: 'slate_tile' },
    { id: 't_bed3', name: 'Bedroom 3', x: 18, y: 0, w: 9, h: 10, color: '#4c1d95', floorMaterial: 'oak_hardwood' },
    { id: 't_kit', name: 'Kitchen', x: 0, y: 17, w: 9, h: 6, color: '#78350f', floorMaterial: 'marble' },
    { id: 't_din', name: 'Dining Area', x: 9, y: 19.5, w: 8, h: 6, color: '#831843', floorMaterial: 'marble' },
  ],
};

const INITIAL_FIXED: Record<FloorId, FixedFeature[]> = {
  ground: [
    { id: 'shaft1', name: 'West Shaft 1', x: 10, y: 0, w: 8, h: 2, color: '#831843', desc: 'Top Wall Shaft' },
    { id: 'septic', name: 'Septic Tank', x: 10, y: 0, w: 8, h: 7, color: '#334155', desc: 'Top Wall Tank' },
    { id: 'stairs', name: 'Staircase', x: 0, y: 10, w: 12, h: 7, color: '#334155', desc: 'Left Wall Stairs' },
    { id: 'shaft2', name: 'North Shaft 2', x: 25, y: 10, w: 2, h: 4, color: '#a16207', desc: 'Right Wall Shaft' },
    { id: 'watertank', name: 'Overhead Tank', x: 22, y: 18, w: 5, h: 5, color: '#1d4ed8', desc: 'Bottom-Right Tank' },
    { id: 'borewell', name: 'Borewell / Sump', x: 22, y: 26, w: 3.5, h: 2, color: '#14532d', desc: 'Fixed Structure' },
  ],
  first: [],
  second: [],
  third: [],
};

const INITIAL_WALLS: Record<FloorId, WallSegment[]> = {
  ground: [
    { id: 'w1', x1: 0, y1: 0, x2: 27, y2: 0, thickness: 0.5, height: 10, color: '#78350f' },
    { id: 'w2', x1: 27, y1: 0, x2: 27, y2: 33, thickness: 0.5, height: 10, color: '#78350f' },
    { id: 'w3', x1: 0, y1: 0, x2: 0, y2: 33, thickness: 0.5, height: 10, color: '#78350f' },
    { id: 'w4', x1: 0, y1: 33, x2: 27, y2: 33, thickness: 0.5, height: 10, color: '#78350f' },
  ],
  first: [],
  second: [],
  third: [],
};

const INITIAL_OPENINGS: Record<FloorId, OpeningItem[]> = {
  ground: [
    { id: 'op_1', type: 'door', roomId: 'g_bed2', wall: 'south', offset: 3, width: 3, floor: 'ground' },
    { id: 'op_2', type: 'window', roomId: 'g_bed2', wall: 'west', offset: 2, width: 4, floor: 'ground' },
  ],
  first: [
    { id: 'op_3', type: 'double_door', roomId: 'f_bed2', wall: 'south', offset: 4, width: 4, floor: 'first' },
    { id: 'op_4', type: 'window', roomId: 'f_bed2', wall: 'west', offset: 3, width: 4, floor: 'first' },
    { id: 'op_5', type: 'window', roomId: 'f_bed3', wall: 'east', offset: 2, width: 4, floor: 'first' },
  ],
  second: [],
  third: [],
};

const INITIAL_FURNITURE: FurnitureItem[] = [
  { id: 'furn_1', name: 'Master King Bed', category: 'bed', floor: 'first', x: 2, y: 2, w: 6, h: 6, rotation: 0, color: '#4f46e5', icon: '🛏️' },
  { id: 'furn_2', name: 'L-Shape Modern Sofa', category: 'sofa', floor: 'first', x: 12, y: 20, w: 6, h: 4, rotation: 90, color: '#059669', icon: '🛋️' },
  { id: 'furn_3', name: '6-Seater Dining Set', category: 'dining', floor: 'first', x: 12, y: 21, w: 5, h: 4, rotation: 0, color: '#b45309', icon: '🍽️' },
  { id: 'furn_4', name: 'Granite Kitchen Island', category: 'kitchen_island', floor: 'first', x: 2, y: 18, w: 5, h: 2.5, rotation: 0, color: '#d97706', icon: '🍳' },
  { id: 'furn_5', name: 'Potted Indoor Palm', category: 'plant', floor: 'first', x: 25, y: 21, w: 2, h: 2, rotation: 0, color: '#16a34a', icon: '🪴' },
];

export const useArchitectStore = create<ArchitectState>((set) => ({
  plot: INITIAL_PLOT,
  floorConfig: INITIAL_FLOOR_CONFIG,
  floors: INITIAL_FLOORS,
  floorFixed: INITIAL_FIXED,
  floorWalls: INITIAL_WALLS,
  floorOpenings: INITIAL_OPENINGS,
  furniture: INITIAL_FURNITURE,
  settings: {
    cameraMode: '2d',
    timeOfDay: 'day',
    showPlumbing: true,
    showSoil: true,
    showElectrical: true,
    showVastu: true,
    showGrid: true,
    showFurniture: true,
    wallHeight: 10,
    activeFloor: 'first',
    activeTool: 'select',
    selectedItemId: null,
    selectedItemType: null,
  },

  setPlot: (plotUpdates) => set((state) => ({ plot: { ...state.plot, ...plotUpdates } })),
  setActiveFloor: (floor) => set((state) => ({ settings: { ...state.settings, activeFloor: floor } })),
  setActiveTool: (tool) => set((state) => ({ settings: { ...state.settings, activeTool: tool } })),
  setCameraMode: (mode) => set((state) => ({ settings: { ...state.settings, cameraMode: mode } })),
  setTimeOfDay: (time) => set((state) => ({ settings: { ...state.settings, timeOfDay: time } })),
  toggleMEPLayer: (layer) => set((state) => {
    const s = state.settings;
    return {
      settings: {
        ...s,
        showPlumbing: layer === 'plumbing' ? !s.showPlumbing : s.showPlumbing,
        showSoil: layer === 'soil' ? !s.showSoil : s.showSoil,
        showElectrical: layer === 'electrical' ? !s.showElectrical : s.showElectrical,
        showVastu: layer === 'vastu' ? !s.showVastu : s.showVastu,
        showFurniture: layer === 'furniture' ? !s.showFurniture : s.showFurniture,
      },
    };
  }),
  selectItem: (id, type) => set((state) => ({
    settings: { ...state.settings, selectedItemId: id, selectedItemType: type },
  })),

  addRoom: (floor, room) => set((state) => {
    const newRoom: Room = { ...room, id: 'r_' + Math.random().toString(36).substring(2, 9) };
    return {
      floors: {
        ...state.floors,
        [floor]: [...(state.floors[floor] || []), newRoom],
      },
    };
  }),

  updateRoom: (floor, id, updates) => set((state) => ({
    floors: {
      ...state.floors,
      [floor]: (state.floors[floor] || []).map((r) => (r.id === id ? { ...r, ...updates } : r)),
    },
  })),

  setRoomMaterial: (floor, id, material) => set((state) => ({
    floors: {
      ...state.floors,
      [floor]: (state.floors[floor] || []).map((r) => (r.id === id ? { ...r, floorMaterial: material } : r)),
    },
  })),

  setRoomWallColor: (floor, id, color) => set((state) => ({
    floors: {
      ...state.floors,
      [floor]: (state.floors[floor] || []).map((r) => (r.id === id ? { ...r, wallColor: color } : r)),
    },
  })),

  deleteRoom: (floor, id) => set((state) => ({
    floors: {
      ...state.floors,
      [floor]: (state.floors[floor] || []).filter((r) => r.id !== id),
    },
  })),

  updateFixedFeature: (floor, id, updates) => set((state) => ({
    floorFixed: {
      ...state.floorFixed,
      [floor]: (state.floorFixed[floor] || []).map((ff) => (ff.id === id ? { ...ff, ...updates } : ff)),
    },
  })),

  deleteFixedFeature: (floor, id) => set((state) => ({
    floorFixed: {
      ...state.floorFixed,
      [floor]: (state.floorFixed[floor] || []).filter((ff) => ff.id !== id),
    },
  })),

  addWallSegment: (floor, wall) => set((state) => {
    const newWall: WallSegment = { ...wall, id: 'w_' + Math.random().toString(36).substring(2, 9) };
    return {
      floorWalls: {
        ...state.floorWalls,
        [floor]: [...(state.floorWalls[floor] || []), newWall],
      },
    };
  }),

  updateWallSegment: (floor, id, updates) => set((state) => ({
    floorWalls: {
      ...state.floorWalls,
      [floor]: (state.floorWalls[floor] || []).map((w) => (w.id === id ? { ...w, ...updates } : w)),
    },
  })),

  deleteWallSegment: (floor, id) => set((state) => ({
    floorWalls: {
      ...state.floorWalls,
      [floor]: (state.floorWalls[floor] || []).filter((w) => w.id !== id),
    },
  })),

  addOpening: (floor, opening) => set((state) => {
    const newOpening: OpeningItem = { ...opening, floor, id: 'op_' + Math.random().toString(36).substring(2, 9) };
    return {
      floorOpenings: {
        ...state.floorOpenings,
        [floor]: [...(state.floorOpenings[floor] || []), newOpening],
      },
    };
  }),

  updateOpening: (floor, id, updates) => set((state) => ({
    floorOpenings: {
      ...state.floorOpenings,
      [floor]: (state.floorOpenings[floor] || []).map((op) => (op.id === id ? { ...op, ...updates } : op)),
    },
  })),

  deleteOpening: (floor, id) => set((state) => ({
    floorOpenings: {
      ...state.floorOpenings,
      [floor]: (state.floorOpenings[floor] || []).filter((op) => op.id !== id),
    },
  })),

  addFurniture: (item) => set((state) => ({
    furniture: [...state.furniture, { ...item, id: 'f_' + Math.random().toString(36).substring(2, 9) }],
  })),

  updateFurniture: (id, updates) => set((state) => ({
    furniture: state.furniture.map((item) => (item.id === id ? { ...item, ...updates } : item)),
  })),

  deleteFurniture: (id) => set((state) => ({
    furniture: state.furniture.filter((item) => item.id !== id),
  })),

  loadLayoutJSON: (jsonData) => set((state) => ({
    plot: jsonData.plot || state.plot,
    floors: jsonData.floors || state.floors,
    floorFixed: jsonData.floorFixed || state.floorFixed,
    floorWalls: jsonData.floorWalls || state.floorWalls,
    floorOpenings: jsonData.floorOpenings || state.floorOpenings,
  })),
}));
