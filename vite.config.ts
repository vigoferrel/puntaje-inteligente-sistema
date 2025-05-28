
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
    
    // Configuración LOVABLE 2024.2 Compatible
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
        // Supresión total de warnings para Lovable 2024.2
        onwarn() {
          return;
        }
      },
      chunkSizeWarningLimit: 10000,
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
    
    // Optimizaciones Lovable 2024.2
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

    define: {
      __DEV__: mode === 'development',
      __LOVABLE_VERSION__: JSON.stringify('2024.2'),
      global: 'globalThis'
    },
    
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
    
    preview: {
      port: 8080,
      host: "::",
      strictPort: true
    },

    // Logging silencioso para compatibilidad
    logLevel: 'error',
    
    esbuild: {
      logLevel: 'silent',
      logOverride: { 
        'this-is-undefined-in-esm': 'silent',
        'suspicious-comment': 'silent',
        'direct-eval': 'silent',
        'import-is-undefined': 'silent'
      }
    },

    css: {
      devSourcemap: false
    }
  };
});
