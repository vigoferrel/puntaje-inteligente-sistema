/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { motion } from 'framer-motion';

interface Subject {
  name: string;
  icon: React.ComponentType<unknown>;
  color: string;
  totalNodes: number;
  tier1: number;
  tier2: number;
  tier3: number;
}

interface SubjectSelectorProps {
  subjects: Record<string, Subject>;
  selectedSubject: string;
  onSubjectChange: (subject: string) => void;
}

export const SubjectSelector: FC<SubjectSelectorProps> = ({
  subjects,
  selectedSubject,
  onSubjectChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {Object.entries(subjects).map(([key, subject], index) => {
        const Icon = subject.icon;
        const isSelected = selectedSubject === key;
        
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                isSelected 
                  ? 'ring-2 ring-primary shadow-lg scale-105' 
                  : 'hover:scale-102'
              }`}
              onClick={() => onSubjectChange(key)}
            >
              <CardContent className="p-4 text-center">
                <div className={`inline-flex p-3 rounded-lg ${subject.color} text-white mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                
                <h3 className="font-semibold text-sm mb-2">{subject.name}</h3>
                
                <div className="text-2xl font-bold text-primary mb-1">
                  {subject.totalNodes}
                </div>
                <p className="text-xs text-muted-foreground mb-3">nodos totales</p>
                
                <div className="flex justify-center gap-1">
                  <Badge variant="destructive" className="text-xs px-1 py-0">
                    T1: {subject.tier1}
                  </Badge>
                  <Badge variant="secondary" className="text-xs px-1 py-0 bg-yellow-100 text-yellow-800">
                    T2: {subject.tier2}
                  </Badge>
                  <Badge variant="secondary" className="text-xs px-1 py-0 bg-green-100 text-green-800">
                    T3: {subject.tier3}
                  </Badge>
                </div>
                
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-2"
                  >
                    <Badge variant="default" className="text-xs">
                      Seleccionado
                    </Badge>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
};

