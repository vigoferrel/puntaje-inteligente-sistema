/* eslint-disable react-refresh/only-export-components */
import { FC, ReactNode } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { ScrollArea } from '../../components/ui/scroll-area';

interface NeuralScrollContainerProps {
  children: ReactNode;
  className?: string;
}

export const NeuralScrollContainer: FC<NeuralScrollContainerProps> = ({
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

