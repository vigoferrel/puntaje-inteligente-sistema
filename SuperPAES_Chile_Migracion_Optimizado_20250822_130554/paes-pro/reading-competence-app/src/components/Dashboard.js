import React from 'react';
import { BarChart2, Target, Book, Award } from 'lucide-react';

const Dashboard = ({ resultadosDiagnostico }) => {
  const calcularProgreso = (habilidad) => {
    const niveles = {
      localizar: ['Inicial', 'En Desarrollo', 'Intermedio', 'Avanzado'],
      interpretar: ['Básico', 'Consolidando', 'Sólido', 'Experto'],
      evaluar: ['Principiante', 'Emergente', 'Competente', 'Maestro']
    };

    const getNivel = (puntaje) => {
      if (puntaje < 40) return 0;
      if (puntaje < 60) return 1;
      if (puntaje < 80) return 2;
      return 3;
    };

    return {
      puntaje: resultadosDiagnostico[habilidad],
      nivel: niveles[habilidad][getNivel(resultadosDiagnostico[habilidad])]
    };
  };

  const progresoLocalizar = calcularProgreso('localizar');
  const progresoInterpretar = calcularProgreso('interpretar');
  const progresoEvaluar = calcularProgreso('evaluar');

  const recomendacionesDiarias = [
    {
      icono: <Book className="text-blue-500" />,
      titulo: "Lectura diaria",
      descripcion: "30 minutos de lectura analítica"
    },
    {
      icono: <Target className="text-green-500" />,
      titulo: "Ejercicio de comprensión",
      descripcion: "Identificar ideas principales en textos variados"
    },
    {
      icono: <Award className="text-purple-500" />,
      titulo: "Desafío crítico",
      descripcion: "Analizar un artículo desde múltiples perspectivas"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-diagnostic-blue-700 mb-6 text-center">
        Panel de Desarrollo de Competencia Lectora
      </h1>

      {/* Resumen de Progreso */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="font-semibold text-diagnostic-blue-700 mb-2">
            Localizar
          </h3>
          <div className="flex justify-center items-center mb-4">
            <BarChart2 className="mr-2 text-diagnostic-blue-500" />
            <span className="text-2xl font-bold text-gray-800">
              {progresoLocalizar.puntaje}%
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Nivel: {progresoLocalizar.nivel}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="font-semibold text-diagnostic-green-700 mb-2">
            Interpretar
          </h3>
          <div className="flex justify-center items-center mb-4">
            <BarChart2 className="mr-2 text-diagnostic-green-500" />
            <span className="text-2xl font-bold text-gray-800">
              {progresoInterpretar.puntaje}%
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Nivel: {progresoInterpretar.nivel}
          </p>
        </div>

        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h3 className="font-semibold text-purple-700 mb-2">
            Evaluar
          </h3>
          <div className="flex justify-center items-center mb-4">
            <BarChart2 className="mr-2 text-purple-500" />
            <span className="text-2xl font-bold text-gray-800">
              {progresoEvaluar.puntaje}%
            </span>
          </div>
          <p className="text-sm text-gray-600">
            Nivel: {progresoEvaluar.nivel}
          </p>
        </div>
      </div>

      {/* Recomendaciones Diarias */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-diagnostic-blue-700 mb-6 text-center">
          Recomendaciones de Desarrollo
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {recomendacionesDiarias.map((recomendacion, index) => (
            <div 
              key={index} 
              className="bg-gray-50 p-4 rounded-lg text-center hover:shadow-md transition duration-300"
            >
              <div className="flex justify-center mb-4">
                {recomendacion.icono}
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">
                {recomendacion.titulo}
              </h3>
              <p className="text-sm text-gray-600">
                {recomendacion.descripcion}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Progreso Histórico */}
      <div className="mt-8 bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-diagnostic-blue-700 mb-6 text-center">
          Progreso Histórico
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <h3 className="font-semibold text-diagnostic-blue-700">
              Última Evaluación
            </h3>
            <p className="text-gray-600">
              {new Date().toLocaleDateString()}
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-diagnostic-green-700">
              Mejor Resultado
            </h3>
            <p className="text-gray-600">
              {Math.max(
                resultadosDiagnostico.localizar, 
                resultadosDiagnostico.interpretar, 
                resultadosDiagnostico.evaluar
              )}%
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-purple-700">
              Próxima Evaluación
            </h3>
            <p className="text-gray-600">
              {new Date(
                new Date().setMonth(new Date().getMonth() + 1)
              ).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
