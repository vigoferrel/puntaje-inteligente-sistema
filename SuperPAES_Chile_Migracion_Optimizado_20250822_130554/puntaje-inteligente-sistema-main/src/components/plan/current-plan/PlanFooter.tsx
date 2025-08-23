/* eslint-disable react-refresh/only-export-components */

import { Button } from "../../../components/ui/button";
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';
import { CardFooter } from "../../../components/ui/card";
import { RefreshCw } from "lucide-react";

interface PlanFooterProps {
  loading: boolean;
  onUpdateProgress: () => void;
}

export (...args: unknown[]) => unknown PlanFooter({ loading, onUpdateProgress }: PlanFooterProps) {
  return (
    <CardFooter>
      <Button 
        onClick={onUpdateProgress} 
        variant="outline" 
        className="w-full"
        disabled={loading}
      >
        {loading ? (
          <>
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
            Actualizando progreso...
          </>
        ) : (
          "Actualizar progreso"
        )}
      </Button>
    </CardFooter>
  );
}


