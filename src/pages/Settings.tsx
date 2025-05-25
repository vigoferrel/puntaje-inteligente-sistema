
import React, { useState } from 'react';
import { AppLayout } from '@/components/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Shield, 
  Database,
  Zap,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  Mail,
  Smartphone,
  Clock,
  Target,
  Brain
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

const Settings: React.FC = () => {
  const { user, profile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<'profile' | 'notifications' | 'appearance' | 'privacy' | 'data'>('profile');

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      studyReminders: true,
      progressUpdates: true,
      weeklyReports: true
    },
    appearance: {
      cinematicMode: true,
      animations: true,
      soundEffects: false,
      compactView: false
    },
    privacy: {
      shareProgress: false,
      analyticsOptIn: true,
      personalizedAds: false
    },
    study: {
      autoSave: true,
      smartRecommendations: true,
      adaptiveDifficulty: true,
      timeTracking: true
    }
  });

  const updateSetting = (section: keyof typeof settings, key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const sections = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'notifications', label: 'Notificaciones', icon: Bell },
    { id: 'appearance', label: 'Apariencia', icon: Palette },
    { id: 'privacy', label: 'Privacidad', icon: Shield },
    { id: 'data', label: 'Datos', icon: Database }
  ];

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-500/20 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Configuración</h1>
              <p className="text-gray-400">Personaliza tu experiencia de aprendizaje</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700 sticky top-6">
              <CardContent className="p-4">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <Button
                      key={section.id}
                      onClick={() => setActiveSection(section.id as any)}
                      variant={activeSection === section.id ? 'default' : 'ghost'}
                      className={`
                        w-full justify-start ${activeSection === section.id 
                          ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                          : 'text-gray-300 hover:bg-gray-700'
                        }
                      `}
                    >
                      <section.icon className="w-4 h-4 mr-2" />
                      {section.label}
                    </Button>
                  ))}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {activeSection === 'profile' && (
                <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <User className="w-5 h-5 text-purple-400" />
                      Información del Perfil
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Email</label>
                        <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          <p className="text-white">{user?.email || 'No disponible'}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-400 mb-2 block">Usuario ID</label>
                        <div className="p-3 bg-gray-700/50 rounded-lg border border-gray-600">
                          <p className="text-white font-mono text-xs">{user?.id?.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="bg-gray-700" />
                    
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Estadísticas de Uso</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-gray-700/30 rounded-lg">
                          <div className="text-lg font-bold text-cyan-400">12</div>
                          <div className="text-sm text-gray-400">Días activos</div>
                        </div>
                        <div className="p-3 bg-gray-700/30 rounded-lg">
                          <div className="text-lg font-bold text-green-400">45</div>
                          <div className="text-sm text-gray-400">Nodos completados</div>
                        </div>
                        <div className="p-3 bg-gray-700/30 rounded-lg">
                          <div className="text-lg font-bold text-purple-400">180m</div>
                          <div className="text-sm text-gray-400">Tiempo de estudio</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'notifications' && (
                <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Bell className="w-5 h-5 text-blue-400" />
                      Configuración de Notificaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Notificaciones por Email
                      </h4>
                      <div className="space-y-3">
                        {[
                          { key: 'email', label: 'Recibir emails', description: 'Notificaciones generales por email' },
                          { key: 'studyReminders', label: 'Recordatorios de estudio', description: 'Te avisamos cuando es hora de estudiar' },
                          { key: 'progressUpdates', label: 'Actualizaciones de progreso', description: 'Resumen de tu avance semanal' },
                          { key: 'weeklyReports', label: 'Reportes semanales', description: 'Análisis detallado de tu desempeño' }
                        ].map((item) => (
                          <div key={item.key} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                            <div>
                              <div className="text-white font-medium">{item.label}</div>
                              <div className="text-sm text-gray-400">{item.description}</div>
                            </div>
                            <Switch
                              checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                              onCheckedChange={(checked) => updateSetting('notifications', item.key, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <Separator className="bg-gray-700" />

                    <div className="space-y-4">
                      <h4 className="text-white font-medium flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Notificaciones Push
                      </h4>
                      <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div>
                          <div className="text-white font-medium">Activar notificaciones push</div>
                          <div className="text-sm text-gray-400">Recibe notificaciones en tiempo real</div>
                        </div>
                        <Switch
                          checked={settings.notifications.push}
                          onCheckedChange={(checked) => updateSetting('notifications', 'push', checked)}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'appearance' && (
                <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Palette className="w-5 h-5 text-green-400" />
                      Configuración de Apariencia
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                          <div>
                            <div className="text-white font-medium">Tema</div>
                            <div className="text-sm text-gray-400">Modo {theme === 'dark' ? 'oscuro' : 'claro'}</div>
                          </div>
                        </div>
                        <Button onClick={toggleTheme} variant="outline" size="sm">
                          Cambiar
                        </Button>
                      </div>

                      {[
                        { key: 'cinematicMode', label: 'Modo Cinemático', description: 'Efectos visuales mejorados', icon: Zap },
                        { key: 'animations', label: 'Animaciones', description: 'Transiciones suaves', icon: Target },
                        { key: 'soundEffects', label: 'Efectos de sonido', description: 'Audio interactivo', icon: Volume2 },
                        { key: 'compactView', label: 'Vista compacta', description: 'Interfaz más densa', icon: Brain }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5 text-purple-400" />
                            <div>
                              <div className="text-white font-medium">{item.label}</div>
                              <div className="text-sm text-gray-400">{item.description}</div>
                            </div>
                          </div>
                          <Switch
                            checked={settings.appearance[item.key as keyof typeof settings.appearance]}
                            onCheckedChange={(checked) => updateSetting('appearance', item.key, checked)}
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {activeSection === 'privacy' && (
                <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-red-400" />
                      Privacidad y Seguridad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {[
                      { key: 'shareProgress', label: 'Compartir progreso', description: 'Permitir que otros vean tu avance' },
                      { key: 'analyticsOptIn', label: 'Análisis de uso', description: 'Ayudar a mejorar la plataforma' },
                      { key: 'personalizedAds', label: 'Anuncios personalizados', description: 'Mostrar contenido relevante' }
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                        <div>
                          <div className="text-white font-medium">{item.label}</div>
                          <div className="text-sm text-gray-400">{item.description}</div>
                        </div>
                        <Switch
                          checked={settings.privacy[item.key as keyof typeof settings.privacy]}
                          onCheckedChange={(checked) => updateSetting('privacy', item.key, checked)}
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {activeSection === 'data' && (
                <Card className="bg-gray-800/50 backdrop-blur-xl border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <Database className="w-5 h-5 text-cyan-400" />
                      Gestión de Datos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Configuración de Estudio</h4>
                      {[
                        { key: 'autoSave', label: 'Guardado automático', description: 'Guardar progreso continuamente' },
                        { key: 'smartRecommendations', label: 'Recomendaciones inteligentes', description: 'IA personalizada' },
                        { key: 'adaptiveDifficulty', label: 'Dificultad adaptativa', description: 'Ajuste automático de nivel' },
                        { key: 'timeTracking', label: 'Seguimiento de tiempo', description: 'Registrar tiempo de estudio' }
                      ].map((item) => (
                        <div key={item.key} className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                          <div>
                            <div className="text-white font-medium">{item.label}</div>
                            <div className="text-sm text-gray-400">{item.description}</div>
                          </div>
                          <Switch
                            checked={settings.study[item.key as keyof typeof settings.study]}
                            onCheckedChange={(checked) => updateSetting('study', item.key, checked)}
                          />
                        </div>
                      ))}
                    </div>

                    <Separator className="bg-gray-700" />

                    <div className="space-y-4">
                      <h4 className="text-white font-medium">Gestión de Datos</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          <Database className="w-4 h-4 mr-2" />
                          Exportar Datos
                        </Button>
                        <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                          <Shield className="w-4 h-4 mr-2" />
                          Eliminar Cuenta
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Settings;
