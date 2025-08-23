
import { TLearningNode, TPAESPrueba } from '@/types/system-types';
import { validateNodesIntegrity } from '@/utils/node-validation';
import { toast } from '@/components/ui/use-toast';

/**
 * Optimized service for node validation and integrity checking
 */
export class NodeValidationService {
  private static validationCache = new Map<string, any>();
  private static lastValidationTime = 0;
  
  /**
   * Validate node integrity with caching and throttling
   */
  static validateNodeIntegrity(loadedNodes: TLearningNode[]) {
    // Generate cache key based on nodes length and first/last node IDs
    const cacheKey = `validation_${loadedNodes.length}_${loadedNodes[0]?.id}_${loadedNodes[loadedNodes.length - 1]?.id}`;
    const now = Date.now();
    
    // Use cache if validation was done recently (within 30 seconds)
    if (this.validationCache.has(cacheKey) && (now - this.lastValidationTime) < 30000) {
      console.log('🔍 Usando validación del caché (evitando duplicados)');
      return this.validationCache.get(cacheKey);
    }
    
    console.log('🔍 Ejecutando nueva validación integral de nodos...');
    
    const validation = validateNodesIntegrity(loadedNodes);
    
    // Use Set to count unique nodes with issues, not total issues
    const uniqueNodesWithIssues = new Set(validation.issues.map(issue => issue.nodeId));
    
    const validationStatus = {
      isValid: validation.isValid,
      issuesCount: uniqueNodesWithIssues.size, // Correct count of nodes with issues
      lastValidation: new Date()
    };

    // Detailed logging with improved accuracy
    console.group('📊 Resultados de Validación Integral');
    console.log(`Total de nodos: ${validation.summary.totalNodes}`);
    console.log(`Nodos válidos: ${validation.summary.validNodes}`);
    console.log(`Nodos con problemas: ${uniqueNodesWithIssues.size}`);
    console.log(`Total de problemas detectados: ${validation.summary.issuesCount}`);
    
    if (validation.summary.issuesCount > 0) {
      console.log('📋 Distribución de problemas por tipo:');
      Object.entries(validation.summary.issuesByType).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
      
      // Only show first 5 issues to avoid log spam
      console.log('🚨 Problemas detectados (primeros 5):');
      validation.issues.slice(0, 5).forEach((issue, index) => {
        console.log(`  ${index + 1}. [${issue.type}] ${issue.description}`);
        if (issue.suggestion) {
          console.log(`     💡 Sugerencia: ${issue.suggestion}`);
        }
      });
      
      if (validation.issues.length > 5) {
        console.log(`     ... y ${validation.issues.length - 5} problemas más.`);
      }
    }
    console.groupEnd();

    // User feedback with more accurate information
    if (uniqueNodesWithIssues.size === 0) {
      console.log('✅ Sistema validado: Todos los nodos son coherentes');
      toast({
        title: "Validación Exitosa",
        description: `Sistema completamente coherente: ${validation.summary.totalNodes} nodos validados correctamente.`,
      });
    } else {
      console.log(`🔧 Sistema detectó ${uniqueNodesWithIssues.size} nodos con problemas de ${validation.summary.totalNodes} total`);
      
      // Only show toast for significant issues
      if (uniqueNodesWithIssues.size > 10) {
        toast({
          title: "Problemas Detectados",
          description: `Se detectaron ${uniqueNodesWithIssues.size} nodos con problemas de ${validation.summary.totalNodes} total. Sistema aplicando correcciones automáticas.`,
          variant: "destructive"
        });
      }
    }

    const result = { validation, validationStatus };
    
    // Cache the result
    this.validationCache.set(cacheKey, result);
    this.lastValidationTime = now;
    
    // Clear old cache entries to prevent memory leaks
    if (this.validationCache.size > 5) {
      const oldestKey = Array.from(this.validationCache.keys())[0];
      this.validationCache.delete(oldestKey);
    }

    return result;
  }
  
  /**
   * Clear validation cache
   */
  static clearCache() {
    this.validationCache.clear();
    this.lastValidationTime = 0;
    console.log('🗑️ Caché de validación limpiado');
  }
}
