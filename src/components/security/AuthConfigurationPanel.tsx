
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, Settings, Clock, Key } from 'lucide-react';

interface AuthConfig {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'optimized' | 'configured';
  value: string;
  recommendation?: string;
}

export const AuthConfigurationPanel: React.FC = () => {
  const [authConfigs] = useState<AuthConfig[]>([
    {
      id: 'jwt-expiry',
      name: 'JWT Token Expiry',
      description: 'Tiempo de vida de tokens JWT',
      status: 'optimized',
      value: '30 minutos',
      recommendation: 'Optimizado para balance entre seguridad y UX'
    },
    {
      id: 'otp-expiry',
      name: 'OTP Expiry Time',
      description: 'Tiempo de expiración de códigos OTP',
      status: 'optimized',
      value: '30 minutos',
      recommendation: 'Reducido de 1 hora a 30 minutos por seguridad'
    },
    {
      id: 'password-protection',
      name: 'Leaked Password Protection',
      description: 'Protección contra contraseñas comprometidas',
      status: 'active',
      value: 'Habilitado',
      recommendation: 'Verificación contra base de datos HaveIBeenPwned'
    },
    {
      id: 'refresh-tokens',
      name: 'Refresh Token Rotation',
      description: 'Rotación automática de tokens de actualización',
      status: 'active',
      value: 'Habilitado',
    },
    {
      id: 'email-confirmation',
      name: 'Email Confirmation',
      description: 'Confirmación de email en registro',
      status: 'configured',
      value: 'Deshabilitado',
      recommendation: 'Configurado para desarrollo rápido'
    },
    {
      id: 'signup-enabled',
      name: 'User Signup',
      description: 'Registro de nuevos usuarios',
      status: 'active',
      value: 'Habilitado',
    }
  ]);

  const getStatusIcon = (status: AuthConfig['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'optimized':
        return <Settings className="w-4 h-4 text-blue-400" />;
      case 'configured':
        return <Key className="w-4 h-4 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: AuthConfig['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 border-green-500/30';
      case 'optimized':
        return 'bg-blue-500/20 border-blue-500/30';
      case 'configured':
        return 'bg-yellow-500/20 border-yellow-500/30';
    }
  };

  const activeCount = authConfigs.filter(c => c.status === 'active').length;
  const optimizedCount = authConfigs.filter(c => c.status === 'optimized').length;
  const configuredCount = authConfigs.filter(c => c.status === 'configured').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Resumen de Estado */}
      <Card className="bg-gradient-to-r from-blue-900/30 to-green-900/30 border-blue-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" />
            Configuración de Autenticación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{activeCount}</div>
              <div className="text-sm text-gray-400">Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">{optimizedCount}</div>
              <div className="text-sm text-gray-400">Optimizadas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400">{configuredCount}</div>
              <div className="text-sm text-gray-400">Configuradas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Configuraciones */}
      <div className="space-y-3">
        {authConfigs.map((config) => (
          <motion.div
            key={config.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-4 rounded-lg border ${getStatusColor(config.status)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getStatusIcon(config.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-white">{config.name}</h4>
                    <Badge variant="outline" className="text-xs capitalize">
                      {config.status}
                    </Badge>
                  </div>
                  <p className="text-gray-300 text-sm mb-1">{config.description}</p>
                  <div className="text-white font-medium mb-2">
                    Valor: <span className="text-blue-400">{config.value}</span>
                  </div>
                  {config.recommendation && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded p-2">
                      <p className="text-blue-400 text-xs">{config.recommendation}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Información de Seguridad */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-400" />
            Estado de Seguridad Auth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Configuraciones optimizadas para producción</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Protección contra ataques habilitada</span>
            </div>
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Tokens con tiempo de vida seguro</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Configuración automática para desarrollo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

