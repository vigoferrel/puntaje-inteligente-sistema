
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';
import { getNodeMapping, getCategoryColor } from '../utils/nodeMapping';

interface NodeDescriptorProps {
  nodeCode: string;
  showFullInfo?: boolean;
}

export const NodeDescriptor: React.FC<NodeDescriptorProps> = ({ 
  nodeCode, 
  showFullInfo = false 
}) => {
  const mapping = getNodeMapping(nodeCode);
  const categoryColor = getCategoryColor(mapping.category);

  if (showFullInfo) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{mapping.icon}</span>
          <div>
            <h4 className="font-semibold text-sm">{mapping.friendlyName}</h4>
            <p className="text-xs text-muted-foreground font-mono">{mapping.code}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{mapping.description}</p>
        <div className="flex gap-2">
          <Badge variant="outline" className={categoryColor}>
            {mapping.category}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {mapping.bloomLevel}
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2 cursor-help">
            <span className="text-sm">{mapping.icon}</span>
            <div className="flex flex-col">
              <span className="font-medium text-sm">{mapping.friendlyName}</span>
              <span className="text-xs text-muted-foreground font-mono">{mapping.code}</span>
            </div>
            <Info className="w-3 h-3 text-muted-foreground" />
          </div>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-xs">
          <div className="space-y-2">
            <p className="text-sm">{mapping.description}</p>
            <div className="flex gap-1">
              <Badge variant="outline" className={`${categoryColor} text-xs`}>
                {mapping.category}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {mapping.bloomLevel}
              </Badge>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
