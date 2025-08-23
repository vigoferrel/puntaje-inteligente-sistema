
import React, { Suspense, lazy } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

// Lazy loading components
const PAESUniversePage = lazy(() => import('@/pages/PAESUniversePage'));
const PAESDashboard = lazy(() => import('@/pages/PAESDashboard'));
const Diagnostico = lazy(() => import('@/pages/Diagnostico'));
const Plan = lazy(() => import('@/pages/Plan'));

// Fallback cinematográfico
const CinematicSuspenseFallback: React.FC<{ componentName: string }> = ({ componentName }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center"
  >
    <div className="text-center space-y-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="w-12 h-12 text-purple-400 mx-auto" />
      </motion.div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">
          Cargando {componentName}
        </h3>
        <p className="text-purple-300">Preparando experiencia cinematográfica...</p>
      </div>
      <div className="w-64 h-1 bg-purple-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
        />
      </div>
    </div>
  </motion.div>
);

// HOC simplificado para lazy loading con tipos corregidos
export const withLazyLoading = <T extends React.ComponentType<any>>(
  Component: React.LazyExoticComponent<T>,
  componentName: string
) => {
  const WrappedComponent = (props: React.ComponentProps<T>) => (
    <Suspense fallback={<CinematicSuspenseFallback componentName={componentName} />}>
      <Component {...props} />
    </Suspense>
  );
  
  WrappedComponent.displayName = `withLazyLoading(${componentName})`;
  return WrappedComponent;
};

// Componentes lazy exportados
export const LazyPAESUniverse = withLazyLoading(PAESUniversePage, "PAES Universe");
export const LazyPAESDashboard = withLazyLoading(PAESDashboard, "Dashboard PAES");
export const LazyDiagnostico = withLazyLoading(Diagnostico, "Diagnóstico");
export const LazyPlan = withLazyLoading(Plan, "Plan de Estudio");
