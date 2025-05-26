
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, User, Brain, Bell, Palette, Monitor, 
  Target, Shield, Database, Zap
} from 'lucide-react';

const settingsSections = [
  {
    id: 'profile',
    title: 'Perfil y Objetivos',
    icon: User,
    color: 'from-blue-600 to-cyan-600'
  },
  {
    id: 'ai',
    title: 'Configuración IA',
    icon: Brain,
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'notifications',
    title: 'Notificaciones',
    icon: Bell,
    color: 'from-green-600 to-emerald-600'
  },
  {
    id: 'appearance',
    title: 'Apariencia',
    icon: Palette,
    color: 'from-orange-600 to-red-600'
  },
  {
    id: 'privacy',
    title: 'Privacidad',
    icon: Shield,
    color: 'from-gray-600 to-slate-600'
  }
];

export const AdvancedSettings: React.FC = () => {
  const [activeSection, setActiveSection] = useState('profile');
  const [settings, setSettings] = useState({
    profile: {
      targetScore: 650,
      studyGoal: 'university',
      region: 'metropolitana',
      preferredSubjects: ['matematica-m1', 'competencia-lectora']
    },
    ai: {
      adaptiveMode: true,
      aiAssistanceLevel: 70,
      exerciseDifficulty: 'adaptive',
      predictiveAnalysis: true
    },
    notifications: {
      studyReminders: true,
      progressUpdates: true,
      exerciseNotifications: false,
      emailReports: true
    },
    appearance: {
      cinematicMode: true,
      theme: 'dark',
      animations: true,
      particleEffects: true
    },
    privacy: {
      dataSharing: false,
      analyticsOptIn: true,
      personalizedContent: true
    }
  });

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="text-white text-sm font-medium mb-3 block">
          Puntaje PAES Objetivo: {settings.profile.targetScore}
        </label>
        <Slider
          value={[settings.profile.targetScore]}
          onValueChange={(value) => updateSetting('profile', 'targetScore', value[0])}
          max={850}
          min={450}
          step={10}
          className="w-full"
        />
      </div>
      
      <div>
        <label className="text-white text-sm font-medium mb-2 block">
          Objetivo Principal
        </label>
        <Select 
          value={settings.profile.studyGoal} 
          onValueChange={(value) => updateSetting('profile', 'studyGoal', value)}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="university">Ingreso a Universidad</SelectItem>
            <SelectItem value="scholarship">Obtener Beca</SelectItem>
            <SelectItem value="improvement">Mejorar Puntaje</SelectItem>
            <SelectItem value="practice">Práctica General</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <label className="text-white text-sm font-medium mb-2 block">
          Región
        </label>
        <Select 
          value={settings.profile.region} 
          onValueChange={(value) => updateSetting('profile', 'region', value)}
        >
          <SelectTrigger className="bg-white/10 border-white/20 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="metropolitana">Región Metropolitana</SelectItem>
            <SelectItem value="valparaiso">Valparaíso</SelectItem>
            <SelectItem value="biobio">Biobío</SelectItem>
            <SelectItem value="otras">Otras Regiones</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const renderAISettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Modo Adaptativo</h4>
          <p className="text-white/60 text-sm">IA ajusta automáticamente la dificultad</p>
        </div>
        <Switch
          checked={settings.ai.adaptiveMode}
          onCheckedChange={(checked) => updateSetting('ai', 'adaptiveMode', checked)}
        />
      </div>
      
      <div>
        <label className="text-white text-sm font-medium mb-3 block">
          Nivel de Asistencia IA: {settings.ai.aiAssistanceLevel}%
        </label>
        <Slider
          value={[settings.ai.aiAssistanceLevel]}
          onValueChange={(value) => updateSetting('ai', 'aiAssistanceLevel', value[0])}
          max={100}
          min={0}
          step={5}
          className="w-full"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Análisis Predictivo</h4>
          <p className="text-white/60 text-sm">Predicciones de rendimiento futuro</p>
        </div>
        <Switch
          checked={settings.ai.predictiveAnalysis}
          onCheckedChange={(checked) => updateSetting('ai', 'predictiveAnalysis', checked)}
        />
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Recordatorios de Estudio</h4>
          <p className="text-white/60 text-sm">Notificaciones diarias de estudio</p>
        </div>
        <Switch
          checked={settings.notifications.studyReminders}
          onCheckedChange={(checked) => updateSetting('notifications', 'studyReminders', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Actualizaciones de Progreso</h4>
          <p className="text-white/60 text-sm">Notificaciones de logros y avances</p>
        </div>
        <Switch
          checked={settings.notifications.progressUpdates}
          onCheckedChange={(checked) => updateSetting('notifications', 'progressUpdates', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Reportes por Email</h4>
          <p className="text-white/60 text-sm">Informes semanales de rendimiento</p>
        </div>
        <Switch
          checked={settings.notifications.emailReports}
          onCheckedChange={(checked) => updateSetting('notifications', 'emailReports', checked)}
        />
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Modo Cinematográfico</h4>
          <p className="text-white/60 text-sm">Interfaz inmersiva con efectos visuales</p>
        </div>
        <Switch
          checked={settings.appearance.cinematicMode}
          onCheckedChange={(checked) => updateSetting('appearance', 'cinematicMode', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Animaciones</h4>
          <p className="text-white/60 text-sm">Transiciones y efectos animados</p>
        </div>
        <Switch
          checked={settings.appearance.animations}
          onCheckedChange={(checked) => updateSetting('appearance', 'animations', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Efectos de Partículas</h4>
          <p className="text-white/60 text-sm">Partículas de fondo dinámicas</p>
        </div>
        <Switch
          checked={settings.appearance.particleEffects}
          onCheckedChange={(checked) => updateSetting('appearance', 'particleEffects', checked)}
        />
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Compartir Datos Anónimos</h4>
          <p className="text-white/60 text-sm">Ayuda a mejorar el sistema</p>
        </div>
        <Switch
          checked={settings.privacy.dataSharing}
          onCheckedChange={(checked) => updateSetting('privacy', 'dataSharing', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Analytics Opcionales</h4>
          <p className="text-white/60 text-sm">Métricas de uso para optimización</p>
        </div>
        <Switch
          checked={settings.privacy.analyticsOptIn}
          onCheckedChange={(checked) => updateSetting('privacy', 'analyticsOptIn', checked)}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-white font-medium">Contenido Personalizado</h4>
          <p className="text-white/60 text-sm">Recomendaciones basadas en tu progreso</p>
        </div>
        <Switch
          checked={settings.privacy.personalizedContent}
          onCheckedChange={(checked) => updateSetting('privacy', 'personalizedContent', checked)}
        />
      </div>
    </div>
  );

  const renderActiveSettings = () => {
    switch (activeSection) {
      case 'profile':
        return renderProfileSettings();
      case 'ai':
        return renderAISettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'privacy':
        return renderPrivacySettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto space-y-8"
        >
          {/* Header */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-gray-600 to-slate-600 flex items-center justify-center">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-white text-3xl">Configuración Avanzada</CardTitle>
                    <p className="text-gray-200 text-lg">
                      Personaliza tu experiencia de aprendizaje
                    </p>
                  </div>
                </div>
                
                <Badge className="bg-green-600 text-white">
                  Sistema Activo
                </Badge>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Settings Navigation */}
            <div className="space-y-2">
              {settingsSections.map((section, index) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-300 ${
                        isActive 
                          ? `bg-gradient-to-r ${section.color}/30 border-white/40` 
                          : 'bg-black/20 border-white/10 hover:border-white/30'
                      }`}
                      onClick={() => setActiveSection(section.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${section.color} flex items-center justify-center`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-white font-medium">{section.title}</h3>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-black/40 backdrop-blur-xl border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">
                      {settingsSections.find(s => s.id === activeSection)?.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {renderActiveSettings()}
                    
                    <div className="flex justify-end pt-6 border-t border-white/20">
                      <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:opacity-90">
                        Guardar Cambios
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};
