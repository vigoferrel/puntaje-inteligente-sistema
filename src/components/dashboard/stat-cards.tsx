
import React from "react";
import { StatCard } from "@/components/stat-card";
import { BookOpen, CalendarDays, CheckCircle, Hourglass, Brain, Target } from "lucide-react";
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
  stats?: StatCardItem[];
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
  completedExercises,
  accuracyPercentage,
  totalTimeMinutes,
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
        return <CalendarDays className="h-5 w-5 text-stp-primary" />;
      case "competencias dominadas":
        return <Brain className="h-5 w-5 text-stp-primary" />;
      case "objetivo":
        return <Target className="h-5 w-5 text-stp-primary" />;
      default:
        return <CheckCircle className="h-5 w-5 text-stp-primary" />;
    }
  };

  // If stats are provided, use them
  if (stats && stats.length > 0) {
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

  // Legacy usage
  return (
    <motion.div 
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className || ''}`}
      variants={container}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <StatCard 
          title="Ejercicios Completados" 
          value={loading ? "..." : completedExercises} 
          icon={<CheckCircle className="h-5 w-5 text-stp-primary" />}
          trend={{ value: 12, positive: true }}
          className="hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20"
        />
      </motion.div>
      
      <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <StatCard 
          title="Precisión" 
          value={`${loading ? "..." : accuracyPercentage}%`} 
          icon={<BookOpen className="h-5 w-5 text-stp-primary" />}
          trend={{ value: 5, positive: true }}
          className="hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20"
        />
      </motion.div>
      
      <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <StatCard 
          title="Tiempo de Estudio" 
          value={`${loading ? "..." : totalTimeMinutes} min`} 
          icon={<Hourglass className="h-5 w-5 text-stp-primary" />}
          trend={{ value: 8, positive: true }}
          className="hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20"
        />
      </motion.div>
      
      <motion.div variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
        <StatCard 
          title="Días Consecutivos" 
          value="3" 
          icon={<CalendarDays className="h-5 w-5 text-stp-primary" />}
          trend={{ value: 2, positive: true }}
          className="hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20"
        />
      </motion.div>
    </motion.div>
  );
};
