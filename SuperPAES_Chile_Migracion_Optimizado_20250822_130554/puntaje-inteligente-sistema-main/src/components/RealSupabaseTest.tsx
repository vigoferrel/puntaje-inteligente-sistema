/**
 * COMPONENTE PARA PROBAR CONEXIÓN REAL A SUPABASE
 * Prueba todas las funcionalidades reales y conecta con OpenRouter
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
  data?: any;
}

export const RealSupabaseTest: React.FC = () => {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'testing' | 'completed'>('idle');

  const updateTest = (name: string, status: TestResult['status'], message: string, data?: any) => {
    setTests(prev => {
      const existingIndex = prev.findIndex(t => t.name === name);
      const newTest = { name, status, message, data };
      
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newTest;
        return updated;
      } else {
        return [...prev, newTest];
      }
    });
  };

  const addTest = (name: string) => {
    updateTest(name, 'pending', 'Ejecutando...');
  };

  const testSupabaseConnection = async () => {
    addTest('Conexión Básica');
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      updateTest('Conexión Básica', 'success', '✅ Conectado a Supabase correctamente');
    } catch (error) {
      updateTest('Conexión Básica', 'error', `❌ Error: ${error.message}`);
    }
  };

  const testOpenRouterEdgeFunction = async () => {
    addTest('OpenRouter Edge Function');
    try {
      const { data, error } = await supabase.functions.invoke('openrouter-ai', {
        body: {
          action: 'health_check',
          payload: {}
        }
      });

      if (error) {
        updateTest('OpenRouter Edge Function', 'error', `❌ ${error.message}`);
      } else {
        updateTest('OpenRouter Edge Function', 'success', '✅ Edge Function responde', data);
      }
    } catch (error) {
      updateTest('OpenRouter Edge Function', 'error', `❌ Error: ${error.message}`);
    }
  };

  const testRealAIGeneration = async () => {
    addTest('Generación Real de IA');
    try {
      const { data, error } = await supabase.functions.invoke('openrouter-ai', {
        body: {
          action: 'generate_exercise',
          payload: {
            prompt: 'Genera un ejercicio de matemáticas básico sobre ecuaciones lineales para PAES',
            subject: 'matematicas',
            difficulty: 'basico',
            requestId: `test_${Date.now()}`
          }
        }
      });

      if (error) {
        updateTest('Generación Real de IA', 'error', `❌ ${error.message}`);
      } else {
        // Verificar si es respuesta real o template
        const response = data?.result?.response || data?.result || '';
        const isTemplate = response.includes('VIGOLEONROCKS Quantum-Cognitive Response:');
        
        if (isTemplate) {
          updateTest('Generación Real de IA', 'error', '⚠️ Usando template, no LLM real', data);
        } else {
          updateTest('Generación Real de IA', 'success', '🎉 LLM real funcionando!', data);
        }
      }
    } catch (error) {
      updateTest('Generación Real de IA', 'error', `❌ Error: ${error.message}`);
    }
  };

  const testRPCFunction = async () => {
    addTest('RPC vigoleonrocks_inference');
    try {
      const { data, error } = await supabase.rpc('vigoleonrocks_inference', {
        prompt: 'Explica qué es una ecuación lineal'
      });

      if (error) {
        updateTest('RPC vigoleonrocks_inference', 'error', `❌ ${error.message}`);
      } else {
        const isTemplate = data?.response?.includes('VIGOLEONROCKS Quantum-Cognitive Response:') || 
                          typeof data === 'string' && data.includes('VIGOLEONROCKS Quantum-Cognitive Response:');
        
        if (isTemplate) {
          updateTest('RPC vigoleonrocks_inference', 'error', '⚠️ Función RPC usa template, no LLM real', data);
        } else {
          updateTest('RPC vigoleonrocks_inference', 'success', '✅ RPC funcionando', data);
        }
      }
    } catch (error) {
      updateTest('RPC vigoleonrocks_inference', 'error', `❌ Error: ${error.message}`);
    }
  };

  const testDatabaseTables = async () => {
    addTest('Explorar Tablas');
    
    const tablesToTest = [
      'users', 'profiles', 'student_profiles', 'diagnostics',
      'ai_interactions', 'study_activities', 'achievements'
    ];

    let existingTables: string[] = [];

    for (const tableName of tablesToTest) {
      try {
        const { data, error, count } = await supabase
          .from(tableName)
          .select('*', { count: 'exact' })
          .limit(1);

        if (!error) {
          existingTables.push(`${tableName} (${count || 0} registros)`);
        }
      } catch (error) {
        // Tabla no existe o sin acceso
      }
    }

    if (existingTables.length > 0) {
      updateTest('Explorar Tablas', 'success', `✅ ${existingTables.length} tablas encontradas`, existingTables);
    } else {
      updateTest('Explorar Tablas', 'error', '❌ No se encontraron tablas accesibles');
    }
  };

  const testInsertData = async () => {
    addTest('Insertar Datos de Prueba');
    try {
      // Intentar insertar en una tabla de test o crear registro
      const testData = {
        test_id: `test_${Date.now()}`,
        student_id: 'test_student',
        request_type: 'test',
        created_at: new Date().toISOString()
      };

      // Intentar diferentes tablas donde podríamos insertar
      let inserted = false;
      const tablesToTry = ['ai_interactions', 'study_activities', 'test_logs'];

      for (const table of tablesToTry) {
        try {
          const { data, error } = await supabase.from(table).insert(testData);
          if (!error) {
            updateTest('Insertar Datos de Prueba', 'success', `✅ Datos insertados en ${table}`, data);
            inserted = true;
            break;
          }
        } catch (e) {
          // Continuar con siguiente tabla
        }
      }

      if (!inserted) {
        updateTest('Insertar Datos de Prueba', 'error', '⚠️ No se pudo insertar en tablas disponibles');
      }
    } catch (error) {
      updateTest('Insertar Datos de Prueba', 'error', `❌ Error: ${error.message}`);
    }
  };

  const runAllTests = async () => {
    setIsLoading(true);
    setOverallStatus('testing');
    setTests([]);

    console.log('🚀 Iniciando pruebas reales de Supabase...');

    try {
      await testSupabaseConnection();
      await new Promise(resolve => setTimeout(resolve, 500)); // Pausa breve

      await testDatabaseTables();
      await new Promise(resolve => setTimeout(resolve, 500));

      await testOpenRouterEdgeFunction();
      await new Promise(resolve => setTimeout(resolve, 500));

      await testRPCFunction();
      await new Promise(resolve => setTimeout(resolve, 500));

      await testRealAIGeneration();
      await new Promise(resolve => setTimeout(resolve, 500));

      await testInsertData();

    } catch (error) {
      console.error('Error durante pruebas:', error);
    }

    setIsLoading(false);
    setOverallStatus('completed');
    console.log('✅ Pruebas completadas');
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'pending': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'pending': return '⏳';
      default: return '⚪';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          🔗 Test Real de Conexión Supabase + OpenRouter
        </h2>

        <div className="mb-6">
          <button
            onClick={runAllTests}
            disabled={isLoading}
            className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? '🔄 Ejecutando Pruebas...' : '🚀 Ejecutar Pruebas Reales'}
          </button>
        </div>

        {tests.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">Resultados de Pruebas:</h3>
            
            {tests.map((test, index) => (
              <div key={index} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">
                    {getStatusIcon(test.status)} {test.name}
                  </h4>
                  <span className={`font-semibold ${getStatusColor(test.status)}`}>
                    {test.status.toUpperCase()}
                  </span>
                </div>
                
                <p className={`text-sm ${getStatusColor(test.status)} mb-2`}>
                  {test.message}
                </p>

                {test.data && (
                  <details className="mt-2">
                    <summary className="text-xs text-gray-500 cursor-pointer">
                      Ver datos de respuesta
                    </summary>
                    <pre className="text-xs bg-gray-100 p-2 rounded mt-2 overflow-x-auto">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            ))}
          </div>
        )}

        {overallStatus === 'completed' && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">📊 Resumen de Pruebas:</h3>
            <div className="text-sm text-blue-700">
              <p>✅ Exitosas: {tests.filter(t => t.status === 'success').length}</p>
              <p>❌ Fallidas: {tests.filter(t => t.status === 'error').length}</p>
              <p>⏳ Pendientes: {tests.filter(t => t.status === 'pending').length}</p>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <p><strong>URL Supabase:</strong> https://settifboilityelprvjd.supabase.co</p>
          <p><strong>Objetivo:</strong> Verificar funcionalidad real vs simulaciones</p>
        </div>
      </div>
    </div>
  );
};

export default RealSupabaseTest;
