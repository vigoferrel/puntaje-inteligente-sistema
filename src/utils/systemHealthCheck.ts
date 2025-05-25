
import { loadValidator } from '@/core/performance/LoadValidationSystem';

interface HealthCheckResult {
  overallHealth: 'excellent' | 'good' | 'warning' | 'critical';
  score: number;
  checks: {
    loadTime: boolean;
    errors: boolean;
    navigation: boolean;
    memory: boolean;
    responsiveness: boolean;
  };
  recommendations: string[];
}

export const runSystemHealthCheck = async (): Promise<HealthCheckResult> => {
  const report = loadValidator.getValidationReport();
  
  // Realizar checks individuales
  const checks = {
    loadTime: report.metrics.componentLoadTime < 2000,
    errors: report.metrics.errorCount === 0,
    navigation: report.metrics.navigationResponseTime < 300,
    memory: report.metrics.memoryUsage < 50 * 1024 * 1024, // 50MB
    responsiveness: report.metrics.renderCount < 50
  };

  // Calcular score
  const passedChecks = Object.values(checks).filter(Boolean).length;
  const score = (passedChecks / Object.keys(checks).length) * 100;

  // Determinar health overall
  let overallHealth: HealthCheckResult['overallHealth'];
  if (score >= 90) overallHealth = 'excellent';
  else if (score >= 75) overallHealth = 'good';
  else if (score >= 50) overallHealth = 'warning';
  else overallHealth = 'critical';

  // Generar recomendaciones
  const recommendations: string[] = [];
  
  if (!checks.loadTime) {
    recommendations.push('Optimizar tiempo de carga inicial');
  }
  if (!checks.errors) {
    recommendations.push('Resolver errores de JavaScript detectados');
  }
  if (!checks.navigation) {
    recommendations.push('Mejorar tiempo de respuesta de navegación');
  }
  if (!checks.memory) {
    recommendations.push('Optimizar uso de memoria');
  }
  if (!checks.responsiveness) {
    recommendations.push('Reducir re-renderizados innecesarios');
  }

  return {
    overallHealth,
    score,
    checks,
    recommendations
  };
};

// Auto-ejecutar health check cada 30 segundos
let healthCheckInterval: NodeJS.Timeout;

export const startHealthMonitoring = () => {
  healthCheckInterval = setInterval(async () => {
    const health = await runSystemHealthCheck();
    
    if (health.overallHealth === 'critical') {
      console.error('🔴 Sistema en estado crítico:', health);
    } else if (health.overallHealth === 'warning') {
      console.warn('🟡 Sistema requiere atención:', health);
    } else {
      console.log(`🟢 Sistema saludable (${health.score}%):`, health);
    }
  }, 30000);
};

export const stopHealthMonitoring = () => {
  if (healthCheckInterval) {
    clearInterval(healthCheckInterval);
  }
};
