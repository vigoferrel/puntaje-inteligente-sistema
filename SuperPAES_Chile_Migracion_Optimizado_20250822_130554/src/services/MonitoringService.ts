// ========================================
// SISTEMA DE MONITOREO INTEGRADO SUPERPAES
// ========================================
// Combina las mejores prácticas de:
// - PAES-MASTER: Logging rotativo y métricas cuánticas
// - PAES-AGENTE: Timestamp y métricas de IA
// - PAES-MVP: psutil y métricas de sistema
// - Puntaje Inteligente: Cache analysis y performance

export interface SystemMetrics {
  timestamp: string;
  cpu: {
    total_usage: number;
    cores: number[];
    temperature?: number;
  };
  memory: {
    total_mb: number;
    used_mb: number;
    available_mb: number;
    usage_percent: number;
  };
  disk: {
    total_gb: number;
    used_gb: number;
    free_gb: number;
    usage_percent: number;
  };
  network: {
    bytes_sent: number;
    bytes_received: number;
    connections_active: number;
  };
  processes: {
    total: number;
    node: number;
    python: number;
    npm: number;
  };
  database: {
    status: 'online' | 'offline' | 'error';
    response_time_ms: number;
    connections: number;
  };
  application: {
    uptime_minutes: number;
    requests_per_minute: number;
    error_rate: number;
    active_users: number;
  };
  quantum: {
    nodes_active: number;
    bloom_levels: number;
    coherence: number;
    entropy: number;
  };
  ai: {
    requests_processed: number;
    average_response_time: number;
    model_accuracy: number;
    token_usage: number;
  };
}

export interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS' | 'METRICS' | 'PROCESS';
  component: string;
  message: string;
  data?: any;
}

export interface Alert {
  id: string;
  timestamp: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  component: string;
  message: string;
  resolved: boolean;
  resolution_time?: string;
}

class MonitoringService {
  private static instance: MonitoringService;
  private metricsHistory: SystemMetrics[] = [];
  private logs: LogEntry[] = [];
  private alerts: Alert[] = [];
  private isMonitoring: boolean = false;
  private monitoringInterval?: NodeJS.Timeout;
  private maxHistorySize: number = 1000;
  private maxLogSize: number = 5000;

  // Configuración de umbrales
  private thresholds = {
    cpu: { warning: 70, critical: 90 },
    memory: { warning: 80, critical: 95 },
    disk: { warning: 85, critical: 95 },
    response_time: { warning: 2000, critical: 5000 },
    error_rate: { warning: 5, critical: 15 }
  };

  private constructor() {
    this.initializeMonitoring();
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  private initializeMonitoring(): void {
    this.log('INFO', 'MonitoringService', 'Sistema de monitoreo inicializado');
    this.startMonitoring();
  }

  public startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.monitoringInterval = setInterval(() => {
      this.collectMetrics();
    }, 30000); // Cada 30 segundos

    this.log('SUCCESS', 'MonitoringService', 'Monitoreo iniciado - intervalo: 30s');
  }

  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = undefined;
    }
    this.isMonitoring = false;
    this.log('INFO', 'MonitoringService', 'Monitoreo detenido');
  }

  private async collectMetrics(): Promise<void> {
    try {
      const metrics: SystemMetrics = {
        timestamp: new Date().toISOString(),
        cpu: await this.getCPUMetrics(),
        memory: await this.getMemoryMetrics(),
        disk: await this.getDiskMetrics(),
        network: await this.getNetworkMetrics(),
        processes: await this.getProcessMetrics(),
        database: await this.getDatabaseMetrics(),
        application: await this.getApplicationMetrics(),
        quantum: await this.getQuantumMetrics(),
        ai: await this.getAIMetrics()
      };

      this.metricsHistory.push(metrics);
      this.checkThresholds(metrics);
      this.cleanupHistory();

      this.log('METRICS', 'MonitoringService', 'Métricas recolectadas', metrics);
    } catch (error) {
      this.log('ERROR', 'MonitoringService', `Error recolectando métricas: ${error}`);
    }
  }

  private async getCPUMetrics(): Promise<SystemMetrics['cpu']> {
    // Simulación de métricas de CPU (en producción usaría psutil o similar)
    return {
      total_usage: Math.random() * 100,
      cores: Array.from({ length: 4 }, () => Math.random() * 100),
      temperature: 45 + Math.random() * 20
    };
  }

  private async getMemoryMetrics(): Promise<SystemMetrics['memory']> {
    // Simulación de métricas de memoria
    const total = 16384; // 16GB
    const used = total * (0.3 + Math.random() * 0.4); // 30-70% uso
    return {
      total_mb: total,
      used_mb: Math.round(used),
      available_mb: Math.round(total - used),
      usage_percent: Math.round((used / total) * 100)
    };
  }

  private async getDiskMetrics(): Promise<SystemMetrics['disk']> {
    // Simulación de métricas de disco
    const total = 1000; // 1TB
    const used = total * (0.4 + Math.random() * 0.3); // 40-70% uso
    return {
      total_gb: total,
      used_gb: Math.round(used),
      free_gb: Math.round(total - used),
      usage_percent: Math.round((used / total) * 100)
    };
  }

  private async getNetworkMetrics(): Promise<SystemMetrics['network']> {
    // Simulación de métricas de red
    return {
      bytes_sent: Math.random() * 1000000,
      bytes_received: Math.random() * 2000000,
      connections_active: Math.floor(Math.random() * 100)
    };
  }

  private async getProcessMetrics(): Promise<SystemMetrics['processes']> {
    // Simulación de métricas de procesos
    return {
      total: Math.floor(Math.random() * 200) + 100,
      node: Math.floor(Math.random() * 10) + 5,
      python: Math.floor(Math.random() * 5) + 2,
      npm: Math.floor(Math.random() * 3) + 1
    };
  }

  private async getDatabaseMetrics(): Promise<SystemMetrics['database']> {
    try {
      // En producción, verificaría la conexión real a Supabase
      const responseTime = Math.random() * 100 + 50; // 50-150ms
      return {
        status: 'online' as const,
        response_time_ms: Math.round(responseTime),
        connections: Math.floor(Math.random() * 20) + 5
      };
    } catch (error) {
      return {
        status: 'error' as const,
        response_time_ms: 0,
        connections: 0
      };
    }
  }

  private async getApplicationMetrics(): Promise<SystemMetrics['application']> {
    // Simulación de métricas de aplicación
    return {
      uptime_minutes: Math.floor(Math.random() * 1440) + 60, // 1-24 horas
      requests_per_minute: Math.floor(Math.random() * 100) + 10,
      error_rate: Math.random() * 5, // 0-5%
      active_users: Math.floor(Math.random() * 500) + 50
    };
  }

  private async getQuantumMetrics(): Promise<SystemMetrics['quantum']> {
    // Simulación de métricas cuánticas (PAES-MASTER)
    return {
      nodes_active: Math.floor(Math.random() * 200) + 100,
      bloom_levels: Math.floor(Math.random() * 6) + 1,
      coherence: Math.random() * 0.5 + 0.5, // 0.5-1.0
      entropy: Math.random() * 0.3 + 0.1 // 0.1-0.4
    };
  }

  private async getAIMetrics(): Promise<SystemMetrics['ai']> {
    // Simulación de métricas de IA (PAES-AGENTE)
    return {
      requests_processed: Math.floor(Math.random() * 1000) + 100,
      average_response_time: Math.random() * 2000 + 500, // 500-2500ms
      model_accuracy: Math.random() * 0.2 + 0.8, // 80-100%
      token_usage: Math.floor(Math.random() * 50000) + 10000
    };
  }

  private checkThresholds(metrics: SystemMetrics): void {
    // Verificar CPU
    if (metrics.cpu.total_usage > this.thresholds.cpu.critical) {
      this.createAlert('CRITICAL', 'CPU', `Uso crítico de CPU: ${metrics.cpu.total_usage.toFixed(1)}%`);
    } else if (metrics.cpu.total_usage > this.thresholds.cpu.warning) {
      this.createAlert('HIGH', 'CPU', `Alto uso de CPU: ${metrics.cpu.total_usage.toFixed(1)}%`);
    }

    // Verificar memoria
    if (metrics.memory.usage_percent > this.thresholds.memory.critical) {
      this.createAlert('CRITICAL', 'Memory', `Uso crítico de memoria: ${metrics.memory.usage_percent}%`);
    } else if (metrics.memory.usage_percent > this.thresholds.memory.warning) {
      this.createAlert('HIGH', 'Memory', `Alto uso de memoria: ${metrics.memory.usage_percent}%`);
    }

    // Verificar disco
    if (metrics.disk.usage_percent > this.thresholds.disk.critical) {
      this.createAlert('CRITICAL', 'Disk', `Uso crítico de disco: ${metrics.disk.usage_percent}%`);
    } else if (metrics.disk.usage_percent > this.thresholds.disk.warning) {
      this.createAlert('HIGH', 'Disk', `Alto uso de disco: ${metrics.disk.usage_percent}%`);
    }

    // Verificar base de datos
    if (metrics.database.status === 'error') {
      this.createAlert('CRITICAL', 'Database', 'Error de conexión a base de datos');
    } else if (metrics.database.response_time_ms > this.thresholds.response_time.critical) {
      this.createAlert('HIGH', 'Database', `Respuesta lenta de BD: ${metrics.database.response_time_ms}ms`);
    }

    // Verificar tasa de errores
    if (metrics.application.error_rate > this.thresholds.error_rate.critical) {
      this.createAlert('CRITICAL', 'Application', `Alta tasa de errores: ${metrics.application.error_rate.toFixed(1)}%`);
    } else if (metrics.application.error_rate > this.thresholds.error_rate.warning) {
      this.createAlert('MEDIUM', 'Application', `Tasa de errores elevada: ${metrics.application.error_rate.toFixed(1)}%`);
    }
  }

  private createAlert(level: Alert['level'], component: string, message: string): void {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      resolved: false
    };

    this.alerts.push(alert);
    this.log('WARN', 'MonitoringService', `Alerta creada: ${message}`, alert);
  }

  private cleanupHistory(): void {
    // Limpiar historial de métricas
    if (this.metricsHistory.length > this.maxHistorySize) {
      this.metricsHistory = this.metricsHistory.slice(-this.maxHistorySize);
    }

    // Limpiar logs
    if (this.logs.length > this.maxLogSize) {
      this.logs = this.logs.slice(-this.maxLogSize);
    }

    // Limpiar alertas resueltas (más de 24 horas)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.alerts = this.alerts.filter(alert => 
      !alert.resolved || new Date(alert.timestamp) > oneDayAgo
    );
  }

  public log(level: LogEntry['level'], component: string, message: string, data?: any): void {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      component,
      message,
      data
    };

    this.logs.push(logEntry);
    
    // En producción, también escribiría a archivo
    console.log(`[${logEntry.timestamp}] [${level}] [${component}] ${message}`);
  }

  // Métodos públicos para obtener datos
  public getCurrentMetrics(): SystemMetrics | null {
    return this.metricsHistory.length > 0 ? this.metricsHistory[this.metricsHistory.length - 1] : null;
  }

  public getMetricsHistory(limit: number = 100): SystemMetrics[] {
    return this.metricsHistory.slice(-limit);
  }

  public getLogs(level?: LogEntry['level'], limit: number = 100): LogEntry[] {
    let filteredLogs = this.logs;
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }
    return filteredLogs.slice(-limit);
  }

  public getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  public getAllAlerts(limit: number = 100): Alert[] {
    return this.alerts.slice(-limit);
  }

  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
      alert.resolution_time = new Date().toISOString();
      this.log('INFO', 'MonitoringService', `Alerta resuelta: ${alert.message}`);
      return true;
    }
    return false;
  }

  public getSystemStatus(): {
    status: 'healthy' | 'warning' | 'critical';
    components: Record<string, 'online' | 'warning' | 'offline'>;
    summary: string;
  } {
    const currentMetrics = this.getCurrentMetrics();
    const activeAlerts = this.getActiveAlerts();
    
    if (!currentMetrics) {
      return {
        status: 'critical',
        components: { monitoring: 'offline' },
        summary: 'Sistema de monitoreo no disponible'
      };
    }

    const criticalAlerts = activeAlerts.filter(a => a.level === 'CRITICAL');
    const highAlerts = activeAlerts.filter(a => a.level === 'HIGH');

    let status: 'healthy' | 'warning' | 'critical' = 'healthy';
    if (criticalAlerts.length > 0) {
      status = 'critical';
    } else if (highAlerts.length > 0) {
      status = 'warning';
    }

    const components = {
      cpu: currentMetrics.cpu.total_usage > this.thresholds.cpu.critical ? 'critical' : 
           currentMetrics.cpu.total_usage > this.thresholds.cpu.warning ? 'warning' : 'online',
      memory: currentMetrics.memory.usage_percent > this.thresholds.memory.critical ? 'critical' :
              currentMetrics.memory.usage_percent > this.thresholds.memory.warning ? 'warning' : 'online',
      disk: currentMetrics.disk.usage_percent > this.thresholds.disk.critical ? 'critical' :
            currentMetrics.disk.usage_percent > this.thresholds.disk.warning ? 'warning' : 'online',
      database: currentMetrics.database.status,
      quantum: 'online',
      ai: 'online'
    };

    const summary = `CPU: ${currentMetrics.cpu.total_usage.toFixed(1)}% | ` +
                   `Mem: ${currentMetrics.memory.usage_percent}% | ` +
                   `Disco: ${currentMetrics.disk.usage_percent}% | ` +
                   `BD: ${currentMetrics.database.status} | ` +
                   `Alertas: ${activeAlerts.length}`;

    return { status, components, summary };
  }

  public exportMetrics(): {
    metrics: SystemMetrics[];
    logs: LogEntry[];
    alerts: Alert[];
    status: any;
  } {
    return {
      metrics: this.metricsHistory,
      logs: this.logs,
      alerts: this.alerts,
      status: this.getSystemStatus()
    };
  }
}

// Exportar instancia singleton
export const monitoringService = MonitoringService.getInstance();
