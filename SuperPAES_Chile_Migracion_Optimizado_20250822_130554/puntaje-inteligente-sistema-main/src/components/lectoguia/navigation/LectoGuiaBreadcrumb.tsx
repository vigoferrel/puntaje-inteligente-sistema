/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '../../../utils/lectoguia-utils';

interface BreadcrumbItem {
  label: string;
  active: boolean;
  onClick: () => void;
}

interface LectoGuiaBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const LectoGuiaBreadcrumb: FC<LectoGuiaBreadcrumbProps> = ({
  items,
  className
}) => {
  // Variantes de animaciÃ³n
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };
  
  return (
    <motion.nav 
      className={cn("flex items-center text-sm", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center">
        <button 
          onClick={() => null}
          className="w-5 h-5 rounded-full flex items-center justify-center hover:bg-muted/80"
        >
          <Home className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mx-1" />
      </motion.div>
      
      {items.map((item, index) => (
        <motion.div 
          key={item.label} 
          className="flex items-center"
          variants={itemVariants}
        >
          <button
            onClick={item.onClick}
            className={cn(
              "text-xs font-medium hover:text-primary transition-colors",
              item.active ? "text-primary font-semibold" : "text-muted-foreground"
            )}
          >
            {item.label}
          </button>
          
          {index < items.length - 1 && (
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground mx-1" />
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
};

