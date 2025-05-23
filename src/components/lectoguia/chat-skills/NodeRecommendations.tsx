
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TPAESHabilidad } from '@/types/system-types';
import { getSkillName, getSkillColor } from '@/utils/lectoguia-utils';
import { BookOpen, ArrowRight, Sparkles, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface NodeRecommendationsProps {
  activeSkill: TPAESHabilidad;
  recommendedNodes: any[];
  onNodeSelect: (nodeId: string) => void;
}

export const NodeRecommendations: React.FC<NodeRecommendationsProps> = ({
  activeSkill,
  recommendedNodes = [],
  onNodeSelect
}) => {
  if (!activeSkill || recommendedNodes.length === 0) {
    return null;
  }
  
  // Obtener el nombre y color de la habilidad activa
  const skillName = getSkillName(activeSkill);
  const skillColor = getSkillColor(activeSkill);
  
  // Animación de entrada
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="mb-4"
    >
      <Card className="border-border bg-gradient-to-r from-card/80 to-background/90 backdrop-blur-sm">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold">
              Nodos recomendados para mejorar en: <span style={{ color: skillColor }}>{skillName}</span>
            </h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recommendedNodes.slice(0, 3).map((node, index) => (
              <motion.div key={node.id || index} variants={itemVariants}>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2 group relative border-border hover:border-primary/50 transition-all"
                  onClick={() => onNodeSelect(node.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <BookOpen className="h-4 w-4 text-primary group-hover:text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium truncate pr-6">{node.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{node.description}</div>
                      <div className="mt-1 flex items-center gap-1.5">
                        <Badge variant="outline" className="text-[10px] font-normal py-0">
                          {node.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-[10px] font-normal py-0">
                          {node.estimatedTimeMinutes} min
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 absolute top-1/2 -translate-y-1/2 right-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </motion.div>
            ))}
          </div>
          
          {recommendedNodes.length > 3 && (
            <div className="mt-2 text-center">
              <Button variant="ghost" size="sm" className="text-xs">
                Ver todos los nodos recomendados <Target className="ml-1 h-3 w-3" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};
