import React from 'react';

export default function PAESNodesDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Nodos Educativos PAES - Dashboard Profesional
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Nodos Completados</h3>
            <p className="text-3xl font-bold text-blue-600">12/25</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Progreso General</h3>
            <p className="text-3xl font-bold text-green-600">67%</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Tiempo Total</h3>
            <p className="text-3xl font-bold text-purple-600">8.5h</p>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ejercicios</h3>
            <p className="text-3xl font-bold text-orange-600">284</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Nodos Educativos Disponibles</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Informacion Explicita</h3>
              <p className="text-sm text-gray-600 mb-2">CL-RL-01 - Competencia Lectora</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-green-500 h-2 rounded-full" style={{width: "100%"}}></div>
              </div>
              <p className="text-sm text-gray-600">Progreso: 100% - Completado</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Inferencias Simples</h3>
              <p className="text-sm text-gray-600 mb-2">CL-RL-02 - Competencia Lectora</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{width: "75%"}}></div>
              </div>
              <p className="text-sm text-gray-600">Progreso: 75% - En progreso</p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-2">Ecuaciones Lineales</h3>
              <p className="text-sm text-gray-600 mb-2">MM1-AL-01 - Matematica M1</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-gray-300 h-2 rounded-full" style={{width: "0%"}}></div>
              </div>
              <p className="text-sm text-gray-600">Progreso: 0% - Disponible</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
