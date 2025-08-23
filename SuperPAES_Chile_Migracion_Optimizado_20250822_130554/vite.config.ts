import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Configuración unificada y optimizada para todos los proyectos PAES
export default defineConfig(({ mode }) => ({
  // Configuración del servidor optimizada
  server: {
    host: true,
    port: parseInt(process.env.PORT || '3000', 10),
    hmr: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false
      }
    }
  },

  // Plugins optimizados
  plugins: [
    react(),
  ].filter(Boolean),

  // Resolución de alias centralizada
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './src/components'),
      '@/lib': path.resolve(__dirname, './src/lib'),
      '@/hooks': path.resolve(__dirname, './src/hooks'),
      '@/contexts': path.resolve(__dirname, './src/contexts'),
      '@/services': path.resolve(__dirname, './src/services'),
      '@/types': path.resolve(__dirname, './src/types'),
      '@/utils': path.resolve(__dirname, './src/utils'),
      '@/integrations': path.resolve(__dirname, './src/integrations')
    }
  },

  // Optimizaciones de dependencias
  optimizeDeps: {
    exclude: ['@vite/client', '@vite/env'],
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-tabs',
      '@radix-ui/react-toast',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-hover-card'
    ]
  },

  // Build optimizado
  build: {
    target: 'esnext',
    minify: mode === 'production' ? 'terser' : false,
    cssMinify: true,
    sourcemap: mode === 'development',
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,

    rollupOptions: {
      output: {
        manualChunks: {
          // Core chunks
          'widget-core': ['./src/widget-core/WidgetBootstrapper.ts'],
          'bloom-assessment': [
            './src/bloom-assessment/BloomLevelDetector.ts',
            './src/bloom-assessment/ProgressiveAssessment.ts'
          ],
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'ui-radix': [
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-radio-group',
            '@radix-ui/react-hover-card'
          ],
          'utils': ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge']
        }
      }
    },

    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        passes: 2
      },
      mangle: true,
      format: {
        comments: false
      }
    } : undefined
  },

  // Optimizaciones de esbuild
  esbuild: {
    target: 'esnext',
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
    platform: 'browser'
  },

  // Cache optimizado
  cacheDir: 'node_modules/.vite-quantum',

  // Variables de entorno
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
    'process.env.BUILD_TIME': JSON.stringify(new Date().toISOString())
  }
}));
