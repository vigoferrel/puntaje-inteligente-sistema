/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { motion } from "framer-motion";
import { 
  Brain, 
  Target, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";

interface SystemStatusCardsProps {
  dashboardData: unknown;
}

export const SystemStatusCards: FC<SystemStatusCardsProps> = ({ dashboardData }) => {
  const statusCards = [
    {
      title: "Sistema IA",
      value: "Activo",
      icon: Brain,
      color: "text-green-400",
      bgColor: "bg-green-500/20",
      description: "277 nodos conectados"
    },
    {
      title: "Progreso Global",
      value: `${dashboardData.progress?.globalProgress || 65}%`,
      icon: TrendingUp,
      color: "text-blue-400",
      bgColor: "bg-blue-500/20",
      description: "Meta semanal 85%"
    },
    {
      title: "Plan Activo",
      value: "Integral PAES",
      icon: Target,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      description: "Semana 8 de 12"
    },
    {
      title: "Puntaje Actual",
      value: `${dashboardData.performance?.averageScore || 625}`,
      icon: CheckCircle,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/20",
      description: "Meta: 700 puntos"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {statusCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${card.bgColor}`}>
                  <card.icon className={`w-4 h-4 ${card.color}`} />
                </div>
                <div className="flex-1">
                  <div className="text-sm text-gray-400">{card.title}</div>
                  <div className="text-lg font-bold text-white">{card.value}</div>
                  <div className="text-xs text-gray-500">{card.description}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

