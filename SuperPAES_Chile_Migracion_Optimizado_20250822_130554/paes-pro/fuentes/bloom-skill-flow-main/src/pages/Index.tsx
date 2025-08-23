import React, { useEffect, useState } from 'react';
import { WidgetBootstrapper } from '../widget-core/WidgetBootstrapper';
import HeroSection from '../components/HeroSection';
import ProblemStorytelling from '../components/ProblemStorytelling';
import BloomScienceExplanation from '../components/BloomScienceExplanation';

const Index = () => {
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [demoResults, setDemoResults] = useState<any>(null);

  useEffect(() => {
    // Initialize the widget when component mounts
    const initWidget = async () => {
      try {
        const id = await (window as any).SkillnestBloomWidget.init({
          container: '#demo-widget-container',
          techDomain: 'javascript',
          theme: 'default',
          onComplete: (results: any) => {
            console.log('Assessment completed:', results);
            setDemoResults(results);
          },
          onProgress: (progress: any) => {
            console.log('Progress:', progress);
          },
          customBranding: false
        });
        setWidgetId(id);
      } catch (error) {
        console.error('Failed to initialize widget:', error);
      }
    };

    // Small delay to ensure widget script is loaded
    setTimeout(initWidget, 100);
  }, []);

  const handleResetDemo = () => {
    setDemoResults(null);
    if (widgetId) {
      (window as any).SkillnestBloomWidget.destroy(widgetId);
      setTimeout(async () => {
        const newId = await (window as any).SkillnestBloomWidget.init({
          container: '#demo-widget-container',
          techDomain: 'javascript',
          theme: 'default',
          onComplete: setDemoResults,
          customBranding: false
        });
        setWidgetId(newId);
      }, 100);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section Revolucionario */}
      <HeroSection />

      {/* Storytelling del Problema */}
      <ProblemStorytelling />

      {/* Explicación de la Ciencia Bloom */}
      <BloomScienceExplanation />

      {/* Demo Widget Section - Mantenemos la funcionalidad existente */}
      <section className="py-20 bg-gradient-to-br from-skillnest-blue-50 via-white to-skillnest-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Experimenta el Widget en Acción
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Prueba la primera evaluación cognitiva Bloom para habilidades técnicas. 
                Este es el widget real que puede embeberse en cualquier website.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-xl p-8 border border-skillnest-blue-100">
              <h3 className="text-2xl font-bold text-center mb-6 text-skillnest-blue-700">
                Demo Interactiva - JavaScript Bloom Assessment
              </h3>
              
              {/* Widget Container */}
              <div 
                id="demo-widget-container" 
                className="border-2 border-dashed border-skillnest-blue-200 rounded-lg min-h-[200px] flex items-center justify-center"
              >
                {!widgetId && (
                  <div className="text-center text-skillnest-blue-500">
                    <div className="animate-skillnest-spin rounded-full h-8 w-8 border-b-2 border-skillnest-blue-600 mx-auto mb-4"></div>
                    Cargando widget Skillnest...
                  </div>
                )}
              </div>

              {/* Demo Controls */}
              <div className="mt-6 flex justify-center gap-4">
                <button
                  onClick={handleResetDemo}
                  className="px-6 py-3 bg-skillnest-blue-500 text-white rounded-lg hover:bg-skillnest-blue-600 transition-colors font-medium shadow-md"
                >
                  Reiniciar Demo
                </button>
                <button
                  onClick={() => {
                    const code = `<div id="skillnest-bloom-widget"></div>
<script>
  (function() {
    const script = document.createElement('script');
    script.src = 'https://widget.skillnest.com/bloom-widget.js';
    script.async = true;
    script.onload = function() {
      SkillnestBloomWidget.init({
        container: '#skillnest-bloom-widget',
        techDomain: 'javascript',
        theme: 'default',
        onComplete: function(results) {
          console.log('Bloom Level:', results.bloomLevel);
          console.log('Learning Path:', results.learningPath);
        }
      });
    };
    document.head.appendChild(script);
  })();
</script>`;
                    navigator.clipboard.writeText(code);
                    alert('¡Código de embebido copiado al portapapeles!');
                  }}
                  className="px-6 py-3 bg-skillnest-green-500 text-white rounded-lg hover:bg-skillnest-green-600 transition-colors font-medium shadow-md"
                >
                  Copiar Código de Embebido
                </button>
              </div>
            </div>

            {/* Results Display */}
            {demoResults && (
              <div className="mt-8">
                <div className="bg-gradient-to-r from-skillnest-green-50 to-skillnest-blue-50 border border-skillnest-green-200 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-skillnest-green-800 mb-4 flex items-center">
                    <span className="mr-2">✅</span>
                    ¡Evaluación Cognitiva Completada!
                  </h3>
                  <div className="text-sm text-skillnest-green-700 space-y-2">
                    <p><strong>Nivel Bloom Detectado:</strong> L{demoResults.bloomLevel} - {demoResults.bloomLevel === 1 ? 'Recordar' : demoResults.bloomLevel === 2 ? 'Comprender' : demoResults.bloomLevel === 3 ? 'Aplicar' : demoResults.bloomLevel === 4 ? 'Analizar' : 'Evaluar'}</p>
                    <p><strong>Confianza del Análisis IA:</strong> {Math.round(demoResults.confidence * 100)}%</p>
                    <p><strong>Habilidades Cognitivas Fuertes:</strong> {demoResults.skillBreakdown.strong.join(', ') || 'Análisis en progreso'}</p>
                    <p><strong>Ruta de Aprendizaje Personalizada:</strong> {demoResults.recommendations[0] || 'Generando recomendaciones basadas en nivel cognitivo'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer con branding Skillnest - mantenemos el existente */}
      <div className="text-center mt-12 pt-8 border-t border-skillnest-blue-200">
        <div className="flex items-center justify-center mb-4">
          <div className="skillnest-icon mr-3">
            <div className="w-8 h-8 bg-gradient-to-r from-skillnest-blue-500 to-skillnest-green-500 rounded-lg flex items-center justify-center">
              <div className="space-y-0.5">
                <div className="w-4 h-0.5 bg-white rounded"></div>
                <div className="w-4 h-0.5 bg-white rounded"></div>
                <div className="w-4 h-0.5 bg-white rounded"></div>
              </div>
            </div>
          </div>
          <div className="text-xl font-bold text-skillnest-blue-600">Skillnest</div>
        </div>
        <p className="text-gray-600">
          Impulsando la formación y el desarrollo de habilidades en tecnología •
          <a href="mailto:hello@skillnest.com" className="text-skillnest-blue-600 hover:underline ml-1">
            hello@skillnest.com
          </a>
        </p>
        <p className="text-sm text-skillnest-blue-500 mt-2">
          es Coding Dojo Latam - Presente en +7 países - +5000 graduados
        </p>
      </div>
    </div>
  );
};

export default Index;
