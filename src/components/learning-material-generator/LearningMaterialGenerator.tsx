
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RefreshCw, Settings as SettingsIcon, Brain, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { PhaseSelector } from './components/PhaseSelector';
import { MaterialTypeSelector } from './components/MaterialTypeSelector';
import { ConfigurationPanel } from './components/ConfigurationPanel';
import { NodeDescriptor } from '../exercise-generator/components/NodeDescriptor';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { MaterialGenerationConfig, MaterialType } from './types/learning-material-types';
import { TLearningCyclePhase } from '@/types/system-types';
import { PHASE_CONFIG, getRecommendedConfigForPhase } from './utils/phase-material-mapping';
import { usePAESCycleIntegration } from '@/hooks/lectoguia/use-paes-cycle-integration';
import { getLearningCyclePhase } from '@/services/node/learning-cycle-service';
import { useAuth } from '@/contexts/AuthContext';

interface LearningMaterialGeneratorProps {
  selectedSubject: string;
  subjects: any;
  onGenerate: (config: any) => void;
  isGenerating: boolean;
}

export const LearningMaterialGenerator: React.FC<LearningMaterialGeneratorProps> = ({
  selectedSubject,
  subjects,
  onGenerate,
  isGenerating
}) => {
  const { user } = useAuth();
  const { getPhaseConfig } = usePAESCycleIntegration();
  
  // Estados de carga y error
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState<string | null>(null);
  
  // Estado del generador
  const [selectedPhase, setSelectedPhase] = useState<TLearningCyclePhase>('SKILL_TRAINING');
  const [currentUserPhase, setCurrentUserPhase] = useState<TLearningCyclePhase | null>(null);
  const [materialType, setMaterialType] = useState<MaterialType>('exercises');
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [config, setConfig] = useState<MaterialGenerationConfig>({
    materialType: 'exercises',
    phase: 'SKILL_TRAINING',
    subject: selectedSubject,
    tier: 'tier1',
    nodes: [],
    difficulty: 'intermedio',
    count: 5,
    apiKey: '',
    userLevel: 'intermediate',
    timeAvailable: 30,
    personalizedMode: false
  });

  // Función helper para validar fase
  const isValidPhase = (phase: string): phase is TLearningCyclePhase => {
    return PHASE_CONFIG && typeof PHASE_CONFIG === 'object' && phase in PHASE_CONFIG;
  };

  // Cargar fase actual del usuario con manejo de errores
  useEffect(() => {
    const loadUserPhase = async () => {
      if (!user?.id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setLoadingError(null);
        
        const phase = await getLearningCyclePhase(user.id);
        
        if (isValidPhase(phase)) {
          setCurrentUserPhase(phase);
          setSelectedPhase(phase);
          setConfig(prev => ({ ...prev, phase }));
        } else {
          console.warn('Fase inválida recibida:', phase);
          setCurrentUserPhase('SKILL_TRAINING');
          setSelectedPhase('SKILL_TRAINING');
        }
      } catch (error) {
        console.error('Error loading user phase:', error);
        setLoadingError('Error al cargar la fase del usuario');
        // Usar valores por defecto en caso de error
        setCurrentUserPhase('SKILL_TRAINING');
        setSelectedPhase('SKILL_TRAINING');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadUserPhase();
  }, [user?.id]);

  // Actualizar configuración cuando cambia la fase con validación
  useEffect(() => {
    if (!isValidPhase(selectedPhase)) {
      console.warn('Fase seleccionada inválida:', selectedPhase);
      return;
    }

    try {
      const phaseConfig = getRecommendedConfigForPhase(selectedPhase, selectedSubject);
      const phaseData = PHASE_CONFIG[selectedPhase];
      
      if (phaseData && phaseConfig) {
        setMaterialType(phaseConfig.primaryMaterial);
        setConfig(prev => ({
          ...prev,
          phase: selectedPhase,
          materialType: phaseConfig.primaryMaterial,
          count: phaseData.defaultCount,
          timeAvailable: phaseData.estimatedDuration
        }));
      }
    } catch (error) {
      console.error('Error updating phase configuration:', error);
    }
  }, [selectedPhase, selectedSubject]);

  // Actualizar configuración cuando cambia el tipo de material
  useEffect(() => {
    setConfig(prev => ({ ...prev, materialType }));
  }, [materialType]);

  // Obtener nodos disponibles (mock simplificado)
  const getNodesForTier = (subject: string, tier: string) => {
    const nodeMaps = {
      'competencia-lectora': {
        tier1: ['CL-RL-01', 'CL-RL-02', 'CL-IR-01', 'CL-IR-02', 'CL-ER-01'],
        tier2: ['CL-RL-03', 'CL-RL-04', 'CL-IR-03', 'CL-IR-04', 'CL-ER-02'],
        tier3: ['CL-RL-05', 'CL-IR-05', 'CL-ER-03']
      },
      'matematica-m1': {
        tier1: ['M1-NUM-01', 'M1-ALG-01', 'M1-GEO-01', 'M1-ALG-02'],
        tier2: ['M1-NUM-02', 'M1-ALG-03', 'M1-GEO-02', 'M1-PROB-01'],
        tier3: ['M1-NUM-03', 'M1-ALG-04', 'M1-GEO-03']
      },
      'matematica-m2': {
        tier1: ['M2-ALG-01', 'M2-ALG-02', 'M2-GEO-01', 'M2-CALC-01'],
        tier2: ['M2-ALG-03', 'M2-GEO-02', 'M2-PROB-01'],
        tier3: ['M2-ALG-04', 'M2-GEO-03', 'M2-CALC-02']
      },
      'historia': {
        tier1: ['HST-37', 'HST-20', 'FC-01', 'HST-41', 'HST-42'],
        tier2: ['HST-01', 'HST-02', 'FC-03', 'HST-15', 'ECO-01'],
        tier3: ['HST-10', 'HST-11', 'FC-08', 'ECO-04']
      },
      'ciencias': {
        tier1: ['CC-BIO-01', 'CC-FIS-01', 'CC-QUIM-01', 'CC-BIO-02'],
        tier2: ['CC-BIO-13', 'CC-FIS-09', 'CC-QUIM-09', 'CC-BIO-14'],
        tier3: ['CC-BIO-28', 'CC-FIS-19', 'CC-QUIM-19', 'CC-BIO-29']
      }
    };
    
    return nodeMaps[subject]?.[tier] || [];
  };

  const availableNodes = getNodesForTier(selectedSubject, config.tier);
  
  // Obtener datos de fase de forma segura
  const getPhaseData = () => {
    if (!isValidPhase(selectedPhase)) {
      return PHASE_CONFIG['SKILL_TRAINING']; // fallback seguro
    }
    return PHASE_CONFIG[selectedPhase];
  };

  const phaseData = getPhaseData();
  const recommendedMaterials = phaseData?.recommendedMaterials || ['exercises'];

  const handleNodeToggle = (nodeId: string) => {
    const newNodes = selectedNodes.includes(nodeId) 
      ? selectedNodes.filter(id => id !== nodeId)
      : [...selectedNodes, nodeId];
    
    setSelectedNodes(newNodes);
    setConfig(prev => ({ ...prev, nodes: newNodes }));
  };

  const handleGenerate = () => {
    if (selectedNodes.length === 0) {
      alert('Selecciona al menos un nodo para generar material');
      return;
    }

    const finalConfig = {
      ...config,
      nodes: selectedNodes,
      subject: selectedSubject,
      phase: selectedPhase,
      materialType
    };

    onGenerate(finalConfig);
  };

  // Estado de carga
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-32 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado de error
  if (loadingError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {loadingError}. Usando configuración por defecto.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con información de la fase actual */}
      {currentUserPhase && isValidPhase(currentUserPhase) && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{PHASE_CONFIG[currentUserPhase]?.icon || '🎯'}</span>
                <div>
                  <h3 className="font-semibold">
                    Tu Fase Actual: {PHASE_CONFIG[currentUserPhase]?.name || 'Entrenamiento'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {PHASE_CONFIG[currentUserPhase]?.description || 'Desarrolla tus habilidades'}
                  </p>
                </div>
              </div>
              <Badge variant="default">Activa</Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selector de Fase */}
      <PhaseSelector
        selectedPhase={selectedPhase}
        onPhaseChange={setSelectedPhase}
        currentUserPhase={currentUserPhase}
      />

      {/* Selector de Tipo de Material */}
      <MaterialTypeSelector
        selectedType={materialType}
        onTypeChange={setMaterialType}
        recommendedTypes={recommendedMaterials}
        count={config.count}
      />

      {/* Panel de Configuración */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Configuración Detallada
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          >
            <SettingsIcon className="w-4 h-4 mr-2" />
            {showAdvancedSettings ? 'Ocultar' : 'Mostrar'} Avanzadas
            {showAdvancedSettings ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </Button>
        </div>
        
        <ConfigurationPanel
          config={config}
          onConfigChange={(updates) => setConfig(prev => ({ ...prev, ...updates }))}
          showAdvancedSettings={showAdvancedSettings}
        />
      </div>

      {/* Selector de Nodos Mejorado */}
      <Card>
        <CardHeader>
          <CardTitle>Nodos de Aprendizaje ({availableNodes.length} disponibles)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-h-60 overflow-y-auto space-y-3">
            {availableNodes.map(nodeId => (
              <div key={nodeId} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 border">
                <Checkbox
                  id={nodeId}
                  checked={selectedNodes.includes(nodeId)}
                  onCheckedChange={() => handleNodeToggle(nodeId)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <NodeDescriptor nodeCode={nodeId} showFullInfo={true} />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Botón de Generación */}
      <Card>
        <CardContent className="p-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || selectedNodes.length === 0}
            className="w-full h-12"
            size="lg"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Generando {phaseData?.name || 'Material'}...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Generar {config.count} {materialType === 'exercises' ? 'Ejercicios' : 
                         materialType === 'study_content' ? 'Materiales de Estudio' :
                         materialType === 'diagnostic_tests' ? 'Evaluaciones' :
                         materialType === 'practice_guides' ? 'Guías de Práctica' : 'Simulacros'}
              </>
            )}
          </Button>
          
          {selectedNodes.length > 0 && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                ✨ Se generará material para <strong>{selectedNodes.length} nodos</strong> en la fase de{' '}
                <strong>{phaseData?.name || 'Entrenamiento'}</strong>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Tiempo estimado: ~{config.timeAvailable} minutos
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
