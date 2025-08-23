
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Target, 
  Zap, 
  Calendar, 
  TrendingUp, 
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface WorkflowItem {
  id: string;
  title: string;
  type: 'node' | 'exercise' | 'plan' | 'deadline';
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate?: Date;
  estimatedTime?: number;
  progress?: number;
}

interface WorkflowIntegrationProps {
  onScheduleItem: (item: WorkflowItem) => void;
}

export const WorkflowIntegration: React.FC<WorkflowIntegrationProps> = ({ onScheduleItem }) => {
  // Simulamos datos del workflow actual del usuario
  const workflowItems: WorkflowItem[] = [
    {
      id: '1',
      title: 'Nodo: Funciones Cuadráticas',
      type: 'node',
      status: 'pending',
      priority: 'high',
      estimatedTime: 45,
      progress: 0
    },
    {
      id: '2',
      title: 'Ejercicios: Comprensión Lectora',
      type: 'exercise',
      status: 'in_progress',
      priority: 'medium',
      estimatedTime: 30,
      progress: 60
    },
    {
      id: '3',
      title: 'Plan Semanal: Matemática M2',
      type: 'plan',
      status: 'pending',
      priority: 'critical',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      estimatedTime: 120
    },
    {
      id: '4',
      title: 'Deadline: Simulacro PAES',
      type: 'deadline',
      status: 'pending',
      priority: 'critical',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    }
  ];

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'node':
        return <BookOpen className="w-4 h-4" />;
      case 'exercise':
        return <Zap className="w-4 h-4" />;
      case 'plan':
        return <Target className="w-4 h-4" />;
      case 'deadline':
        return <Clock className="w-4 h-4" />;
      default:
        return <Calendar className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-400" />;
      case 'in_progress':
        return <TrendingUp className="w-3 h-3 text-blue-400" />;
      case 'pending':
        return <AlertCircle className="w-3 h-3 text-orange-400" />;
      default:
        return null;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-500/10';
      case 'high':
        return 'border-orange-500 bg-orange-500/10';
      case 'medium':
        return 'border-blue-500 bg-blue-500/10';
      case 'low':
        return 'border-gray-500 bg-gray-500/10';
      default:
        return 'border-gray-600 bg-gray-600/10';
    }
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-white">
          <Target className="h-5 w-5 text-purple-400" />
          <span>Integración de Workflow</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {workflowItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                p-3 rounded-lg border transition-all duration-200 hover:shadow-lg
                ${getPriorityColor(item.priority)}
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex items-center space-x-2">
                    {getItemIcon(item.type)}
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm truncate">{item.title}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      {item.estimatedTime && (
                        <Badge variant="outline" className="text-xs bg-gray-700/50 border-gray-600 text-gray-300">
                          {item.estimatedTime}min
                        </Badge>
                      )}
                      {item.dueDate && (
                        <Badge variant="outline" className="text-xs bg-red-600/20 border-red-500 text-red-300">
                          {item.dueDate.toLocaleDateString()}
                        </Badge>
                      )}
                      {item.progress !== undefined && item.progress > 0 && (
                        <Badge variant="outline" className="text-xs bg-blue-600/20 border-blue-500 text-blue-300">
                          {item.progress}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onScheduleItem(item)}
                  className="text-gray-400 hover:text-white hover:bg-gray-700/50 ml-2"
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>
              
              {item.progress !== undefined && item.progress > 0 && (
                <div className="mt-2">
                  <div className="w-full bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
