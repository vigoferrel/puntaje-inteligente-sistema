
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Target, TrendingUp, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const SimplifiedDashboard: React.FC = () => {
  const { profile } = useAuth();

  const stats = [
    { title: 'Progreso General', value: '75%', icon: TrendingUp, color: 'text-green-400' },
    { title: 'Nodos Completados', value: '12/20', icon: Target, color: 'text-blue-400' },
    { title: 'Planes Activos', value: '3', icon: BookOpen, color: 'text-purple-400' },
    { title: 'Nivel PAES', value: 'Intermedio', icon: Brain, color: 'text-orange-400' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">
            ¡Hola, {profile?.name || 'Estudiante'}!
          </h1>
          <p className="text-purple-200">
            Bienvenido a tu plataforma de preparación PAES
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-white">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-white/10 backdrop-blur-lg border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              <Badge className="bg-blue-500/20 text-blue-300 hover:bg-blue-500/30">
                Continuar Estudio
              </Badge>
              <Badge className="bg-green-500/20 text-green-300 hover:bg-green-500/30">
                Ver Progreso
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 hover:bg-purple-500/30">
                SuperPAES
              </Badge>
              <Badge className="bg-orange-500/20 text-orange-300 hover:bg-orange-500/30">
                Evaluación
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};
