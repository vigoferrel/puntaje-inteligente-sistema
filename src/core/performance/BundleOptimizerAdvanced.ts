
import { useState, useEffect } from 'react';

// Configuración avanzada de code splitting

export const ChunkStrategy = {
  // Vendor chunks por categoría
  vendor: {
    react: ['react', 'react-dom', 'react-router-dom'],
    ui: ['@radix-ui', 'framer-motion', 'lucide-react'],
    query: ['@tanstack/react-query'],
    three: ['three', '@react-three/fiber', '@react-three/drei'],
    supabase: ['@supabase/supabase-js'],
    utils: ['clsx', 'class-variance-authority', 'tailwind-merge']
  },
  
  // Feature chunks
  features: {
    dashboard: ['src/components/dashboard/**'],
    lectoguia: ['src/components/lectoguia/**'],
    neural: ['src/components/neural-command/**'],
    calendar: ['src/components/calendar/**'],
    financial: ['src/components/financial/**'],
    auth: ['src/components/auth/**', 'src/contexts/AuthContext.tsx']
  },
  
  // Core chunks
  core: {
    performance: ['src/core/performance/**'],
    providers: ['src/providers/**', 'src/contexts/**'],
    hooks: ['src/hooks/**'],
    utils: ['src/lib/**', 'src/utils/**']
  }
};

// Configuración de Vite para chunks optimizados
export const getViteBuildConfig = () => ({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id: string) => {
          // Vendor chunks
          for (const [name, libs] of Object.entries(ChunkStrategy.vendor)) {
            if (libs.some(lib => id.includes(`node_modules/${lib}`))) {
              return `vendor-${name}`;
            }
          }
          
          // Feature chunks
          for (const [name, patterns] of Object.entries(ChunkStrategy.features)) {
            if (patterns.some(pattern => 
              id.includes(pattern.replace('**', '').replace('*', ''))
            )) {
              return `feature-${name}`;
            }
          }
          
          // Core chunks
          for (const [name, patterns] of Object.entries(ChunkStrategy.core)) {
            if (patterns.some(pattern => 
              id.includes(pattern.replace('**', '').replace('*', ''))
            )) {
              return `core-${name}`;
            }
          }
          
          // Default vendor chunk para otras dependencias
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        },
        
        // Optimización de nombres de chunks
        chunkFileNames: (chunkInfo: any) => {
          const name = chunkInfo.name || 'chunk';
          return `assets/${name}-[hash].js`;
        },
        
        // Optimización de assets
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Configuración de chunk sizes
    chunkSizeWarningLimit: 500,
    
    // Optimizaciones adicionales
    target: 'esnext',
    minify: 'terser' as const,
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info']
      }
    }
  }
});

// Sistema de métricas de bundle
export class BundleMetrics {
  private static metrics = new Map<string, number>();
  
  static recordChunkLoad(chunkName: string, loadTime: number) {
    this.metrics.set(chunkName, loadTime);
    console.log(`📦 Chunk loaded: ${chunkName} in ${loadTime}ms`);
  }
  
  static getMetrics() {
    return {
      chunks: Object.fromEntries(this.metrics),
      averageLoadTime: Array.from(this.metrics.values())
        .reduce((sum, time) => sum + time, 0) / this.metrics.size,
      totalChunks: this.metrics.size
    };
  }
}

// Hook para monitorear performance de chunks
export const useChunkPerformance = () => {
  const [metrics, setMetrics] = useState<any>({});
  
  useEffect(() => {
    const updateMetrics = () => {
      setMetrics(BundleMetrics.getMetrics());
    };
    
    const interval = setInterval(updateMetrics, 5000);
    updateMetrics();
    
    return () => clearInterval(interval);
  }, []);
  
  return metrics;
};
