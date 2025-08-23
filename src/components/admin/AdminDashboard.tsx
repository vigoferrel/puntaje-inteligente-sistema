
import React from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart3, Users, AlertTriangle } from 'lucide-react';
import { AdminCostDashboard } from './AdminCostDashboard';
import { useAuth } from '@/contexts/AuthContext';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Verificar si es admin (simplificado para demo)
  const isAdmin = user?.email?.includes('admin') || false;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center p-8 bg-white/10 backdrop-blur-sm rounded-2xl"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h2>
          <p className="text-gray-300">Solo los administradores pueden acceder a este panel.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-gray-900 p-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header del Admin */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Panel de Administración</h1>
              <p className="text-gray-300">Sistema de métricas y control de costos OpenRouter</p>
            </div>
          </div>
        </div>

        {/* Dashboard de Costos */}
        <AdminCostDashboard />
      </motion.div>
    </div>
  );
};
