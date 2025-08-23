/* eslint-disable react-refresh/only-export-components */

import { CalendarIcon, BookOpenIcon, ClockIcon } from "lucide-react";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface PlanMetricsProps {
  targetDate?: string;
  nodesCount: number;
  progress?: number;
}

export const PlanMetrics = ({ targetDate, nodesCount, progress = 0 }: PlanMetricsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="flex items-center p-3 bg-primary/5 rounded-lg">
        <CalendarIcon className="h-5 w-5 text-primary mr-2" />
        <div>
          <p className="text-xs font-medium text-gray-600">Fecha Objetivo</p>
          <p className="font-semibold">
            {targetDate 
              ? format(new Date(targetDate), "dd 'de' MMMM, yyyy", { locale: es })
              : "No definida"}
          </p>
        </div>
      </div>
      
      <div className="flex items-center p-3 bg-primary/5 rounded-lg">
        <BookOpenIcon className="h-5 w-5 text-primary mr-2" />
        <div>
          <p className="text-xs font-medium text-gray-600">Total de MÃ³dulos</p>
          <p className="font-semibold">{nodesCount} mÃ³dulos</p>
        </div>
      </div>
      
      <div className="flex items-center p-3 bg-primary/5 rounded-lg">
        <ClockIcon className="h-5 w-5 text-primary mr-2" />
        <div>
          <p className="text-xs font-medium text-gray-600">Progreso General</p>
          <p className="font-semibold">
            {Math.round(progress * 100)}%
          </p>
        </div>
      </div>
    </div>
  );
};

