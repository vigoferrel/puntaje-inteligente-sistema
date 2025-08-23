
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Zap, AlertTriangle, RefreshCw } from 'lucide-react';

interface EmergencyBypassProps {
  onBypass: () => void;
  onRetry: () => void;
  isLoading: boolean;
  loadingTime: number;
}

export const EmergencyBypass: React.FC<EmergencyBypassProps> = ({
  onBypass,
  onRetry,
  isLoading,
  loadingTime
}) => {
  const [showEmergencyButton, setShowEmergencyButton] = useState(false);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    if (loadingTime > 10000) {
      setShowEmergencyButton(true);
    }
  }, [loadingTime]);

  useEffect(() => {
    if (isLoading && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      setShowEmergencyButton(true);
    }
  }, [isLoading, countdown]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center z-50">
      <Card className="bg-white/10 border-white/20 backdrop-blur-lg max-w-md mx-4">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Brain className="w-12 h-12 text-blue-400 animate-pulse" />
          </div>
          <CardTitle className="text-white text-xl">
            Inicializando Sistema Neural
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-white/70 mb-4">
              Cargando LectoGuía IA y componentes neurales...
            </p>
            
            <div className="w-full bg-white/20 rounded-full h-2 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-400 to-cyan-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(90, (loadingTime / 10000) * 100)}%` }}
              />
            </div>
            
            <div className="text-sm text-white/60 space-y-1">
              <div className="flex items-center justify-center gap-2">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>Sistemas de almacenamiento: Activo</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Brain className="w-4 h-4 text-purple-400" />
                <span>Red neural interseccional: Inicializando</span>
              </div>
            </div>
          </div>

          {countdown > 0 && !showEmergencyButton && (
            <div className="text-center">
              <p className="text-white/60 text-sm">
                Modo emergencia disponible en {countdown}s
              </p>
            </div>
          )}

          {showEmergencyButton && (
            <div className="space-y-3">
              <Alert className="bg-yellow-500/20 border-yellow-500/30">
                <AlertTriangle className="h-4 w-4 text-yellow-400" />
                <AlertDescription className="text-yellow-100">
                  La inicialización está tomando más tiempo del esperado.
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Button
                  onClick={onBypass}
                  className="flex-1 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Forzar Carga
                </Button>
                
                <Button
                  onClick={onRetry}
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              
              <p className="text-xs text-white/50 text-center">
                El modo emergencia carga funcionalidades básicas
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
