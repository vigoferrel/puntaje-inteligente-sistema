import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ThemeCustomizer } from '@/components/theming/AdaptiveThemeSystem';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Configuración del Sistema
          </h1>
          <p className="text-gray-300">
            Personaliza tu experiencia PAES según tus preferencias
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Aquí iría el ThemeCustomizer y otras configuraciones */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Personalización de Temas
            </h2>
            <p className="text-gray-400">
              El personalizador de temas se abre como overlay. 
              Usa el botón de paleta en la esquina inferior izquierda.
            </p>
          </div>
          
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Configuraciones Avanzadas
            </h2>
            <p className="text-gray-400">
              Próximamente: Configuraciones detalladas del sistema.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
