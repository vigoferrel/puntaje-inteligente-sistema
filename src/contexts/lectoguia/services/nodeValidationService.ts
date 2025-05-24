
import { TLearningNode, TPAESPrueba } from '@/types/system-types';
import { validateNodesIntegrity } from '@/utils/node-validation';
import { toast } from '@/components/ui/use-toast';

/**
 * Service for node validation and integrity checking
 */
export class NodeValidationService {
  /**
   * Validate node integrity with detailed logging and user feedback
   */
  static validateNodeIntegrity(loadedNodes: TLearningNode[]) {
    console.log('🔍 Iniciando validación integral de nodos...');
    
    const validation = validateNodesIntegrity(loadedNodes);
    
    const validationStatus = {
      isValid: validation.isValid,
      issuesCount: validation.issues.length,
      lastValidation: new Date()
    };

    // Detailed logging
    console.group('📊 Resultados de Validación Integral');
    console.log(`Total de nodos: ${validation.summary.totalNodes}`);
    console.log(`Nodos válidos: ${validation.summary.validNodes}`);
    console.log(`Problemas encontrados: ${validation.summary.issuesCount}`);
    
    if (validation.summary.issuesCount > 0) {
      console.log('📋 Distribución de problemas por tipo:');
      Object.entries(validation.summary.issuesByType).forEach(([type, count]) => {
        console.log(`  - ${type}: ${count}`);
      });
      
      console.log('🚨 Problemas detectados:');
      validation.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. [${issue.type}] ${issue.description}`);
        if (issue.suggestion) {
          console.log(`     💡 Sugerencia: ${issue.suggestion}`);
        }
      });
    }
    console.groupEnd();

    // User feedback
    if (!validation.isValid) {
      console.log('🔧 Sistema aplicó correcciones automáticas donde fue posible');
      
      toast({
        title: validation.summary.issuesCount === 0 ? "Validación Exitosa" : "Problemas Detectados",
        description: validation.summary.issuesCount === 0 
          ? `Sistema completamente coherente: ${validation.summary.totalNodes} nodos validados correctamente.`
          : `Se detectaron ${validation.summary.issuesCount} problemas en ${validation.summary.totalNodes - validation.summary.validNodes} nodos. Revisa la consola para detalles.`,
        variant: validation.summary.issuesCount === 0 ? "default" : "destructive"
      });
    } else {
      console.log('✅ Sistema validado: Todos los nodos son coherentes');
      toast({
        title: "Validación Exitosa",
        description: `Sistema completamente coherente: ${validation.summary.totalNodes} nodos validados correctamente.`,
      });
    }

    return { validation, validationStatus };
  }
}
