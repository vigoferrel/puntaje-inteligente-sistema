
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, CheckCircle, Clock, Target, 
  TrendingUp, Calendar, Zap, Award,
  Play, Pause, FastForward
} from 'lucide-react';

interface PlanTask {
  id: string;
  title: string;
  type: 'lectura' | 'ejercicios' | 'simulacro' | 'repaso';
  duration: number;
  completed: boolean;
  progress: number;
  startTime?: Date;
  completedTime?: Date;
  resources: string[];
}

interface ActivePlan {
  id: string;
  title: string;
  subject: string;
  tasks: PlanTask[];
  totalProgress: number;
  estimatedTimeRemaining: number;
  deadline: Date;
}

interface PlanProgressTrackerProps {
  activePlan: ActivePlan;
  onTaskComplete: (taskId: string) => void;
  onTaskStart: (taskId: string) => void;
  userMetrics: {
    performance: number;
    studyTime: number;
    completionRate: number;
  };
}

export const PlanProgressTracker: React.FC<PlanProgressTrackerProps> = ({
  activePlan,
  onTaskComplete,
  onTaskStart,
  userMetrics
}) => {
  const [currentTask, setCurrentTask] = useState<PlanTask | null>(null);
  const [isStudying, setIsStudying] = useState(false);
  const [studyTimer, setStudyTimer] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isStudying && currentTask) {
      interval = setInterval(() => {
        setStudyTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isStudying, currentTask]);

  const getTaskIcon = (type: string) => {
    switch (type) {
      case 'lectura': return '📖';
      case 'ejercicios': return '✏️';
      case 'simulacro': return '🎯';
      case 'repaso': return '🔄';
      default: return '📝';
    }
  };

  const getTaskColor = (type: string) => {
    switch (type) {
      case 'lectura': return 'from-blue-600 to-cyan-600';
      case 'ejercicios': return 'from-green-600 to-emerald-600';
      case 'simulacro': return 'from-red-600 to-orange-600';
      case 'repaso': return 'from-purple-600 to-indigo-600';
      default: return 'from-gray-600 to-slate-600';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startTask = (task: PlanTask) => {
    setCurrentTask(task);
    setIsStudying(true);
    setStudyTimer(0);
    onTaskStart(task.id);
  };

  const pauseTask = () => {
    setIsStudying(false);
  };

  const completeTask = () => {
    if (currentTask) {
      onTaskComplete(currentTask.id);
      setIsStudying(false);
      setCurrentTask(null);
      setStudyTimer(0);
    }
  };

  const nextTask = () => {
    const currentIndex = activePlan.tasks.findIndex(t => t.id === currentTask?.id);
    const nextTaskIndex = currentIndex + 1;
    if (nextTaskIndex < activePlan.tasks.length) {
      const next = activePlan.tasks[nextTaskIndex];
      if (!next.completed) {
        startTask(next);
      }
    }
  };

  const completedTasks = activePlan.tasks.filter(t => t.completed).length;
  const totalTasks = activePlan.tasks.length;
  const overallProgress = (completedTasks / totalTasks) * 100;

  return (
    <div className="space-y-6">
      {/* Plan Overview */}
      <Card className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 backdrop-blur-xl border-indigo-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-3">
            <Target className="w-6 h-6 text-indigo-400" />
            {activePlan.title}
            <Badge className="bg-indigo-600 text-white">
              {activePlan.subject}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {completedTasks}/{totalTasks}
              </div>
              <div className="text-sm text-gray-300">Tareas Completadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {Math.round(overallProgress)}%
              </div>
              <div className="text-sm text-gray-300">Progreso Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {Math.round(activePlan.estimatedTimeRemaining / 60)}h
              </div>
              <div className="text-sm text-gray-300">Tiempo Restante</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">
                {Math.ceil((activePlan.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
              </div>
              <div className="text-sm text-gray-300">Días Restantes</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Progreso del Plan</span>
              <span className="text-white">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Current Task Session */}
      {currentTask && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <Card className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 backdrop-blur-xl border-green-500/30">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <Play className="w-5 h-5 text-green-400" />
                Sesión Activa: {currentTask.title}
                {isStudying && (
                  <Badge className="bg-green-600 text-white animate-pulse">
                    En Progreso
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">
                    {formatTime(studyTimer)}
                  </div>
                  <div className="text-sm text-gray-300">Tiempo Actual</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">
                    {currentTask.duration}min
                  </div>
                  <div className="text-sm text-gray-300">Duración Estimada</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">
                    {Math.round((studyTimer / (currentTask.duration * 60)) * 100)}%
                  </div>
                  <div className="text-sm text-gray-300">Progreso Tarea</div>
                </div>
              </div>

              <Progress 
                value={(studyTimer / (currentTask.duration * 60)) * 100} 
                className="h-3" 
              />

              <div className="flex justify-center gap-3">
                {isStudying ? (
                  <Button onClick={pauseTask} className="bg-yellow-600 hover:bg-yellow-700">
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </Button>
                ) : (
                  <Button onClick={() => setIsStudying(true)} className="bg-green-600 hover:bg-green-700">
                    <Play className="w-4 h-4 mr-2" />
                    Continuar
                  </Button>
                )}
                
                <Button onClick={completeTask} className="bg-blue-600 hover:bg-blue-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completar
                </Button>
                
                <Button onClick={nextTask} variant="outline" className="border-white/20">
                  <FastForward className="w-4 h-4 mr-2" />
                  Siguiente
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Task List */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Lista de Tareas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activePlan.tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`transition-all ${
                  task.completed 
                    ? 'bg-green-900/20 border-green-500/30' 
                    : currentTask?.id === task.id
                    ? 'bg-blue-900/20 border-blue-500/30'
                    : 'bg-white/5 border-white/10'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${task.completed ? 'grayscale' : ''}`}>
                          {getTaskIcon(task.type)}
                        </div>
                        <div>
                          <h4 className={`font-medium ${
                            task.completed ? 'text-green-400 line-through' : 'text-white'
                          }`}>
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {task.type} • {task.duration} minutos
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        {task.completed ? (
                          <Badge className="bg-green-600 text-white">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Completada
                          </Badge>
                        ) : (
                          <Button
                            onClick={() => startTask(task)}
                            disabled={currentTask?.id === task.id}
                            className={`bg-gradient-to-r ${getTaskColor(task.type)}`}
                          >
                            {currentTask?.id === task.id ? (
                              <>
                                <Clock className="w-4 h-4 mr-2" />
                                En Progreso
                              </>
                            ) : (
                              <>
                                <Play className="w-4 h-4 mr-2" />
                                Iniciar
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {task.progress > 0 && !task.completed && (
                      <div className="mt-3">
                        <Progress value={task.progress} className="h-1.5" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card className="bg-black/40 backdrop-blur-xl border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-400" />
            Métricas de Rendimiento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {userMetrics.performance}%
              </div>
              <div className="text-sm text-gray-300">Rendimiento Actual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {userMetrics.studyTime}h
              </div>
              <div className="text-sm text-gray-300">Tiempo de Estudio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {userMetrics.completionRate}%
              </div>
              <div className="text-sm text-gray-300">Tasa de Finalización</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
