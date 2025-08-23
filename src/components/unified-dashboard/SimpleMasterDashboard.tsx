import React from 'react';

interface SimpleMasterDashboardProps {
  userId: string;
}

const SimpleMasterDashboard: React.FC<SimpleMasterDashboardProps> = ({ userId }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">🚀 Sistema PAES Inteligente</h1>
        <p className="text-lg">Dashboard Principal - Usuario: {userId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* IA Recomendaciones */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white mr-3">
              🧠
            </div>
            <h2 className="text-xl font-semibold">IA Recomendaciones</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sistema de recomendaciones inteligentes basado en tu progreso
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium">📚 Revisar Álgebra Lineal</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Confianza: 85%</p>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium">🔬 Práctica de Química</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Confianza: 92%</p>
            </div>
          </div>
        </div>

        {/* Gamificación Simplificada */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white mr-3">
              🏆
            </div>
            <h2 className="text-xl font-semibold">Gamificación</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Sistema de logros y recompensas
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Nivel:</span>
              <span className="font-bold text-purple-600">5</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Puntos:</span>
              <span className="font-bold text-yellow-600">2,850</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Logros:</span>
              <span className="font-bold text-green-600">12/25</span>
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-teal-600 rounded-lg text-white mr-3">
              📊
            </div>
            <h2 className="text-xl font-semibold">Analytics</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Métricas en tiempo real
          </p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Sesiones Hoy:</span>
              <span className="font-bold text-green-600">3</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Tiempo Total:</span>
              <span className="font-bold text-blue-600">2h 45m</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Precisión:</span>
              <span className="font-bold text-purple-600">85%</span>
            </div>
          </div>
        </div>

        {/* Spotify Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-green-600 to-green-700 rounded-lg text-white mr-3">
              🎵
            </div>
            <h2 className="text-xl font-semibold">Música de Estudio</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Playlists optimizadas para concentración
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium">🎧 Lo-Fi Study Beats</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Reproduciendo</p>
            </div>
          </div>
        </div>

        {/* 3D Dashboard */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg text-white mr-3">
              🌐
            </div>
            <h2 className="text-xl font-semibold">Dashboard 3D</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Visualización holográfica de datos
          </p>
          <div className="space-y-2">
            <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg">
              <p className="text-sm font-medium">🔮 Modo Holográfico</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Activo</p>
            </div>
          </div>
        </div>

        {/* Navegación Rápida */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white mr-3">
              🧭
            </div>
            <h2 className="text-xl font-semibold">Navegación</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Accesos rápidos a funcionalidades
          </p>
          <div className="space-y-2">
            <button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm">
              🎯 PAES Universe
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm">
              📚 LectoGuía
            </button>
            <button className="w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm">
              💰 Centro Financiero
            </button>
          </div>
        </div>
      </div>

      {/* Sistema Status */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold mb-4">🚀 Estado del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl mb-2">✅</div>
            <p className="text-sm font-medium">Sistema Neural</p>
            <p className="text-xs text-green-600">Operativo</p>
          </div>
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl mb-2">🔄</div>
            <p className="text-sm font-medium">Sincronización</p>
            <p className="text-xs text-blue-600">Activa</p>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl mb-2">🎯</div>
            <p className="text-sm font-medium">IA Engine</p>
            <p className="text-xs text-purple-600">Optimizado</p>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm font-medium">Performance</p>
            <p className="text-xs text-orange-600">Excelente</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMasterDashboard;
