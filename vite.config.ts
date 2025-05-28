
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
    
    // Configuración optimizada para Lovable v2024
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
        }
      },
      chunkSizeWarningLimit: 1000
    },
    
    // Optimizaciones para Lovable
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

    // Configuración para mejor compatibilidad con Lovable
    define: {
      __DEV__: mode === 'development',
      __LOVABLE_VERSION__: JSON.stringify('2024.1'),
      global: 'globalThis'
    },
    
    // Manejo mejorado de assets
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
    
    // Configuración de preview para Lovable
    preview: {
      port: 8080,
      host: "::",
      strictPort: true
    }
  };
});
