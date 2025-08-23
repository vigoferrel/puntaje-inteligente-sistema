import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  BookOpen, 
  Target, 
  Zap, 
  TrendingUp, 
  Filter,
  Search,
  RefreshCw,
  BarChart3,
  Network,
  Atom,
  Layers
} from 'lucide-react';

interface UnifiedNode {
  id: string;
  type: 'exercise' | 'bloom_level' | 'subject' | 'quantum_node';
  title: string;
  description: string;
  subject: string;
  bloomLevel: string;
  difficulty: string;
  quantumState: {
    coherence: number;
    entanglement: number;
    entropy: number;
    isActive: boolean;
  };
  metadata: {
    exerciseCount?: number;
    nodeCount?: number;
    relatedNodes?: string[];
  };
  createdAt: string;
  updatedAt: string;
}

interface NodeStatistics {
  totalExercises: number;
  totalNodes: number;
  bloomLevels: number;
  subjects: number;
  quantumState: {
    coherence: number;
    entanglement: number;
    entropy: number;
    totalNodes: number;
  };
}

const UnifiedNodesDashboard: React.FC = () => {
  const [nodes, setNodes] = useState<UnifiedNode[]>([]);
  const [statistics, setStatistics] = useState<NodeStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    subject: '',
    bloomLevel: '',
    difficulty: '',
    type: '',
    isActive: undefined as boolean | undefined
  });
  const [searchTerm, setSearchTerm] = useState('');

  // Datos mock para demostración
  const mockNodes: UnifiedNode[] = [
    {
      id: '1',
      type: 'exercise',
      title: 'Comprensión Lectora Avanzada',
      description: 'Ejercicios de comprensión lectora para nivel avanzado',
      subject: 'Competencia Lectora',
      bloomLevel: 'Analizar',
      difficulty: 'Avanzado',
      quantumState: {
        coherence: 95.2,
        entanglement: 12,
        entropy: 18.5,
        isActive: true
      },
      metadata: {
        exerciseCount: 8,
        relatedNodes: ['2', '3']
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      type: 'bloom_level',
      title: 'Nivel Evaluar - Matemáticas',
      description: 'Nodos para evaluar conocimientos matemáticos',
      subject: 'Matemática M1',
      bloomLevel: 'Evaluar',
      difficulty: 'Excelencia',
      quantumState: {
        coherence: 98.7,
        entanglement: 15,
        entropy: 12.3,
        isActive: true
      },
      metadata: {
        nodeCount: 5,
        relatedNodes: ['1', '4']
      },
      createdAt: '2024-01-14T09:30:00Z',
      updatedAt: '2024-01-14T09:30:00Z'
    },
    {
      id: '3',
      type: 'quantum_node',
      title: 'Nodo Cuántico Ciencias',
      description: 'Nodo cuántico para ciencias con alta coherencia',
      subject: 'Ciencias',
      bloomLevel: 'Crear',
      difficulty: 'Avanzado',
      quantumState: {
        coherence: 99.1,
        entanglement: 23,
        entropy: 8.9,
        isActive: true
      },
      metadata: {
        exerciseCount: 12,
        nodeCount: 8,
        relatedNodes: ['1', '2']
      },
      createdAt: '2024-01-13T14:20:00Z',
      updatedAt: '2024-01-13T14:20:00Z'
    }
  ];

  const mockStatistics: NodeStatistics = {
    totalExercises: 16,
    totalNodes: 23,
    bloomLevels: 6,
    subjects: 5,
    quantumState: {
      coherence: 97.8,
      entanglement: 67,
      entropy: 24.6,
      totalNodes: 150
    }
  };

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setNodes(mockNodes);
      setStatistics(mockStatistics);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         node.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSubject = !filters.subject || node.subject === filters.subject;
    const matchesBloom = !filters.bloomLevel || node.bloomLevel === filters.bloomLevel;
    const matchesDifficulty = !filters.difficulty || node.difficulty === filters.difficulty;
    const matchesType = !filters.type || node.type === filters.type;
    const matchesActive = filters.isActive === undefined || node.quantumState.isActive === filters.isActive;

    return matchesSearch && matchesSubject && matchesBloom && matchesDifficulty && matchesType && matchesActive;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'exercise': return <BookOpen className="w-4 h-4" />;
      case 'bloom_level': return <Target className="w-4 h-4" />;
      case 'subject': return <Brain className="w-4 h-4" />;
      case 'quantum_node': return <Atom className="w-4 h-4" />;
      default: return <Layers className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'exercise': return 'bg-blue-500';
      case 'bloom_level': return 'bg-green-500';
      case 'subject': return 'bg-purple-500';
      case 'quantum_node': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="unified-nodes-dashboard">
      {/* Header */}
      <div className="unified-nodes-header">
        <div>
          <h2 className="unified-nodes-title">🧠 Nodos Unificados PAES</h2>
          <p className="unified-nodes-subtitle">Sistema integrado de nodos educativos</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Estadísticas */}
      {statistics && (
        <div className="unified-nodes-stats">
          <div className="stat-card">
            <div className="stat-icon bg-blue-500">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{statistics.totalExercises}</h3>
              <p className="stat-label">Ejercicios Totales</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-green-500">
              <Network className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{statistics.totalNodes}</h3>
              <p className="stat-label">Nodos Educativos</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-purple-500">
              <Target className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{statistics.bloomLevels}</h3>
              <p className="stat-label">Niveles Bloom</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon bg-orange-500">
              <Brain className="w-6 h-6" />
            </div>
            <div className="stat-content">
              <h3 className="stat-value">{statistics.subjects}</h3>
              <p className="stat-label">Materias</p>
            </div>
          </div>
        </div>
      )}

      {/* Estado Cuántico */}
      {statistics && (
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Atom className="w-5 h-5 text-primary" />
            Estado Cuántico del Sistema
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{statistics.quantumState.coherence}%</div>
              <div className="text-sm text-muted">Coherencia</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{statistics.quantumState.entanglement}</div>
              <div className="text-sm text-muted">Entrelazamiento</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-500">{statistics.quantumState.entropy}%</div>
              <div className="text-sm text-muted">Entropía</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{statistics.quantumState.totalNodes}</div>
              <div className="text-sm text-muted">Nodos</div>
            </div>
          </div>
        </div>
      )}

      {/* Filtros y Búsqueda */}
      <div className="unified-nodes-filters">
        <div className="unified-nodes-search">
          <Search className="unified-nodes-search-icon" />
          <input
            type="text"
            placeholder="Buscar nodos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="unified-nodes-filter-controls">
          <select
            value={filters.subject}
            onChange={(e) => setFilters({...filters, subject: e.target.value})}
          >
            <option value="">Todas las materias</option>
            <option value="Competencia Lectora">Competencia Lectora</option>
            <option value="Matemática M1">Matemática M1</option>
            <option value="Matemática M2">Matemática M2</option>
            <option value="Ciencias">Ciencias</option>
            <option value="Historia">Historia</option>
          </select>
          <select
            value={filters.bloomLevel}
            onChange={(e) => setFilters({...filters, bloomLevel: e.target.value})}
          >
            <option value="">Todos los niveles</option>
            <option value="Recordar">Recordar</option>
            <option value="Comprender">Comprender</option>
            <option value="Aplicar">Aplicar</option>
            <option value="Analizar">Analizar</option>
            <option value="Evaluar">Evaluar</option>
            <option value="Crear">Crear</option>
          </select>
        </div>
      </div>

      {/* Lista de Nodos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNodes.map((node) => (
          <div key={node.id} className="unified-node-card">
            <div className="unified-node-header">
              <div className={`unified-node-icon ${getTypeColor(node.type)}`}>
                {getTypeIcon(node.type)}
              </div>
              <div className="text-right">
                <div className="unified-node-type">{node.type.replace('_', ' ')}</div>
                <div className="unified-node-difficulty">{node.difficulty}</div>
              </div>
            </div>

            <h3 className="unified-node-title">{node.title}</h3>
            <p className="unified-node-description">{node.description}</p>

            <div className="unified-node-meta">
              <span>Materia:</span>
              <span>{node.subject}</span>
            </div>
            <div className="unified-node-meta">
              <span>Bloom:</span>
              <span>{node.bloomLevel}</span>
            </div>

            {/* Estado Cuántico */}
            <div className="unified-node-quantum">
              <div className="unified-node-quantum-title">Estado Cuántico</div>
              <div className="unified-node-quantum-grid">
                <div className="unified-node-quantum-item">
                  <div className="unified-node-quantum-value text-green-500">{node.quantumState.coherence}%</div>
                  <div className="unified-node-quantum-label">Coherencia</div>
                </div>
                <div className="unified-node-quantum-item">
                  <div className="unified-node-quantum-value text-blue-500">{node.quantumState.entanglement}</div>
                  <div className="unified-node-quantum-label">Entrelaz.</div>
                </div>
                <div className="unified-node-quantum-item">
                  <div className="unified-node-quantum-value text-orange-500">{node.quantumState.entropy}%</div>
                  <div className="unified-node-quantum-label">Entropía</div>
                </div>
              </div>
            </div>

            {/* Metadata */}
            <div className="unified-node-status">
              <span>
                {node.metadata.exerciseCount && `${node.metadata.exerciseCount} ejercicios`}
                {node.metadata.nodeCount && `${node.metadata.nodeCount} nodos`}
              </span>
              <span className={`unified-node-status-indicator ${node.quantumState.isActive ? 'unified-node-status-active' : 'unified-node-status-inactive'}`}>
                {node.quantumState.isActive ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredNodes.length === 0 && (
        <div className="unified-nodes-empty">
          <Network className="unified-nodes-empty-icon" />
          <h3 className="text-lg font-medium mb-2">No se encontraron nodos</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default UnifiedNodesDashboard;
