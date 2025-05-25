
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { NeuralDimension, NeuralDimensionConfig } from '../config/neuralTypes';

interface NeuralBreadcrumbProps {
  activeDimension: NeuralDimension;
  activeDimensionData: NeuralDimensionConfig | undefined;
  onBackToCenter: () => void;
  showDimensionContent: boolean;
}

export const NeuralBreadcrumb: React.FC<NeuralBreadcrumbProps> = ({ 
  activeDimension, 
  activeDimensionData, 
  onBackToCenter, 
  showDimensionContent 
}) => (
  <div className="mb-6">
    <Breadcrumb>
      <BreadcrumbList className="text-white font-poppins">
        <BreadcrumbItem>
          <BreadcrumbLink 
            href="/" 
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
          >
            <Home className="w-4 h-4" />
            Dashboard
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="text-white/40">
          <ChevronRight className="w-4 h-4" />
        </BreadcrumbSeparator>
        <BreadcrumbItem>
          {showDimensionContent ? (
            <BreadcrumbLink 
              onClick={onBackToCenter}
              className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
            >
              Centro Neural
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="text-white">Centro Neural</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {showDimensionContent && (
          <>
            <BreadcrumbSeparator className="text-white/40">
              <ChevronRight className="w-4 h-4" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className="text-white font-medium">
                {activeDimensionData?.name || 'Dimensión Neural'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  </div>
);
