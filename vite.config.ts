
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      mode === 'development' &&
      componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    
    // Configuración ULTRA-SILENCIOSA para Lovable v2024.2
    build: {
      target: 'esnext',
      sourcemap: mode === 'development',
      minify: mode === 'production' ? 'terser' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            motion: ['framer-motion'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', 'lucide-react'],
            supabase: ['@supabase/supabase-js'],
            query: ['@tanstack/react-query']
          }
        },
        // SUPRESIÓN TOTAL DE WARNINGS
        onwarn() {
          // No mostrar NINGÚN warning durante el build
          return;
        }
      },
      chunkSizeWarningLimit: 10000, // Eliminar warnings de tamaño
      // Suprimir TODOS los logs de terser
      terserOptions: {
        compress: {
          drop_console: mode === 'production',
          drop_debugger: mode === 'production'
        },
        mangle: {
          safari10: true
        }
      }
    },
    
    // Optimizaciones ultra-silenciosas
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        '@tanstack/react-query',
        'lucide-react',
        '@radix-ui/react-dialog',
        '@radix-ui/react-select',
        '@supabase/supabase-js'
      ],
      exclude: ['lovable-tagger']
    },

    // Configuración ultra-optimizada
    define: {
      __DEV__: mode === 'development',
      __LOVABLE_VERSION__: JSON.stringify('2024.2'),
      global: 'globalThis'
    },
    
    // Manejo silencioso de assets
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
    
    // Configuración de preview ultra-silenciosa
    preview: {
      port: 8080,
      host: "::",
      strictPort: true
    },

    // NIVEL DE LOG ULTRA-MÍNIMO - Solo errores críticos
    logLevel: 'error',
    
    // Configuración ESBuild ultra-silenciosa
    esbuild: {
      logLevel: 'silent',
      logOverride: { 
        'this-is-undefined-in-esm': 'silent',
        'suspicious-comment': 'silent',
        'direct-eval': 'silent',
        'import-is-undefined': 'silent'
      }
    },

    // Configuración CSS ultra-silenciosa
    css: {
      devSourcemap: false
    }
  };
});
