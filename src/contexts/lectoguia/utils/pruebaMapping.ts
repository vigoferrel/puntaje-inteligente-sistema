
import { TPAESPrueba } from '@/types/system-types';

/**
 * Utilidades de mapeo bidireccional para prueba y testId - ACTUALIZADO POST-MIGRACIÓN
 */
export class PruebaMappingUtil {
  // Mapeo de prueba a testId CORREGIDO
  static readonly pruebaToTestIdMap: Record<TPAESPrueba, number> = {
    'COMPETENCIA_LECTORA': 1,
    'MATEMATICA_1': 2,
    'MATEMATICA_2': 3,
    'HISTORIA': 4, // CORREGIDO
    'CIENCIAS': 5  // CORREGIDO
  };

  // Mapeo de testId a prueba CORREGIDO
  static readonly testIdToPruebaMap: Record<number, TPAESPrueba> = {
    1: 'COMPETENCIA_LECTORA',
    2: 'MATEMATICA_1',
    3: 'MATEMATICA_2',
    4: 'HISTORIA', // CORREGIDO
    5: 'CIENCIAS'  // CORREGIDO
  };

  /**
   * Get testId from prueba
   */
  static getTestIdFromPrueba(prueba: TPAESPrueba): number {
    const testId = this.pruebaToTestIdMap[prueba];
    if (!testId) {
      console.warn(`⚠️ No se encontró testId para prueba: ${prueba}`);
      return 1; // Fallback
    }
    return testId;
  }

  /**
   * Get prueba from testId
   */
  static getPruebaFromTestId(testId: number): TPAESPrueba | undefined {
    const prueba = this.testIdToPruebaMap[testId];
    if (!prueba) {
      console.warn(`⚠️ No se encontró prueba para testId: ${testId}`);
    }
    return prueba;
  }

  /**
   * Verificar si un mapeo es válido
   */
  static isValidMapping(prueba: TPAESPrueba, testId: number): boolean {
    return this.pruebaToTestIdMap[prueba] === testId;
  }

  /**
   * Log coherence statistics for nodes con mapeo actualizado
   */
  static logCoherenceStats(nodes: any[]) {
    console.group('🎯 Estadísticas de coherencia POST-MIGRACIÓN');
    
    const coherenceByTest = nodes.reduce((acc, node) => {
      const key = `Test ${node.testId}`;
      if (!acc[key]) acc[key] = { total: 0, coherent: 0, prueba: this.testIdToPruebaMap[node.testId] };
      acc[key].total++;
      
      const expectedSubjectArea = this.testIdToPruebaMap[node.testId];
      
      if (node.subject_area === expectedSubjectArea && node.prueba === expectedSubjectArea) {
        acc[key].coherent++;
      }
      
      return acc;
    }, {} as Record<string, { total: number; coherent: number; prueba?: string }>);

    console.log('📊 Coherencia por test_id:', coherenceByTest);
    
    const nodesByPrueba = nodes.reduce((acc, node) => {
      const key = `${node.prueba} (${node.subject_area})`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📈 Distribución final de nodos por prueba:', nodesByPrueba);
    
    // Verificar mapeos incorrectos
    const incorrectMappings = nodes.filter(node => {
      const expectedTestId = this.pruebaToTestIdMap[node.prueba as TPAESPrueba];
      return expectedTestId !== node.testId;
    });
    
    if (incorrectMappings.length > 0) {
      console.warn(`⚠️ ${incorrectMappings.length} nodos con mapeos incorrectos:`, 
        incorrectMappings.map(n => ({ 
          title: n.title, 
          prueba: n.prueba, 
          testId: n.testId, 
          expectedTestId: this.pruebaToTestIdMap[n.prueba as TPAESPrueba] 
        }))
      );
    } else {
      console.log('✅ Todos los mapeos de prueba-testId son coherentes');
    }
    
    console.groupEnd();
  }
}
