
import React from "react";
import { StatCard } from "@/components/stat-card";
import { BookOpen, Calendar, CheckCircle, Hourglass, Brain, Target } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getHabilidadDisplayName } from "@/types/system-types";

export interface StatCardItem {
  title: string;
  value: string | number;
  description: string;
  trend: string;
  trendValue: string;
  tooltipText?: string;
  emphasize?: boolean;
}

interface StatCardsProps {
  loading: boolean;
  stats?: StatCardItem[] | { totalNodes: number; completedNodes: number; totalPlans: number; };
  className?: string;
  completedExercises?: number;
  accuracyPercentage?: number;
  totalTimeMinutes?: number;
  skillMap?: Record<string, number>;
}

export const StatCards = ({ 
  loading,
  stats,
  className,
  completedExercises = 0,
  accuracyPercentage = 0,
  totalTimeMinutes = 0,
  skillMap
}: StatCardsProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const getIconForStat = (title: string) => {
    switch (title.toLowerCase()) {
      case "ejercicios completados":
        return <CheckCircle className="h-5 w-5 text-stp-primary" />;
      case "precisión":
        return <BookOpen className="h-5 w-5 text-stp-primary" />;
      case "tiempo de estudio":
        return <Hourglass className="h-5 w-5 text-stp-primary" />;
      case "días consecutivos":
        return <Calendar className="h-5 w-5 text-stp-primary" />;
      case "competencias dominadas":
        return <Brain className="h-5 w-5 text-stp-primary" />;
      case "objetivo":
        return <Target className="h-5 w-5 text-stp-primary" />;
      default:
        return <CheckCircle className="h-5 w-5 text-stp-primary" />;
    }
  };

  // Check if stats is an array of StatCardItem
  if (stats && Array.isArray(stats)) {
    return (
      <motion.div 
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className || ''}`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, index) => (
          <TooltipProvider key={index} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <StatCard 
                    title={stat.title} 
                    value={loading ? "..." : stat.value} 
                    icon={getIconForStat(stat.title)}
                    trend={{
                      value: parseInt(stat.trendValue), 
                      positive: stat.trend === "up"
                    }}
                    className={`hover:shadow-md transition-all duration-300 border-2 
                      ${stat.emphasize ? 'border-primary/40 hover:border-primary' : 'hover:border-primary/20'}`}
                  />
                </motion.div>
              </TooltipTrigger>
              {stat.tooltipText && (
                <TooltipContent>
                  <p>{stat.tooltipText}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </motion.div>
    );
  }
  
  // Si tenemos un mapa de habilidades, construir stats basados en eso
  if (skillMap && Object.keys(skillMap).length > 0) {
    const topSkills = Object.entries(skillMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 2);
    
    const skillStats = topSkills.map(([skill, level]) => ({
      title: getHabilidadDisplayName(skill as any),
      value: `${Math.round(level * 100)}%`,
      description: "Nivel de competencia",
      trend: "up",
      trendValue: "5",
      tooltipText: `Tu nivel en ${getHabilidadDisplayName(skill as any)} es ${Math.round(level * 100)}%`
    }));
    
    const combinedStats = [
      {
        title: "Ejercicios Completados",
        value: loading ? "..." : completedExercises || 0,
        description: "Total de ejercicios",
        trend: "up",
        trendValue: "12",
        tooltipText: "Número total de ejercicios que has completado"
      },
      {
        title: "Precisión",
        value: `${loading ? "..." : accuracyPercentage || 0}%`,
        description: "Tasa de aciertos",
        trend: "up",
        trendValue: "5",
        tooltipText: "Porcentaje de respuestas correctas"
      },
      ...skillStats
    ];
    
    return (
      <motion.div 
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className || ''}`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        {combinedStats.map((stat, index) => (
          <TooltipProvider key={index} delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                  <StatCard 
                    title={stat.title} 
                    value={stat.value} 
                    icon={getIconForStat(stat.title)}
                    trend={{
                      value: parseInt(stat.trendValue), 
                      positive: stat.trend === "up"
                    }}
                    className="hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20"
                  />
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{stat.tooltipText}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </motion.div>
    );
  }

  // Generate default stat cards with available data
  const defaultStatCards = [
    {
      title: "Ejercicios Completados",
      value: loading ? "..." : completedExercises,
      icon: <CheckCircle className="h-5 w-5 text-stp-primary" />,
      trend: { value: 12, positive: true },
      tooltipText: "Número total de ejercicios que has completado"
    },
    {
      title: "Precisión",
      value: `${loading ? "..." : accuracyPercentage}%`,
      icon: <BookOpen className="h-5 w-5 text-stp-primary" />,
      trend: { value: 5, positive: true },
      tooltipText: "Porcentaje de respuestas correctas"
    },
    {
      title: "Tiempo de Estudio",
      value: `${loading ? "..." : totalTimeMinutes} min`,
      icon: <Hourglass className="h-5 w-5 text-stp-primary" />,
      trend: { value: 8, positive: true },
      tooltipText: "Tiempo total dedicado al estudio"
    },
    {
      title: "Días Consecutivos",
      value: "3",
      icon: <Calendar className="h-5 w-5 text-stp-primary" />,
      trend: { value: 2, positive: true },
      tooltipText: "Días consecutivos de actividad"
    }
  ];

  // Return default stat cards
  return (
    <motion.div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className || ''}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      {defaultStatCards.map((stat, index) => (
        <TooltipProvider key={index} delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
                <StatCard 
                  title={stat.title} 
                  value={stat.value} 
                  icon={stat.icon}
                  trend={stat.trend}
                  className="hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20"
                />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{stat.tooltipText}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </motion.div>
  );
};
