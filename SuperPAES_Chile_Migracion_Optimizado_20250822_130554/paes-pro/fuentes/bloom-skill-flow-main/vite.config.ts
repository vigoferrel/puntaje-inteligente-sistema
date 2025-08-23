
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
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
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Optimize bundle splitting for widget
          'widget-core': ['./src/widget-core/WidgetBootstrapper.ts'],
          'bloom-assessment': [
            './src/bloom-assessment/BloomLevelDetector.ts',
            './src/bloom-assessment/ProgressiveAssessment.ts'
          ],
          'react-vendor': ['react', 'react-dom']
        }
      }
    },
    target: 'es2015', // Ensure broad browser compatibility
    sourcemap: mode === 'development',
    minify: mode === 'production' ? 'terser' : false,
    terserOptions: mode === 'production' ? {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    } : undefined
  },
  define: {
    // Ensure env variables are available
    'process.env.NODE_ENV': JSON.stringify(mode),
  }
}));
