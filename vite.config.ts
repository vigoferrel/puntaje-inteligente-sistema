
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
    
    // Configuración conservadora para máxima estabilidad
    build: {
      target: 'es2015',
      sourcemap: mode === 'development',
      minify: mode === 'production',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            motion: ['framer-motion'],
            ui: ['@radix-ui/react-dialog', '@radix-ui/react-select', 'lucide-react']
          }
        }
      },
      chunkSizeWarningLimit: 1000
    },
    
    // Optimizaciones conservadoras
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        '@tanstack/react-query',
        'lucide-react',
        '@radix-ui/react-dialog',
        '@radix-ui/react-select'
      ],
      // Reducir exclusiones para evitar problemas de carga
      exclude: []
    },

    // Configuración para mejor manejo de errores
    define: {
      __DEV__: mode === 'development'
    }
  };
});
