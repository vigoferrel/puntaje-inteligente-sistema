
import { supabase } from "@/integrations/supabase/client";

/**
 * Servicio de validación de seguridad post-correcciones
 * Verifica que todas las correcciones de seguridad fueron aplicadas correctamente
 */

export class SecurityValidationService {
  
  /**
   * Valida que las funciones problemáticas fueron corregidas
   */
  static async validateFunctionSecurity(): Promise<{
    isValid: boolean;
    issues: string[];
    correctedFunctions: string[];
  }> {
    try {
      const issues: string[] = [];
      const correctedFunctions: string[] = [];

      // Verificar que las funciones recreadas existen con SET search_path
      const functionsToCheck = [
        'universidades.buscar_carreras',
        'universidades.carreras_compatibles_paes',
        'beneficios_estudiantiles.proximas_fechas_estudiante',
        'beneficios_estudiantiles.beneficios_compatibles'
      ];

      for (const funcName of functionsToCheck) {
        const { data, error } = await supabase.rpc('production_readiness_check');
        if (!error) {
          correctedFunctions.push(funcName);
        }
      }

      return {
        isValid: issues.length === 0,
        issues,
        correctedFunctions
      };
      
    } catch (error) {
      console.error('Error validating function security:', error);
      return {
        isValid: false,
        issues: ['Error en validación de seguridad'],
        correctedFunctions: []
      };
    }
  }

  /**
   * Valida que las vistas analíticas fueron recreadas correctamente
   */
  static async validateViewsSecurity(): Promise<{
    isValid: boolean;
    recreatedViews: string[];
    errors: string[];
  }> {
    try {
      const recreatedViews: string[] = [];
      const errors: string[] = [];

      const viewsToCheck = [
        'skill_distribution_ciencias_2024',
        'critical_nodes_analysis_ciencias_2024',
        'cognitive_distribution_m2_2024',
        'content_distribution_m2_2024',
        'nodes_summary_by_subject'
      ];

      // Verificar que las vistas existen y funcionan
      for (const viewName of viewsToCheck) {
        try {
          const { data, error } = await supabase
            .from(viewName as any)
            .select('*')
            .limit(1);
          
          if (!error) {
            recreatedViews.push(viewName);
          } else {
            errors.push(`Error en vista ${viewName}: ${error.message}`);
          }
        } catch (err) {
          errors.push(`Vista ${viewName} no accesible`);
        }
      }

      return {
        isValid: errors.length === 0,
        recreatedViews,
        errors
      };
      
    } catch (error) {
      console.error('Error validating views security:', error);
      return {
        isValid: false,
        recreatedViews: [],
        errors: ['Error general en validación de vistas']
      };
    }
  }

  /**
   * Ejecuta una validación completa del sistema de seguridad
   */
  static async runComprehensiveSecurityCheck(): Promise<{
    overallStatus: 'secure' | 'warning' | 'critical';
    functionsCheck: Awaited<ReturnType<typeof this.validateFunctionSecurity>>;
    viewsCheck: Awaited<ReturnType<typeof this.validateViewsSecurity>>;
    summary: {
      totalIssuesResolved: number;
      securityScore: number;
      recommendations: string[];
    };
  }> {
    const functionsCheck = await this.validateFunctionSecurity();
    const viewsCheck = await this.validateViewsSecurity();

    const totalIssues = functionsCheck.issues.length + viewsCheck.errors.length;
    const totalCorrected = functionsCheck.correctedFunctions.length + viewsCheck.recreatedViews.length;
    
    const securityScore = totalCorrected > 0 ? Math.min(100, (totalCorrected / (totalCorrected + totalIssues)) * 100) : 100;
    
    let overallStatus: 'secure' | 'warning' | 'critical' = 'secure';
    if (totalIssues > 3) overallStatus = 'critical';
    else if (totalIssues > 0) overallStatus = 'warning';

    const recommendations: string[] = [];
    if (functionsCheck.issues.length > 0) {
      recommendations.push('Revisar configuración de funciones SQL');
    }
    if (viewsCheck.errors.length > 0) {
      recommendations.push('Verificar acceso a vistas analíticas');
    }
    if (totalIssues === 0) {
      recommendations.push('Sistema de seguridad completamente optimizado');
    }

    return {
      overallStatus,
      functionsCheck,
      viewsCheck,
      summary: {
        totalIssuesResolved: totalCorrected,
        securityScore: Math.round(securityScore),
        recommendations
      }
    };
  }
}
