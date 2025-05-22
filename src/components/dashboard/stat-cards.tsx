
import React from "react";
import { StatCard } from "@/components/stat-card";
import { BookOpen, CalendarDays, CheckCircle, Hourglass } from "lucide-react";
import { motion } from "framer-motion";

export interface StatCardItem {
  title: string;
  value: string | number;
  description: string;
  trend: string;
  trendValue: string;
}

interface StatCardsProps {
  loading: boolean;
  stats?: StatCardItem[];
  className?: string;
  completedExercises?: number;
  accuracyPercentage?: number;
  totalTimeMinutes?: number;
}

export const StatCards = ({ 
  loading,
  stats,
  className,
  completedExercises,
  accuracyPercentage,
  totalTimeMinutes
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
          <motion.div key={index} variants={item} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <StatCard 
              title={stat.title} 
              value={loading ? "..." : stat.value} 
              icon={getIconForStat(stat.title)}
              trend={{
                value: parseInt(stat.trendValue), 
                positive: stat.trend === "up"
              }}
              className="hover:shadow-md transition-all duration-300 border-2 hover:border-primary/20"
            />
          </motion.div>
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

// Helper function to get icon based on stat title
function getIconForStat(title: string) {
  switch (title.toLowerCase()) {
    case "ejercicios completados":
      return <CheckCircle className="h-5 w-5 text-stp-primary" />;
    case "precisión":
      return <BookOpen className="h-5 w-5 text-stp-primary" />;
    case "tiempo de estudio":
      return <Hourglass className="h-5 w-5 text-stp-primary" />;
    case "días consecutivos":
      return <CalendarDays className="h-5 w-5 text-stp-primary" />;
    default:
      return <CheckCircle className="h-5 w-5 text-stp-primary" />;
  }
}
