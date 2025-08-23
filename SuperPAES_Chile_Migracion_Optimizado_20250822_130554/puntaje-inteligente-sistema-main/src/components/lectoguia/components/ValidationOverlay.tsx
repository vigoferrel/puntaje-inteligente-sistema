/* eslint-disable react-refresh/only-export-components */
import { FC, useState } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, RefreshCw, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';

interface ValidationOverlayProps {
  validationStatus: {
    isValid: boolean;
    issuesCount: number;
    issuesByType?: Record<string, number>;
  };
  onRevalidate: () => void;
}

export const ValidationOverlay: FC<ValidationOverlayProps> = ({
  validationStatus,
  onRevalidate
}) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible || validationStatus.isValid) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="max-w-md w-full"
        >
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-orange-800 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Problemas de Coherencia
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="text-orange-600 hover:bg-orange-100"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-orange-700 text-sm">
                Se detectaron {validationStatus.issuesCount} problemas de coherencia en el sistema educativo.
              </p>

              {validationStatus.issuesByType && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-orange-800">DistribuciÃ³n de problemas:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(validationStatus.issuesByType).map(([type, count]) => (
                      <Badge key={type} variant="outline" className="text-orange-600 border-orange-300">
                        {type.replace(/_/g, ' ')}: {count}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={onRevalidate}
                  size="sm"
                  className="flex-1 bg-orange-600 hover:bg-orange-700"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Revalidar Sistema
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Continuar
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

