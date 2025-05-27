
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Settings, Shield, Clock, Lock, Key, Users } from 'lucide-react';

interface AuthSettings {
  otpExpirySeconds: number;
  passwordMinLength: number;
  requireSpecialChars: boolean;
  enableBreachedPasswordDetection: boolean;
  enableEmailConfirmation: boolean;
  sessionTimeoutHours: number;
  maxLoginAttempts: number;
  enableMFA: boolean;
}

export const AuthConfigurationPanel: React.FC = () => {
  const [settings, setSettings] = useState<AuthSettings>({
    otpExpirySeconds: 3600, // 1 hora por defecto
    passwordMinLength: 8,
    requireSpecialChars: true,
    enableBreachedPasswordDetection: true,
    enableEmailConfirmation: false, // Deshabilitado para desarrollo
    sessionTimeoutHours: 24,
    maxLoginAttempts: 5,
    enableMFA: false
  });

  const [isApplying, setIsApplying] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const handleSettingChange = (key: keyof AuthSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const applyAuthConfiguration = async () => {
    setIsApplying(true);
    try {
      // Simular aplicación de configuraciones
      // En un entorno real, esto se conectaría con Supabase Auth Config
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setLastUpdated(new Date());
      console.log('🔐 Configuraciones de autenticación aplicadas:', settings);
      
    } catch (error) {
      console.error('Error aplicando configuraciones:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const getSecurityLevel = () => {
    let score = 0;
    if (settings.passwordMinLength >= 8) score += 20;
    if (settings.requireSpecialChars) score += 20;
    if (settings.enableBreachedPasswordDetection) score += 20;
    if (settings.enableMFA) score += 25;
    if (settings.maxLoginAttempts <= 5) score += 15;
    
    if (score >= 80) return { level: 'Alto', color: 'text-green-400', bg: 'bg-green-500' };
    if (score >= 60) return { level: 'Medio', color: 'text-yellow-400', bg: 'bg-yellow-500' };
    return { level: 'Bajo', color: 'text-red-400', bg: 'bg-red-500' };
  };

  const securityLevel = getSecurityLevel();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Settings className="w-6 h-6 text-blue-400" />
          <h2 className="text-2xl font-bold text-white">Panel de Configuración de Autenticación</h2>
        </div>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-white font-semibold ${securityLevel.bg}`}>
          <Shield className="w-4 h-4" />
          <span>Nivel de Seguridad: {securityLevel.level}</span>
        </div>
      </motion.div>

      {/* Configuraciones de Seguridad */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuraciones de Password */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-400" />
              Políticas de Contraseña
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Longitud Mínima de Contraseña
              </label>
              <select
                value={settings.passwordMinLength}
                onChange={(e) => handleSettingChange('passwordMinLength', parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
              >
                <option value={6}>6 caracteres</option>
                <option value={8}>8 caracteres (Recomendado)</option>
                <option value={12}>12 caracteres</option>
                <option value={16}>16 caracteres</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Requerir Caracteres Especiales</span>
              <Switch
                checked={settings.requireSpecialChars}
                onCheckedChange={(checked) => handleSettingChange('requireSpecialChars', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Detección de Contraseñas Comprometidas</span>
              <Switch
                checked={settings.enableBreachedPasswordDetection}
                onCheckedChange={(checked) => handleSettingChange('enableBreachedPasswordDetection', checked)}
              />
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Máximo Intentos de Login
              </label>
              <select
                value={settings.maxLoginAttempts}
                onChange={(e) => handleSettingChange('maxLoginAttempts', parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
              >
                <option value={3}>3 intentos</option>
                <option value={5}>5 intentos (Recomendado)</option>
                <option value={10}>10 intentos</option>
                <option value={-1}>Ilimitados (No Recomendado)</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Configuraciones de Sesión */}
        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Gestión de Sesiones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Expiración de OTP (segundos)
              </label>
              <select
                value={settings.otpExpirySeconds}
                onChange={(e) => handleSettingChange('otpExpirySeconds', parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
              >
                <option value={300}>5 minutos</option>
                <option value={900}>15 minutos</option>
                <option value={1800}>30 minutos</option>
                <option value={3600}>1 hora (Recomendado)</option>
                <option value={7200}>2 horas</option>
              </select>
            </div>

            <div>
              <label className="text-white text-sm font-medium mb-2 block">
                Timeout de Sesión (horas)
              </label>
              <select
                value={settings.sessionTimeoutHours}
                onChange={(e) => handleSettingChange('sessionTimeoutHours', parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white rounded-lg p-2 border border-gray-600"
              >
                <option value={1}>1 hora</option>
                <option value={8}>8 horas</option>
                <option value={24}>24 horas (Recomendado)</option>
                <option value={168}>1 semana</option>
                <option value={720}>1 mes</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Confirmación de Email (Desarrollo)</span>
              <Switch
                checked={settings.enableEmailConfirmation}
                onCheckedChange={(checked) => handleSettingChange('enableEmailConfirmation', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-white text-sm">Autenticación Multi-Factor (MFA)</span>
              <Switch
                checked={settings.enableMFA}
                onCheckedChange={(checked) => handleSettingChange('enableMFA', checked)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert de Desarrollo */}
      <Alert className="bg-yellow-900/30 border-yellow-500/50">
        <AlertDescription className="text-yellow-200">
          💡 <strong>Modo Desarrollo:</strong> La confirmación de email está deshabilitada por defecto para facilitar las pruebas. 
          Habilítala en producción para mayor seguridad.
        </AlertDescription>
      </Alert>

      {/* Botón de Aplicar */}
      <div className="flex justify-center">
        <Button
          onClick={applyAuthConfiguration}
          disabled={isApplying}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3"
        >
          {isApplying ? (
            <>
              <Settings className="w-4 h-4 mr-2 animate-spin" />
              Aplicando Configuración...
            </>
          ) : (
            <>
              <Shield className="w-4 h-4 mr-2" />
              Aplicar Configuración de Seguridad
            </>
          )}
        </Button>
      </div>

      {lastUpdated && (
        <p className="text-center text-gray-400 text-sm">
          Última actualización: {lastUpdated.toLocaleString()}
        </p>
      )}

      {/* Resumen de Configuración */}
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            Resumen de Configuración Actual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <Key className="w-6 h-6 text-cyan-400 mx-auto mb-1" />
              <p className="text-white font-semibold">Contraseña</p>
              <p className="text-gray-300">{settings.passwordMinLength}+ chars</p>
            </div>
            <div className="text-center">
              <Clock className="w-6 h-6 text-green-400 mx-auto mb-1" />
              <p className="text-white font-semibold">OTP Expiry</p>
              <p className="text-gray-300">{settings.otpExpirySeconds / 60} min</p>
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 text-blue-400 mx-auto mb-1" />
              <p className="text-white font-semibold">Max Intentos</p>
              <p className="text-gray-300">{settings.maxLoginAttempts}</p>
            </div>
            <div className="text-center">
              <Users className="w-6 h-6 text-purple-400 mx-auto mb-1" />
              <p className="text-white font-semibold">Sesión</p>
              <p className="text-gray-300">{settings.sessionTimeoutHours}h</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
