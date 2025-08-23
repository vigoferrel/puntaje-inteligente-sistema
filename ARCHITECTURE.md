# 🏗️ **Arquitectura del Sistema Puntaje Inteligente**

## 📋 **Vista General**

El Sistema Puntaje Inteligente está diseñado como una **arquitectura modular de microservicios frontend** con un backend centralizado en Supabase. La arquitectura sigue principios de **Clean Architecture**, **Domain-Driven Design** y **Micro-Frontend patterns**.

---

## 🔌 **Integración con Backend**

### **Supabase Architecture**

```typescript
// Database Layer
interface IRepository<T> {
  find(query: Query): Promise<T[]>;
  findById(id: string): Promise<T | null>;
  create(entity: Partial<T>): Promise<T>;
  update(id: string, updates: Partial<T>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Implementación específica
class LearningNodeRepository implements IRepository<LearningNode> {
  constructor(private supabase: SupabaseClient) {}
  
  async find(query: NodeQuery): Promise<LearningNode[]> {
    const { data, error } = await this.supabase
      .from('learning_nodes')
      .select('*')
      .eq('subject_area', query.subject)
      .order('position');
      
    if (error) throw new DatabaseError(error.message);
    return data.map(this.mapToEntity);
  }
  
  private mapToEntity(row: any): LearningNode {
    return {
      id: row.id,
      code: row.code,
      title: row.title,
      subjectArea: row.subject_area,
      tierPriority: row.tier_priority,
      // ... mapping logic
    };
  }
}
```

### **API Service Layer**

```typescript
// Unified API with intelligent caching
class UnifiedAPIService {
  private cache = new Map<string, CacheEntry>();
  private repositories: Map<string, IRepository<any>>;
  
  async fetchWithCache<T>(
    key: string, 
    fetcher: () => Promise<T>, 
    ttl: number = 300000
  ): Promise<T> {
    const cached = this.getCacheItem(key);
    if (cached && !this.isExpired(cached, ttl)) {
      return cached.data;
    }
    
    const data = await fetcher();
    this.setCacheItem(key, data);
    return data;
  }
  
  // Batch operations for performance
  async syncAllUserData(userId: string): Promise<UserData> {
    const [nodes, progress, plans, diagnostics] = await Promise.allSettled([
      this.fetchLearningNodes(),
      this.fetchUserProgress(userId),
      this.fetchStudyPlans(userId),
      this.fetchDiagnostics(userId)
    ]);
    
    return this.combineResults([nodes, progress, plans, diagnostics]);
  }
}
```

---

## 🎨 **Frontend Architecture Patterns**

### **Component Architecture**

```typescript
// Atomic Design Pattern
export interface ComponentHierarchy {
  // Atoms: Basic building blocks
  atoms: 'Button' | 'Input' | 'Badge' | 'Icon';
  
  // Molecules: Simple combinations
  molecules: 'SearchBar' | 'UserCard' | 'MetricCard';
  
  // Organisms: Complex components
  organisms: 'Header' | 'Sidebar' | 'Dashboard' | 'ExerciseView';
  
  // Templates: Page layouts
  templates: 'DashboardLayout' | 'AuthLayout' | 'FullscreenLayout';
  
  // Pages: Complete views
  pages: 'HomePage' | 'LectoGuiaPage' | 'DiagnosticPage';
}

// Compound Component Pattern
export const LectoGuia = {
  Root: LectoGuiaRoot,
  Header: LectoGuiaHeader,
  Chat: LectoGuiaChat,
  Exercise: LectoGuiaExercise,
  Progress: LectoGuiaProgress,
};

// Usage
<LectoGuia.Root>
  <LectoGuia.Header title="Competencia Lectora" />
  <LectoGuia.Chat />
  <LectoGuia.Exercise />
  <LectoGuia.Progress />
</LectoGuia.Root>
```

### **Hook Patterns**

```typescript
// Custom Hooks Architecture
interface HookArchitecture {
  // Data hooks
  data: 'useNodes' | 'useProgress' | 'useDiagnostics';
  
  // Logic hooks
  logic: 'useAuth' | 'useNeuralSystem' | 'useLectoGuia';
  
  // UI hooks
  ui: 'useTheme' | 'useBreakpoint' | 'useAnimation';
  
  // Integration hooks
  integration: 'useSupabase' | 'useStorage' | 'usePerformance';
}

// Ejemplo de hook complejo
export const useLectoGuia = (subject: Subject) => {
  const [state, dispatch] = useReducer(lectoguiaReducer, initialState);
  const { user } = useAuth();
  const storage = useStorage();
  
  // Optimized message sending with cost control
  const sendMessage = useCallback(async (message: string) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Try official content first (cost-free)
      const officialResponse = await tryOfficialContent(message, subject);
      if (officialResponse) {
        dispatch({ type: 'ADD_MESSAGE', payload: officialResponse });
        return;
      }
      
      // Fallback to AI with cost optimization
      const aiResponse = await aiService.generateResponse(message, {
        subject,
        costOptimization: true,
        maxTokens: 150
      });
      
      dispatch({ type: 'ADD_MESSAGE', payload: aiResponse });
      
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [subject, user?.id]);
  
  return {
    ...state,
    sendMessage,
    generateExercise: useCallback(() => generateOptimizedExercise(subject), [subject]),
    switchSubject: useCallback((newSubject) => dispatch({ 
      type: 'CHANGE_SUBJECT', 
      payload: newSubject 
    }), [])
  };
};
```

---

## 🔄 **Event-Driven Architecture**

### **Neural System Events**

```typescript
// Event Bus Pattern
interface EventBus {
  emit<T>(event: string, payload: T): void;
  on<T>(event: string, handler: (payload: T) => void): () => void;
  off(event: string, handler: Function): void;
}

// Neural Events
type NeuralEvent = 
  | { type: 'USER_ACTION'; payload: UserAction }
  | { type: 'PERFORMANCE_METRIC'; payload: PerformanceMetric }
  | { type: 'ERROR_OCCURRED'; payload: ErrorInfo }
  | { type: 'INSIGHT_GENERATED'; payload: Insight }
  | { type: 'PREDICTION_MADE'; payload: Prediction };

class NeuralEventBus implements EventBus {
  private listeners = new Map<string, Function[]>();
  
  emit<T>(event: string, payload: T): void {
    const handlers = this.listeners.get(event) || [];
    handlers.forEach(handler => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Error in event handler for ${event}:`, error);
      }
    });
  }
  
  // Auto-correlation of events for insights
  private correlateEvents(event: NeuralEvent): void {
    // ML algorithms to find patterns in user behavior
    // Generate insights from event correlations
    // Trigger adaptive system responses
  }
}
```

### **Cross-Module Communication**

```typescript
// Module Communication via Events
interface ModuleCommunication {
  // LectoGuía → Neural System
  'lectoguia:exercise_completed': ExerciseResult;
  'lectoguia:message_sent': MessageEvent;
  
  // Diagnostic → Progress Tracker
  'diagnostic:evaluation_completed': DiagnosticResult;
  'diagnostic:skill_assessed': SkillAssessment;
  
  // Neural → All Modules
  'neural:insight_generated': Insight;
  'neural:recommendation_made': Recommendation;
  
  // System → All Modules
  'system:performance_warning': PerformanceWarning;
  'system:error_occurred': SystemError;
}

// Usage in components
const MyComponent = () => {
  const eventBus = useEventBus();
  
  useEffect(() => {
    const unsubscribe = eventBus.on('neural:insight_generated', (insight) => {
      // Handle insight in component
      showInsightNotification(insight);
    });
    
    return unsubscribe;
  }, [eventBus]);
};
```

---

## 📊 **Performance Architecture**

### **Bundle Optimization Strategy**

```typescript
// Code Splitting Configuration
const bundleStrategy = {
  // Core chunks (loaded immediately)
  core: ['react', 'react-dom', 'react-router-dom'],
  
  // UI chunks (loaded on demand)
  ui: ['@radix-ui/*', 'lucide-react', 'framer-motion'],
  
  // Feature chunks (lazy loaded)
  features: {
    lectoguia: () => import('@/modules/lectoguia/LectoGuiaModule'),
    diagnostic: () => import('@/modules/diagnostic/DiagnosticModule'),
    financial: () => import('@/modules/financial/FinancialModule'),
    universe3d: () => import('@/modules/universe/Universe3DModule')
  },
  
  // Vendor chunks (cached separately)
  vendors: {
    supabase: ['@supabase/supabase-js'],
    three: ['three', '@react-three/fiber', '@react-three/drei'],
    charts: ['recharts', 'd3'],
    ai: ['@openai/api', 'langchain']
  }
};

// Vite configuration
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Vendor chunk strategy
            for (const [chunk, packages] of Object.entries(bundleStrategy.vendors)) {
              if (packages.some(pkg => id.includes(pkg))) {
                return `vendor-${chunk}`;
              }
            }
            return 'vendor-core';
          }
          
          // Feature chunk strategy
          for (const [feature, path] of Object.entries(bundleStrategy.features)) {
            if (id.includes(`/modules/${feature}/`)) {
              return `feature-${feature}`;
            }
          }
          
          return 'app';
        }
      }
    }
  }
});
```

### **Caching Strategy**

```typescript
// Multi-Level Caching Architecture
interface CacheLevel {
  L1: 'React State';      // Immediate access
  L2: 'Memory Cache';     // Session persistence
  L3: 'LocalStorage';     // Browser persistence
  L4: 'Supabase Cache';   // Server-side cache
}

class CacheOrchestrator {
  private l1Cache = new Map<string, any>();
  private l2Cache = new Map<string, CacheEntry>();
  
  async get<T>(key: string): Promise<T | null> {
    // L1: React State (fastest)
    if (this.l1Cache.has(key)) {
      return this.l1Cache.get(key);
    }
    
    // L2: Memory Cache
    const l2Entry = this.l2Cache.get(key);
    if (l2Entry && !this.isExpired(l2Entry)) {
      this.l1Cache.set(key, l2Entry.data);
      return l2Entry.data;
    }
    
    // L3: LocalStorage
    const l3Data = this.getFromLocalStorage(key);
    if (l3Data) {
      this.l2Cache.set(key, { data: l3Data, timestamp: Date.now() });
      this.l1Cache.set(key, l3Data);
      return l3Data;
    }
    
    return null;
  }
  
  async set<T>(key: string, value: T, options: CacheOptions = {}): Promise<void> {
    // Write to all levels
    this.l1Cache.set(key, value);
    this.l2Cache.set(key, { 
      data: value, 
      timestamp: Date.now(),
      ttl: options.ttl 
    });
    
    if (options.persistent) {
      this.setToLocalStorage(key, value);
    }
  }
}
```

---

## 🔒 **Security Architecture**

### **Authentication Flow**

```typescript
// Multi-Provider Authentication
interface AuthProvider {
  type: 'supabase' | 'oauth' | 'emergency';
  config: AuthConfig;
  fallback?: AuthProvider;
}

class AuthOrchestrator {
  private providers: AuthProvider[];
  private currentProvider: AuthProvider;
  
  async authenticate(credentials: Credentials): Promise<AuthResult> {
    for (const provider of this.providers) {
      try {
        const result = await this.tryProvider(provider, credentials);
        if (result.success) {
          this.currentProvider = provider;
          return result;
        }
      } catch (error) {
        console.warn(`Auth provider ${provider.type} failed:`, error);
        continue; // Try next provider
      }
    }
    
    // Fallback to emergency mode
    return this.activateEmergencyMode();
  }
  
  private async activateEmergencyMode(): Promise<AuthResult> {
    // Guest user with limited functionality
    return {
      success: true,
      user: {
        id: 'emergency-user',
        email: 'emergency@local',
        role: 'guest'
      },
      mode: 'emergency'
    };
  }
}
```

### **Data Validation Architecture**

```typescript
// Zod Schema Validation
const ValidationSchemas = {
  // User data
  User: z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string().min(2).max(100),
    role: z.enum(['student', 'teacher', 'admin'])
  }),
  
  // Learning progress
  Progress: z.object({
    node_id: z.string().uuid(),
    user_id: z.string().uuid(),
    mastery_level: z.number().min(0).max(1),
    completed_exercises: z.number().int().nonnegative(),
    last_activity: z.string().datetime()
  }),
  
  // API responses
  APIResponse: z.object({
    success: z.boolean(),
    data: z.any().optional(),
    error: z.string().optional(),
    timestamp: z.number()
  })
};

// Validation middleware
const validateData = <T>(schema: z.ZodSchema<T>) => 
  (data: unknown): T => {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw new ValidationError(result.error.issues);
    }
    return result.data;
  };
```

---

## 🚀 **Deployment Architecture**

### **Build Pipeline**

```yaml
# CI/CD Pipeline
name: Build and Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test:ci
      - run: npm run build
      
      # Performance budgets
      - name: Bundle Size Check
        run: npm run bundle-analyzer
      
      # Security audit
      - name: Security Audit
        run: npm audit --audit-level moderate

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to Production
        run: |
          npm run build:production
          npm run deploy:vercel
```

### **Environment Configuration**

```typescript
// Environment-specific configs
interface EnvironmentConfig {
  development: {
    api: {
      timeout: 10000;
      retries: 3;
      cache: true;
    };
    debug: {
      logging: 'verbose';
      performance: true;
      neural: true;
    };
    features: {
      devTools: true;
      mockData: true;
      hotReload: true;
    };
  };
  
  production: {
    api: {
      timeout: 5000;
      retries: 2;
      cache: true;
    };
    debug: {
      logging: 'error';
      performance: false;
      neural: false;
    };
    features: {
      devTools: false;
      mockData: false;
      analytics: true;
    };
  };
}

// Runtime config selection
const config = environments[process.env.NODE_ENV || 'development'];
```

---

## 📈 **Monitoring Architecture**

### **Real-time Metrics**

```typescript
// Metrics Collection System
interface MetricsCollector {
  // Performance metrics
  recordPageLoad(page: string, time: number): void;
  recordAPICall(endpoint: string, duration: number, status: number): void;
  recordError(error: Error, context: ErrorContext): void;
  
  // User behavior metrics
  recordUserAction(action: UserAction): void;
  recordFeatureUsage(feature: string, duration: number): void;
  
  // Business metrics
  recordExerciseCompletion(exercise: Exercise, score: number): void;
  recordDiagnosticResult(result: DiagnosticResult): void;
}

class ProductionMetricsCollector implements MetricsCollector {
  private eventQueue: MetricEvent[] = [];
  private batchSize = 50;
  private flushInterval = 30000; // 30 seconds
  
  constructor() {
    // Auto-flush metrics
    setInterval(() => this.flush(), this.flushInterval);
    
    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
  }
  
  recordPageLoad(page: string, time: number): void {
    this.enqueue({
      type: 'page_load',
      page,
      duration: time,
      timestamp: Date.now(),
      session: this.getSessionId()
    });
  }
  
  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;
    
    const events = this.eventQueue.splice(0, this.batchSize);
    
    try {
      await fetch('/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events })
      });
    } catch (error) {
      // Re-queue events on failure
      this.eventQueue.unshift(...events);
      console.warn('Failed to send metrics:', error);
    }
  }
}
```

### **Health Monitoring**

```typescript
// System Health Dashboard
interface HealthCheck {
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  responseTime: number;
  lastCheck: Date;
  details?: Record<string, any>;
}

class HealthMonitor {
  private checks: Map<string, HealthCheck> = new Map();
  private checkInterval = 60000; // 1 minute
  
  registerCheck(name: string, checkFn: () => Promise<HealthCheck>): void {
    const runCheck = async () => {
      try {
        const result = await checkFn();
        this.checks.set(name, result);
      } catch (error) {
        this.checks.set(name, {
          name,
          status: 'critical',
          responseTime: -1,
          lastCheck: new Date(),
          details: { error: error.message }
        });
      }
    };
    
    // Run immediately and then on interval
    runCheck();
    setInterval(runCheck, this.checkInterval);
  }
  
  getSystemHealth(): SystemHealth {
    const checks = Array.from(this.checks.values());
    const criticalCount = checks.filter(c => c.status === 'critical').length;
    const warningCount = checks.filter(c => c.status === 'warning').length;
    
    return {
      overall: criticalCount > 0 ? 'critical' : warningCount > 0 ? 'warning' : 'healthy',
      checks,
      lastUpdate: new Date()
    };
  }
}

// Health checks registration
const monitor = new HealthMonitor();

monitor.registerCheck('database', async () => ({
  name: 'database',
  status: await checkDatabaseConnection() ? 'healthy' : 'critical',
  responseTime: await measureDatabaseLatency(),
  lastCheck: new Date()
}));

monitor.registerCheck('storage', async () => ({
  name: 'storage',
  status: unifiedStorageSystem.getStatus().isReady ? 'healthy' : 'warning',
  responseTime: 1,
  lastCheck: new Date(),
  details: unifiedStorageSystem.getPerformanceMetrics()
}));
```

---

## 🔄 **Migration & Versioning Strategy**

### **Database Migrations**

```sql
-- Migration versioning
CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(255) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT NOW(),
  description TEXT
);

-- Example migration: Add neural metrics table
-- Version: 2025_01_15_001_add_neural_metrics
CREATE TABLE neural_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id),
  metric_type VARCHAR(50) NOT NULL,
  value DECIMAL(10,4) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert migration record
INSERT INTO schema_migrations (version, description)
VALUES ('2025_01_15_001_add_neural_metrics', 'Add neural metrics tracking table');
```

### **Feature Flags**

```typescript
// Feature flag system
interface FeatureFlag {
  name: string;
  enabled: boolean;
  conditions?: FeatureCondition[];
  rolloutPercentage?: number;
}

class FeatureFlagManager {
  private flags: Map<string, FeatureFlag> = new Map();
  
  async loadFlags(userId: string): Promise<void> {
    const flags = await this.fetchUserFlags(userId);
    flags.forEach(flag => this.flags.set(flag.name, flag));
  }
  
  isEnabled(flagName: string, context: FeatureContext = {}): boolean {
    const flag = this.flags.get(flagName);
    if (!flag) return false;
    
    // Check conditions
    if (flag.conditions) {
      const conditionsMet = flag.conditions.every(condition => 
        this.evaluateCondition(condition, context)
      );
      if (!conditionsMet) return false;
    }
    
    // Check rollout percentage
    if (flag.rolloutPercentage !== undefined) {
      const userHash = this.hashUserId(context.userId);
      const userPercentage = userHash % 100;
      if (userPercentage >= flag.rolloutPercentage) return false;
    }
    
    return flag.enabled;
  }
}

// Usage in components
const MyComponent = () => {
  const featureFlags = useFeatureFlags();
  
  return (
    <div>
      {featureFlags.isEnabled('neural_insights_v2') && (
        <AdvancedNeuralInsights />
      )}
      
      {featureFlags.isEnabled('3d_universe_beta', { userTier: 'premium' }) && (
        <Universe3DViewer />
      )}
    </div>
  );
};
```

---

## 📋 **Architecture Decision Records (ADR)**

### **ADR-001: Frontend Framework Selection**

**Status**: ✅ Accepted  
**Date**: 2024-08-15

**Context**: Need to select a frontend framework for the PAES preparation platform.

**Decision**: Use React 18 with TypeScript

**Rationale**:
- Large ecosystem and community support
- TypeScript provides type safety for complex educational domain
- Hooks provide excellent state management patterns
- React 18 concurrent features improve performance
- shadcn/ui provides consistent design system

**Consequences**:
- Positive: Fast development, great DX, extensive libraries
- Negative: Bundle size considerations, learning curve for team

### **ADR-002: State Management Strategy**

**Status**: ✅ Accepted  
**Date**: 2024-08-20

**Decision**: Hybrid approach using Zustand + React Context

**Rationale**:
- Zustand for global, persistent state
- React Context for feature-specific state
- Avoids prop drilling while maintaining performance
- Easy testing and debugging

### **ADR-003: Backend Architecture**

**Status**: ✅ Accepted  
**Date**: 2024-08-25

**Decision**: Supabase as Backend-as-a-Service

**Rationale**:
- PostgreSQL with real-time capabilities
- Built-in authentication and row-level security
- Edge Functions for custom logic
- Rapid development and deployment
- Cost-effective for startup phase

---

*Documentación de arquitectura actualizada: Agosto 2025*
