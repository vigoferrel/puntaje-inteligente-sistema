/* eslint-disable react-refresh/only-export-components */
import React, { useState, useCallback, useEffect } from 'react';
import { useSupabase } from '../../hooks/useSupabaseClient';
import { TLearningNode } from '../../types/system-types';
import { TLearningCyclePhase } from '../../types/learning-cycle-types';
import { TPAESPrueba, TPAESHabilidad } from '../../types/paes-types';
import { Database } from '../../integrations/supabase/types';

// Definir el tipo para una fila de la tabla bloom_learning_sessions
type BloomLearningSessionRow = Database['public']['Tables']['bloom_learning_sessions']['Row'];

// Componente corregido sin loops infinitos
export const QuantumRafaelLandingPageFixed: React.FC = () => {
 const [state, setState] = useState({
   isActive: true,
   progress: 42.9,
   capas: '1/7',
   entrelazamientos: 0,
   estado: 'good'
 });

 // Funciones memoizadas para evitar re-renders
 const handleStateUpdate = useCallback((newState: Partial<typeof state>) => {
   setState(prev => ({ ...prev, ...newState }));
 }, []);

 // Datos memoizados
 const supabase = useSupabase(); // Obtener el cliente Supabase
 // Eliminar el tipo 'Node' ya que usaremos el tipo de Supabase
 const [nodos, setNodos] = useState<TLearningNode[]>([]); // Usar TLearningNode del sistema

 useEffect(() => {
   const fetchNodes = async () => {
     try {
       const { data, error } = await supabase
         .from('bloom_learning_sessions') // Corregido: usar bloom_learning_sessions que existe en la BD
         .select('*'); // Seleccionar todo para depuración inicial

       if (error) {
         console.error('Error cargando nodos desde Supabase:', error);
         setNodos([]);
       } else {
         // Mapeo inicial a TLearningNode. Esto requerirá revisión manual.
        const mappedNodes: TLearningNode[] = data.map((item: BloomLearningSessionRow) => ({
          id: item.id || '',
          title: item.activity_id || `Nodo ${item.id.slice(0, 8)}`, // Usamos activity_id como title si no hay current_node
          description: `Sesión de ${item.subject || 'N/A'} - Activity: ${item.activity_id || 'N/A'}`,
          content: {
            theory: 'Contenido teórico simulado.',
            examples: [],
            exerciseCount: 5
          },
          phase: 'DIAGNOSIS' as TLearningCyclePhase,
          skill: 'SOLVE_PROBLEMS' as TPAESHabilidad,
          prueba: (item.subject || 'MATEMATICA_1') as TPAESPrueba,
          // 'performance' no tiene un equivalente directo, usar 0 o una lógica de score si aplica
          bloomLevel: (item.completed ? 'APPLY' : 'REMEMBER') as 'REMEMBER' | 'UNDERSTAND' | 'APPLY' | 'ANALYZE' | 'EVALUATE' | 'CREATE',
          estimatedTime: 30, // Valor fijo o alguna lógica si no hay un estimado
          estimatedTimeMinutes: 30,
          difficulty: String(item.score ? Math.round(item.score / 10) : 'medium'), // Asumimos score ligado a dificultad
          prerequisites: [],
          dependsOn: [],
          learningObjectives: [],
          tags: [],
          resources: [],
          createdAt: item.session_start ?? undefined, // Convertir null a undefined si es necesario
          updatedAt: item.session_start ?? undefined, // Convertir null a undefined si es necesario
          position: 1,
          cognitive_level: 'APPLY',
          cognitiveLevel: 'APPLY',
          subject_area: item.subject,
          subjectArea: item.subject,
          code: item.activity_id || '' , // Aseguramos que 'code' sea siempre un string
          skillId: 1,
          testId: 1,
          tierPriority: 'tier2_importante',
          domainCategory: 'general',
          baseWeight: 1.0,
          difficultyMultiplier: 1.0,
          frequencyBonus: 0,
          prerequisiteWeight: 0,
          adaptiveAdjustment: 0,
          bloomComplexityScore: 0,
          paesFrequency: 0,
          total_exercises: 10,
          completed_exercises: item.completed ? 10 : 0,
          name: item.activity_id || `Nodo ${item.id.slice(0, 8)}`,
          subject: item.subject,
        }));
         setNodos(mappedNodes);
       }
     } catch (err) {
       console.error('Error general en fetchNodes:', err);
       setNodos([]);
     }
   };
   fetchNodes();
 }, [supabase]);

 return (
   <div className="quantum-rafael-container">
     <div className="quantum-header">
       <h1>&#129504; Quantum Context7</h1>
       <p>Rafael Design &#x2022; Estrella Cuántica de Entrada</p>
     </div>

     <div className="context-status">
       <div className="status-item">
         <span>Context760.0</span>
       </div>
       <div className="status-item">
         <span>Capas: {state.capas}</span>
       </div>
       <div className="status-item">
         <span>Estado: {state.estado}</span>
       </div>
       <div className="status-item">
         <span>Progreso: {state.progress}</span>
       </div>
     </div>

     <div className="quantum-actions">
       <div className="action-item active">
         <span>ðŸŸ¢ Context7 + Sequential Thinking</span>
       </div>
       <div className="action-item active">
         <span>ðŸŸ¢ Inicializar Rafael Design</span>
       </div>
       <div className="action-item active">
         <span>ðŸŸ¢ Cargar Dashboard Cuántico</span>
       </div>
       <div className="action-item active">
         <span>ðŸŸ¢ Optimizar para Móvil</span>
       </div>
       <div className="action-item active">
         <span>ðŸŸ¢ Activar Gran Colador</span>
       </div>
       <div className="action-item active">
         <span>ðŸŸ¢ Riñón Cuántico Activo</span>
       </div>
     </div>

     <div className="quantum-footer">
       <p>⚡ Rafael Design • Gran Colador Cuántico Activo</p>
     </div>
   </div>
 );
};

