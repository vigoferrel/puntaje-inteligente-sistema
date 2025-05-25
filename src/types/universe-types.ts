
/**
 * Unified Universe Types
 * Centralized type definitions to eliminate duplications and inconsistencies
 */
import { TPAESPrueba } from './system-types';

// Core 3D Position Type
export type Position3D = [number, number, number];

// Universe Mode Types
export type UniverseMode = 'overview' | 'subject' | 'neural' | 'prediction' | 'progress';

// Galaxy Interface (unified)
export interface Galaxy {
  id: string;
  name: string;
  color: string;
  position: Position3D;
  nodes: number;
  completed: number;
  description: string;
  testCode?: TPAESPrueba;
}

// Universe Configuration
export interface UniverseConfig {
  initialMode?: UniverseMode;
  activeSubject?: string;
  autoRotate?: boolean;
  showMetrics?: boolean;
}

// User Metrics (unified)
export interface UniverseMetrics {
  totalNodes: number;
  totalCompleted: number;
  overallProgress: number;
  activeGalaxies: number;
  projectedScore: number;
  neuralPower: number;
}

// Component Props Interfaces
export interface UniverseComponentProps {
  config: UniverseConfig;
  galaxies: Galaxy[];
  metrics: UniverseMetrics;
  onModeChange: (mode: UniverseMode) => void;
  onGalaxySelect: (galaxyId: string) => void;
}

export interface NeuralBrainProps {
  position: Position3D;
  scale: number;
  isActive: boolean;
  onClick: () => void;
  userLevel: number;
  cosmicEnergy: number;
}

export interface SubjectGalaxyProps {
  galaxy: Galaxy;
  isSelected: boolean;
  isVisible: boolean;
  onClick: () => void;
  scale: number;
}
