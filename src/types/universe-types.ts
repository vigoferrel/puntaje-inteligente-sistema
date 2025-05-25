
export type UniverseMode = 
  | 'overview' 
  | 'subject' 
  | 'neural' 
  | 'progress' 
  | 'prediction';

export interface Galaxy {
  id: string;
  name: string;
  color: string;
  position: [number, number, number];
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
  position: [number, number, number];
  complexity: number;
  isUnlocked: boolean;
}
