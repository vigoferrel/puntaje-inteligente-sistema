/* eslint-disable react-refresh/only-export-components */

import { Card, CardContent } from "../../components/ui/card";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { Button } from "../../components/ui/button";
import { Clock, PlayCircle, XCircle } from "lucide-react";
import { StoredTestProgress } from "../../utils/test-storage";

interface PausedTestBannerProps {
  pausedProgress: StoredTestProgress;
  onResumeTest: () => void;
  onDiscardProgress: () => void;
}

export const PausedTestBanner = ({
  pausedProgress,
  onResumeTest,
  onDiscardProgress
}: PausedTestBannerProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800">
      <CardContent className="pt-6 pb-4">
        <div className="flex items-start md:items-center flex-col md:flex-row gap-4 justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-amber-600 dark:text-amber-500" />
            <div>
              <h3 className="font-medium text-amber-800 dark:text-amber-300">
                Tienes un diagnÃ³stico pausado
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Pausado el {formatDate(pausedProgress.lastPausedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onDiscardProgress}
              className="border-amber-300 hover:bg-amber-100 dark:border-amber-700 dark:hover:bg-amber-800/50"
            >
              <XCircle className="w-4 h-4 mr-1" />
              Descartar
            </Button>
            <Button 
              size="sm" 
              onClick={onResumeTest}
              className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-600 dark:hover:bg-amber-700 flex-1 md:flex-none"
            >
              <PlayCircle className="w-4 h-4 mr-1" />
              Continuar diagnÃ³stico
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

