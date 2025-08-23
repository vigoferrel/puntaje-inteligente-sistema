
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StudentModernDashboard } from './StudentModernDashboard';
import { AdminModernDashboard } from './AdminModernDashboard';
import { ParentModernDashboard } from './ParentModernDashboard';
import { User, Shield, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

type DashboardType = 'student' | 'admin' | 'parent';

const ModernDashboardHub: React.FC = () => {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardType>('student');

  const TabButton = ({ 
    id, 
    label, 
    icon, 
    isActive, 
    onClick,
    gradient 
  }: {
    id: DashboardType;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: (id: DashboardType) => void;
    gradient: string;
  }) => (
    <motion.button
      onClick={() => onClick(id)}
      className={`relative flex items-center px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 ${
        isActive 
          ? `bg-gradient-to-r ${gradient} text-white shadow-lg transform scale-105` 
          : 'text-gray-600 hover:bg-white/50 hover:text-gray-900 backdrop-blur-sm'
      }`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <span className="w-5 h-5 mr-2">{icon}</span>
      {label}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-white/20"
          layoutId="activeTab"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400 to-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000" />
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-gradient-to-br from-green-400 to-teal-600 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500" />
      </div>

      {/* Header with Tab Selector */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div 
              className="flex items-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mr-8">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl mr-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    PAES Pro
                  </div>
                  <div className="text-sm text-gray-500">Dashboard Inteligente</div>
                </div>
              </div>
              
              <div className="flex space-x-2 bg-white/50 backdrop-blur-sm rounded-xl p-1">
                <TabButton
                  id="student"
                  label="Estudiante"
                  icon={<User />}
                  isActive={activeTab === 'student'}
                  onClick={setActiveTab}
                  gradient="from-blue-600 to-blue-700"
                />
                <TabButton
                  id="admin"
                  label="Administrador"
                  icon={<Shield />}
                  isActive={activeTab === 'admin'}
                  onClick={setActiveTab}
                  gradient="from-gray-700 to-gray-800"
                />
                <TabButton
                  id="parent"
                  label="Apoderado"
                  icon={<Heart />}
                  isActive={activeTab === 'parent'}
                  onClick={setActiveTab}
                  gradient="from-green-600 to-green-700"
                />
              </div>
            </motion.div>
            
            <motion.div 
              className="text-sm text-gray-500 bg-white/50 backdrop-blur-sm rounded-lg px-3 py-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Sistema PAES 2024 • 277 Nodos Activos
            </motion.div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'student' && <StudentModernDashboard />}
            {activeTab === 'admin' && <AdminModernDashboard />}
            {activeTab === 'parent' && <ParentModernDashboard />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ModernDashboardHub;
