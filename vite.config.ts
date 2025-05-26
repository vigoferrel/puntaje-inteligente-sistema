
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { getViteBuildConfig } from "./src/core/performance/BundleOptimizerAdvanced";

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
  
  // Aplicar configuración optimizada de build
  ...getViteBuildConfig(),
  
  // Optimizaciones de desarrollo
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
      '@tanstack/react-query',
      'lucide-react'
    ],
    exclude: [
      '@react-three/fiber',
      '@react-three/drei',
      'three'
    ]
  }
}));
