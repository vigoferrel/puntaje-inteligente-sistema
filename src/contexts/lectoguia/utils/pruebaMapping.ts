
import { TPAESPrueba } from '@/types/system-types';

/**
 * Bidirectional mapping utilities for prueba and testId
 */
export class PruebaMappingUtil {
  // Mapping from prueba to testId
  static readonly pruebaToTestIdMap: Record<TPAESPrueba, number> = {
    'COMPETENCIA_LECTORA': 1,
    'MATEMATICA_1': 2,
    'MATEMATICA_2': 3,
    'CIENCIAS': 4,
    'HISTORIA': 5
  };

  // Mapping from testId to prueba
  static readonly testIdToPruebaMap: Record<number, TPAESPrueba> = {
    1: 'COMPETENCIA_LECTORA',
    2: 'MATEMATICA_1',
    3: 'MATEMATICA_2',
    4: 'CIENCIAS',
    5: 'HISTORIA'
  };

  /**
   * Get testId from prueba
   */
  static getTestIdFromPrueba(prueba: TPAESPrueba): number {
    return this.pruebaToTestIdMap[prueba];
  }

  /**
   * Get prueba from testId
   */
  static getPruebaFromTestId(testId: number): TPAESPrueba | undefined {
    return this.testIdToPruebaMap[testId];
  }

  /**
   * Log coherence statistics for nodes
   */
  static logCoherenceStats(nodes: any[]) {
    const coherenceByTest = nodes.reduce((acc, node) => {
      const key = `Test ${node.testId}`;
      if (!acc[key]) acc[key] = { total: 0, coherent: 0 };
      acc[key].total++;
      
      const expectedSubjectArea = this.testIdToPruebaMap[node.testId];
      
      if (node.subject_area === expectedSubjectArea && node.prueba === expectedSubjectArea) {
        acc[key].coherent++;
      }
      
      return acc;
    }, {} as Record<string, { total: number; coherent: number }>);

    console.log('🎯 Coherencia por test_id:', coherenceByTest);
    
    const nodesByPrueba = nodes.reduce((acc, node) => {
      const key = `${node.prueba} (${node.subject_area})`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    console.log('📈 Distribución final de nodos por prueba:', nodesByPrueba);
  }
}
