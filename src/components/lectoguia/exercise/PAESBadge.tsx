
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Sparkles } from 'lucide-react';

interface PAESBadgeProps {
  source: 'PAES' | 'AI' | null;
  questionNumber?: number;
  className?: string;
}

export const PAESBadge: React.FC<PAESBadgeProps> = ({ 
  source, 
  questionNumber, 
  className = '' 
}) => {
  if (!source) return null;

  if (source === 'PAES') {
    return (
      <Badge variant="secondary" className={`bg-green-100 text-green-800 border-green-300 ${className}`}>
        <Award className="h-3 w-3 mr-1" />
        Oficial PAES {questionNumber ? `#${questionNumber}` : ''}
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className={`bg-blue-50 text-blue-700 border-blue-300 ${className}`}>
      <Sparkles className="h-3 w-3 mr-1" />
      Generado por IA
    </Badge>
  );
};
