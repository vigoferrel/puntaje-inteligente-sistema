
export type UniverseMode = 
  | 'overview' 
  | 'subject' 
  | 'neural' 
  | 'progress' 
  | 'prediction';

export type Position3D = [number, number, number];

export interface Galaxy {
  id: string;
  name: string;
  color: string;
  position: Position3D;
  nodes: number;
  completed: number;
  description: string;
  testCode: string;
}

export interface UniverseMetrics {
  totalNodes: number;
  totalCompleted: number;
  overallProgress: number;
  activeGalaxies: number;
  projectedScore: number;
  neuralPower: number;
}

export interface UniverseConfig {
  enableAutoRotation: boolean;
  particleCount: number;
  ambientLightIntensity: number;
  galaxySpacing: number;
}

export interface NeuralDimension {
  id: string;
  name: string;
  description: string;
  color: string;
  position: Position3D;
  complexity: number;
  isUnlocked: boolean;
}

export interface NeuralBrainProps {
  position: Position3D;
  scale?: number;
  isActive?: boolean;
  onClick?: () => void;
  userLevel: number;
  cosmicEnergy: number;
}

export interface SubjectGalaxyProps {
  galaxy: Galaxy;
  isSelected?: boolean;
  isVisible?: boolean;
  onClick?: () => void;
  scale?: number;
}
