
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NeuralScrollContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const NeuralScrollContainer: React.FC<NeuralScrollContainerProps> = ({
  children,
  className = ''
}) => {
  return (
    <ScrollArea className={`h-full w-full ${className}`}>
      <div className="min-h-full">
        {children}
      </div>
    </ScrollArea>
  );
};
