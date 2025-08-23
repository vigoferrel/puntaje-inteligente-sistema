/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useNavigate } from 'react-router-dom';

interface LectoGuiaEmergencyModeProps {
  error?: string;
  onRetry?: () => void;
}

export const LectoGuiaEmergencyMode: FC<LectoGuiaEmergencyModeProps> = ({
  error = "Sistema temporalmente no disponible",
  onRetry
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="bg-white/10 border-white/20 backdrop-blur-xl">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-orange-400" />
            </div>
            <CardTitle className="text-xl text-white">Modo de Emergencia</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <p className="text-white/70 mb-4">{error}</p>
              <p className="text-sm text-white/60">
                LectoGuÃ­a estÃ¡ funcionando en modo simplificado. Algunas funciones pueden estar limitadas.
              </p>
            </div>

            <div className="space-y-3">
              {onRetry && (
                <Button 
                  onClick={onRetry}
                  className="w-full"
                  variant="default"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reintentar ConexiÃ³n
                </Button>
              )}
              
              <Button 
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-white/20 text-white hover:bg-white/10"
              >
                <Home className="w-4 h-4 mr-2" />
                Volver al Dashboard
              </Button>
            </div>

            {/* Funciones bÃ¡sicas disponibles */}
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium text-white mb-3">Funciones Disponibles:</h4>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="w-3 h-3" />
                    Chat bÃ¡sico de ayuda
                  </div>
                  <div className="flex items-center gap-2">
                    <RefreshCw className="w-3 h-3" />
                    NavegaciÃ³n entre mÃ³dulos
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center">
              <p className="text-xs text-white/50">
                Si el problema persiste, contacta al soporte tÃ©cnico
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

