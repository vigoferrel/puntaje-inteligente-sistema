/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { motion } from 'framer-motion';
import { Plus, BookOpen, Target, Clock, Bell, Brain, Calendar } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<unknown>;
  color: string;
  action: () => void;
  badge?: string;
}

interface QuickActionsProps {
  onCreateEvent: (type: 'study_session' | 'paes_date' | 'deadline' | 'reminder') => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({ onCreateEvent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const quickActions: QuickAction[] = [
    {
      id: 'study_session',
      title: 'SesiÃ³n de Estudio',
      description: 'Programa tiempo para estudiar nodos especÃ­ficos',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      action: () => onCreateEvent('study_session'),
      badge: 'Popular'
    },
    {
      id: 'paes_date',
      title: 'Fecha PAES',
      description: 'Registra fechas oficiales de exÃ¡menes',
      icon: Target,
      color: 'from-red-500 to-pink-500',
      action: () => onCreateEvent('paes_date'),
      badge: 'Importante'
    },
    {
      id: 'deadline',
      title: 'Fecha LÃ­mite',
      description: 'Establece deadlines para tareas y objetivos',
      icon: Clock,
      color: 'from-orange-500 to-yellow-500',
      action: () => onCreateEvent('deadline')
    },
    {
      id: 'reminder',
      title: 'Recordatorio',
      description: 'Crea recordatorios personalizados',
      icon: Bell,
      color: 'from-purple-500 to-violet-500',
      action: () => onCreateEvent('reminder')
    }
  ];

  return (
    <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-white">
            <Brain className="h-5 w-5 text-cyan-400" />
            <span>Acciones RÃ¡pidas</span>
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-400 hover:text-white"
          >
            <Plus className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-45' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : '120px' }}
          className="overflow-hidden"
        >
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`
                  relative p-4 rounded-lg cursor-pointer transition-all duration-300
                  bg-gradient-to-r ${action.color} hover:scale-105 hover:shadow-lg
                `}
                onClick={action.action}
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-white text-sm">{action.title}</h4>
                      {action.badge && (
                        <Badge className="text-xs px-1.5 py-0 h-4 bg-white/20 text-white border-white/30">
                          {action.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-white/80 mt-1">{action.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
};

