import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BookOpen,
  Calculator,
  Beaker,
  Globe,
  Zap,
  Star
} from 'lucide-react';
import { integratedSystemService } from '../../services/IntegratedSystemService';

interface DiagnosticResult {
  overall_score: number;
  detailed_scores: Record<string, number>;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  learning_path: string[];
  estimated_improvement_time: number;
  confidence_level: number;
}

const DiagnosticoSection: React.FC = () => {
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<'intro' | 'questions' | 'results'>('intro');

  const subjects = [
    { id: 'comp_lectora', name: 'Competencia Lectora', icon: <BookOpen className="w-5 h-5" />, color: 'text-blue-600' },
    { id: 'mat_m1', name: 'Matemática M1', icon: <Calculator className="w-5 h-5" />, color: 'text-green-600' },
    { id: 'mat_m2', name: 'Matemática M2', icon: <Calculator className="w-5 h-5" />, color: 'text-green-600' },
    { id: 'ciencias', name: 'Ciencias', icon: <Beaker className="w-5 h-5" />, color: 'text-purple-600' },
    { id: 'historia', name: 'Historia', icon: <Globe className="w-5 h-5" />, color: 'text-orange-600' }
  ];

  const performDiagnostic = async () => {
    setIsLoading(true);
    setCurrentStep('questions');
    
    try {
      // Simular proceso de diagnóstico
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const diagnosticData = {
        userId: 'user_001',
        timestamp: new Date().toISOString(),
        responses: {}
      };
      
      const result = integratedSystemService.performCompleteDiagnostic('user_001', diagnosticData);
      setDiagnosticResult(result.ai_diagnostic);
      setCurrentStep('results');
    } catch (error) {
      console.error('Error en diagnóstico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <Star className="w-4 h-4 text-green-600" />;
    if (score >= 60) return <TrendingUp className="w-4 h-4 text-yellow-600" />;
    return <AlertTriangle className="w-4 h-4 text-red-600" />;
  };

  if (currentStep === 'intro') {
    return (
      <div className="diagnostico-section">
        <div className="diagnostico-header">
          <h1 className="section-title">
            <Brain className="w-8 h-8 text-blue-600" />
            Diagnóstico Inteligente PAES
          </h1>
          <p className="section-description">
            Evaluación integral de tus competencias académicas usando IA avanzada
          </p>
        </div>

        <div className="diagnostico-intro">
          <div className="intro-card">
            <div className="intro-icon">
              <Zap className="w-12 h-12 text-blue-600" />
            </div>
            <h2>¿Qué incluye este diagnóstico?</h2>
            <ul className="intro-features">
              <li>✅ Evaluación de 5 materias PAES</li>
              <li>✅ Análisis de fortalezas y debilidades</li>
              <li>✅ Recomendaciones personalizadas</li>
              <li>✅ Ruta de aprendizaje optimizada</li>
              <li>✅ Estimación de tiempo de mejora</li>
            </ul>
          </div>

          <div className="diagnostico-actions">
            <button 
              className="btn-primary"
              onClick={performDiagnostic}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Iniciando diagnóstico...
                </>
              ) : (
                <>
                  <Target className="w-5 h-5" />
                  Iniciar Diagnóstico
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'questions') {
    return (
      <div className="diagnostico-section">
        <div className="diagnostico-header">
          <h1 className="section-title">
            <Brain className="w-8 h-8 text-blue-600" />
            Diagnóstico en Progreso
          </h1>
        </div>

        <div className="diagnostico-progress">
          <div className="progress-card">
            <div className="progress-icon">
              <div className="spinner-large"></div>
            </div>
            <h2>Analizando tus competencias...</h2>
            <p>El sistema está evaluando tu nivel en cada materia PAES</p>
            
            <div className="progress-steps">
              {subjects.map((subject, index) => (
                <div key={subject.id} className="progress-step">
                  <div className={`step-icon ${index < 3 ? 'completed' : 'pending'}`}>
                    {index < 3 ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <span className="step-label">{subject.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'results' && diagnosticResult) {
    return (
      <div className="diagnostico-section">
        <div className="diagnostico-header">
          <h1 className="section-title">
            <Brain className="w-8 h-8 text-blue-600" />
            Resultados del Diagnóstico
          </h1>
        </div>

        <div className="diagnostico-results">
          {/* Puntaje General */}
          <div className="result-card overall-score">
            <div className="score-header">
              <h2>Puntaje General</h2>
              <div className={`score-value ${getScoreColor(diagnosticResult.overall_score)}`}>
                {diagnosticResult.overall_score}%
              </div>
            </div>
            <div className="score-confidence">
              <span>Confianza: {Math.round(diagnosticResult.confidence_level * 100)}%</span>
            </div>
          </div>

          {/* Puntajes por Materia */}
          <div className="result-card">
            <h3>Puntajes por Materia</h3>
            <div className="subjects-grid">
              {subjects.map(subject => {
                const score = diagnosticResult.detailed_scores[subject.id] || 0;
                return (
                  <div key={subject.id} className="subject-score">
                    <div className="subject-header">
                      <div className={`subject-icon ${subject.color}`}>
                        {subject.icon}
                      </div>
                      <span className="subject-name">{subject.name}</span>
                    </div>
                    <div className={`score-display ${getScoreColor(score)}`}>
                      {getScoreIcon(score)}
                      <span className="score-number">{score}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fortalezas y Debilidades */}
          <div className="result-cards-row">
            <div className="result-card">
              <h3>
                <CheckCircle className="w-5 h-5 text-green-600" />
                Fortalezas
              </h3>
              <ul className="strengths-list">
                {diagnosticResult.strengths.map((strength, index) => (
                  <li key={index} className="strength-item">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    {strength}
                  </li>
                ))}
              </ul>
            </div>

            <div className="result-card">
              <h3>
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                Áreas de Mejora
              </h3>
              <ul className="weaknesses-list">
                {diagnosticResult.weaknesses.map((weakness, index) => (
                  <li key={index} className="weakness-item">
                    <AlertTriangle className="w-4 h-4 text-orange-600" />
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recomendaciones */}
          <div className="result-card">
            <h3>
              <Target className="w-5 h-5 text-blue-600" />
              Recomendaciones Personalizadas
            </h3>
            <div className="recommendations-grid">
              {diagnosticResult.recommendations.map((recommendation, index) => (
                <div key={index} className="recommendation-item">
                  <div className="recommendation-number">{index + 1}</div>
                  <p>{recommendation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ruta de Aprendizaje */}
          <div className="result-card">
            <h3>
              <TrendingUp className="w-5 h-5 text-purple-600" />
              Ruta de Aprendizaje Sugerida
            </h3>
            <div className="learning-path">
              {diagnosticResult.learning_path.map((node, index) => (
                <div key={index} className="path-node">
                  <div className="node-number">{index + 1}</div>
                  <span className="node-name">{node}</span>
                  {index < diagnosticResult.learning_path.length - 1 && (
                    <div className="path-arrow">→</div>
                  )}
                </div>
              ))}
            </div>
            <div className="improvement-time">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Tiempo estimado de mejora: {diagnosticResult.estimated_improvement_time} días</span>
            </div>
          </div>

          {/* Acciones */}
          <div className="diagnostico-actions">
            <button className="btn-secondary">
              <BookOpen className="w-5 h-5" />
              Ver Ejercicios Recomendados
            </button>
            <button className="btn-primary">
              <Target className="w-5 h-5" />
              Crear Plan de Estudio
            </button>
            <button 
              className="btn-outline"
              onClick={() => setCurrentStep('intro')}
            >
              Realizar Nuevo Diagnóstico
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default DiagnosticoSection;
