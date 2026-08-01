export type FloorId = 'ground' | 'first' | 'second' | 'third';

export type MaterialType = 'oak_hardwood' | 'marble' | 'slate_tile' | 'carpet' | 'concrete';

export type FurnitureCategory = 'sofa' | 'bed' | 'dining' | 'kitchen_island' | 'tv_stand' | 'sanitary' | 'plant' | 'lamp' | 'table';

export type PlotShape = 'rectangular' | 'l_shaped' | 't_shaped' | 'irregular_polygon';

export type ActiveTool = 'select' | 'wall' | 'door' | 'window' | 'room' | 'eraser';

export interface Room {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  wallColor?: string;
  floorMaterial?: MaterialType;
  icon?: string;
  vastu?: string;
}

export interface FurnitureItem {
  id: string;
  name: string;
  category: FurnitureCategory;
  floor: FloorId;
  x: number;
  y: number;
  zHeight?: number;
  w: number;
  h: number;
  height?: number;
  rotation: number;
  color: string;
  icon: string;
}

export interface FixedFeature {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  icon?: string;
  desc?: string;
  rotation?: number;
  category?: 'door' | 'window' | 'structure';
}

export interface OpeningItem {
  id: string;
  type: 'door' | 'window' | 'double_door' | 'ventilator';
  roomId: string;
  wall: 'north' | 'south' | 'east' | 'west';
  offset: number; // Distance from wall start in feet
  width: number; // Width of opening in feet
  floor: FloorId;
}

export interface WallSegment {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  height: number;
  color: string;
}

export interface PlotConfig {
  w: number;
  h: number;
  shape: PlotShape;
  vertices?: Array<{ x: number; y: number }>;
}

export type CameraViewMode = '2d' | 'orbit' | 'fps' | 'ortho_top' | 'exploded';

export type TimeOfDay = 'day' | 'sunset' | 'night';

export interface ViewerSettings {
  cameraMode: CameraViewMode;
  timeOfDay: TimeOfDay;
  showPlumbing: boolean;
  showSoil: boolean;
  showElectrical: boolean;
  showVastu: boolean;
  showGrid: boolean;
  showFurniture: boolean;
  wallHeight: number;
  activeFloor: FloorId;
  activeTool: ActiveTool;
  selectedItemId: string | null;
  selectedItemType: 'room' | 'furniture' | 'fixed' | 'wall' | 'opening' | null;
}
