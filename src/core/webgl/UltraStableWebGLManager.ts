
/**
 * ULTRA STABLE WEBGL MANAGER v1.0
 * Sistema de gestión WebGL con máxima estabilidad
 */

interface WebGLContextInfo {
  id: string;
  timestamp: number;
  priority: 'critical' | 'high' | 'medium' | 'low';
  isActive: boolean;
  element?: HTMLElement;
}

interface WebGLLimits {
  maxContexts: number;
  maxConcurrent: number;
  queueSize: number;
  timeoutMs: number;
}

class UltraStableWebGLManager {
  private static instance: UltraStableWebGLManager;
  private activeContexts = new Map<string, WebGLContextInfo>();
  private contextQueue: Array<{
    id: string;
    priority: WebGLContextInfo['priority'];
    resolve: (granted: boolean) => void;
    timestamp: number;
  }> = [];
  
  private limits: WebGLLimits;
  private deviceCapabilities: any;
  private emergencyMode = false;
  private cleanupInterval?: NodeJS.Timeout;

  static getInstance(): UltraStableWebGLManager {
    if (!UltraStableWebGLManager.instance) {
      UltraStableWebGLManager.instance = new UltraStableWebGLManager();
    }
    return UltraStableWebGLManager.instance;
  }

  private constructor() {
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.limits = this.calculateLimits();
    this.startPeriodicCleanup();
    this.monitorMemoryUsage();
  }

  private detectDeviceCapabilities() {
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const hardwareConcurrency = navigator.hardwareConcurrency || 2;
    const memory = (navigator as any).deviceMemory || 4;
    
    return {
      isMobile,
      isLowEnd: isMobile || hardwareConcurrency <= 2 || memory <= 2,
      hardwareConcurrency,
      memory,
      supportsWebGL2: this.testWebGL2Support()
    };
  }

  private testWebGL2Support(): boolean {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2');
      canvas.remove();
      return !!gl;
    } catch {
      return false;
    }
  }

  private calculateLimits(): WebGLLimits {
    const base = {
      maxContexts: 2,
      maxConcurrent: 1,
      queueSize: 5,
      timeoutMs: 30000
    };

    if (this.deviceCapabilities.isLowEnd) {
      return {
        maxContexts: 1,
        maxConcurrent: 1,
        queueSize: 3,
        timeoutMs: 15000
      };
    }

    if (this.deviceCapabilities.isMobile) {
      return {
        maxContexts: 2,
        maxConcurrent: 1,
        queueSize: 4,
        timeoutMs: 20000
      };
    }

    // Desktop con buenas capacidades
    return {
      maxContexts: 3,
      maxConcurrent: 2,
      queueSize: 8,
      timeoutMs: 45000
    };
  }

  private startPeriodicCleanup(): void {
    this.cleanupInterval = setInterval(() => {
      this.cleanupOrphanedContexts();
      this.processQueue();
    }, 10000);
  }

  private monitorMemoryUsage(): void {
    if ('performance' in window && (performance as any).memory) {
      setInterval(() => {
        const memory = (performance as any).memory;
        const usage = memory.usedJSHeapSize / memory.totalJSHeapSize;
        
        if (usage > 0.9 && !this.emergencyMode) {
          this.activateEmergencyMode();
        } else if (usage < 0.7 && this.emergencyMode) {
          this.deactivateEmergencyMode();
        }
      }, 5000);
    }
  }

  private activateEmergencyMode(): void {
    this.emergencyMode = true;
    this.limits.maxContexts = 1;
    this.limits.maxConcurrent = 1;
    
    // Liberar contextos no críticos
    for (const [id, context] of this.activeContexts.entries()) {
      if (context.priority !== 'critical') {
        this.forceReleaseContext(id);
      }
    }
    
    console.warn('🚨 WebGL Emergency Mode: Memory usage critical');
  }

  private deactivateEmergencyMode(): void {
    this.emergencyMode = false;
    this.limits = this.calculateLimits();
    console.log('✅ WebGL Emergency Mode: Deactivated');
  }

  async requestContext(
    id: string, 
    priority: WebGLContextInfo['priority'] = 'medium'
  ): Promise<boolean> {
    // Si ya tiene contexto, renovar
    if (this.activeContexts.has(id)) {
      this.activeContexts.get(id)!.timestamp = Date.now();
      return true;
    }

    // Verificar límites
    if (this.activeContexts.size >= this.limits.maxContexts) {
      if (priority === 'critical') {
        this.evictLowestPriorityContext();
      } else {
        return this.queueRequest(id, priority);
      }
    }

    // Otorgar contexto inmediatamente
    return this.grantContext(id, priority);
  }

  private grantContext(id: string, priority: WebGLContextInfo['priority']): boolean {
    try {
      const contextInfo: WebGLContextInfo = {
        id,
        timestamp: Date.now(),
        priority,
        isActive: true,
        element: document.querySelector(`[data-webgl-component="${id}"]`) || undefined
      };

      this.activeContexts.set(id, contextInfo);
      return true;
    } catch (error) {
      console.error('Failed to grant WebGL context:', error);
      return false;
    }
  }

  private queueRequest(
    id: string, 
    priority: WebGLContextInfo['priority']
  ): Promise<boolean> {
    return new Promise((resolve) => {
      if (this.contextQueue.length >= this.limits.queueSize) {
        resolve(false);
        return;
      }

      this.contextQueue.push({
        id,
        priority,
        resolve,
        timestamp: Date.now()
      });

      // Ordenar queue por prioridad
      this.contextQueue.sort((a, b) => {
        const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });

      // Timeout para requests en queue
      setTimeout(() => {
        const index = this.contextQueue.findIndex(q => q.id === id);
        if (index !== -1) {
          this.contextQueue.splice(index, 1);
          resolve(false);
        }
      }, this.limits.timeoutMs);
    });
  }

  private evictLowestPriorityContext(): void {
    let lowestPriority: WebGLContextInfo | null = null;
    let lowestPriorityId: string | null = null;

    const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };

    for (const [id, context] of this.activeContexts.entries()) {
      if (!lowestPriority || 
          priorityOrder[context.priority] < priorityOrder[lowestPriority.priority]) {
        lowestPriority = context;
        lowestPriorityId = id;
      }
    }

    if (lowestPriorityId) {
      this.forceReleaseContext(lowestPriorityId);
    }
  }

  private processQueue(): void {
    while (this.contextQueue.length > 0 && 
           this.activeContexts.size < this.limits.maxContexts) {
      const request = this.contextQueue.shift()!;
      const granted = this.grantContext(request.id, request.priority);
      request.resolve(granted);
    }
  }

  releaseContext(id: string): void {
    this.activeContexts.delete(id);
    this.processQueue();
  }

  private forceReleaseContext(id: string): void {
    const context = this.activeContexts.get(id);
    if (context && context.element) {
      // Notificar al elemento que debe limpiar
      const event = new CustomEvent('webgl-context-revoked', { detail: { id } });
      context.element.dispatchEvent(event);
    }
    
    this.releaseContext(id);
  }

  private cleanupOrphanedContexts(): void {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutos

    for (const [id, context] of this.activeContexts.entries()) {
      // Verificar si el elemento aún existe
      const element = document.querySelector(`[data-webgl-component="${id}"]`);
      
      if (!element || (now - context.timestamp > maxAge && !context.isActive)) {
        this.releaseContext(id);
      }
    }
  }

  getStatus() {
    return {
      activeContexts: this.activeContexts.size,
      maxContexts: this.limits.maxContexts,
      queueLength: this.contextQueue.length,
      emergencyMode: this.emergencyMode,
      deviceCapabilities: this.deviceCapabilities,
      limits: this.limits
    };
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    
    this.activeContexts.clear();
    this.contextQueue.forEach(request => request.resolve(false));
    this.contextQueue = [];
  }
}

export const ultraStableWebGL = UltraStableWebGLManager.getInstance();
