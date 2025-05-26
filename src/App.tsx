
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OptimizedProviderTree } from '@/providers/OptimizedProviderTree';
import { OptimizedDashboard } from '@/components/dashboard/OptimizedDashboard';
import { LectoGuiaUnified } from '@/components/lectoguia/LectoGuiaUnified';
import { IntelligentDiagnosticSystem } from '@/components/diagnostic/IntelligentDiagnosticSystem';
import { CinematicCalendar } from '@/components/calendar/CinematicCalendar';
import { SuperPAESMain } from '@/components/super-paes/SuperPAESMain';
import { BackendExploitationDashboard } from '@/components/backend/BackendExploitationDashboard';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { EnhancedNeuralCommandCenter } from '@/components/neural-command/EnhancedNeuralCommandCenter';
import { PlanInteligenteWrapper } from '@/components/plan/modern/PlanInteligenteWrapper';
import { QualityDashboard } from '@/components/quality/QualityDashboard';
import { EvaluationBank } from '@/components/evaluations/EvaluationBank';

// Universe Visualizations
import { UniverseVisualizationHub } from '@/components/universe/UniverseVisualizationHub';
import { EducationalUniverse } from '@/components/universe/EducationalUniverse';
import { PAESUniverseDashboard } from '@/components/paes-universe/PAESUniverseDashboard';
import { PAESLearningUniverse } from '@/components/paes-learning-universe/PAESLearningUniverse';

// NUEVAS IMPLEMENTACIONES
import { AdvancedFinancialCenter } from '@/components/financial/AdvancedFinancialCenter';
import { AIExerciseGenerator } from '@/components/exercise/AIExerciseGenerator';
import { AdvancedSettings } from '@/components/settings/AdvancedSettings';
import { HelpCenter } from '@/components/help/HelpCenter';

const App: React.FC = () => {
  return (
    <Router>
      <OptimizedProviderTree>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <Routes>
            {/* Ruta principal - Dashboard */}
            <Route path="/" element={<OptimizedDashboard />} />
            <Route path="/dashboard" element={<OptimizedDashboard />} />
            
            {/* Sistema Neural Mejorado */}
            <Route path="/neural" element={<EnhancedNeuralCommandCenter />} />
            
            {/* Plan Inteligente */}
            <Route path="/plan" element={<PlanInteligenteWrapper />} />
            
            {/* Sistema de Calidad */}
            <Route path="/calidad" element={<QualityDashboard />} />
            
            {/* Banco de Evaluaciones */}
            <Route path="/banco-evaluaciones" element={<EvaluationBank />} />
            
            {/* Universe Explorer */}
            <Route path="/universe-hub" element={<UniverseVisualizationHub />} />
            <Route path="/universe/educational" element={<EducationalUniverse initialMode="overview" />} />
            <Route path="/universe/paes-dashboard" element={<PAESUniverseDashboard />} />
            <Route path="/universe/learning" element={<PAESLearningUniverse />} />
            
            {/* NUEVAS SECCIONES IMPLEMENTADAS */}
            
            {/* Centro Financiero Avanzado */}
            <Route path="/centro-financiero" element={<AdvancedFinancialCenter />} />
            
            {/* Generador de Ejercicios IA */}
            <Route path="/ejercicios" element={<AIExerciseGenerator />} />
            
            {/* Sistema de Configuración */}
            <Route path="/settings" element={<AdvancedSettings />} />
            
            {/* Centro de Ayuda */}
            <Route path="/ayuda" element={<HelpCenter />} />
            
            {/* Panel de Administración */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* Backend Exploitation Dashboard */}
            <Route path="/backend" element={<BackendExploitationDashboard />} />
            
            {/* Herramientas principales */}
            <Route path="/lectoguia" element={<LectoGuiaUnified />} />
            <Route path="/diagnostico" element={<IntelligentDiagnosticSystem />} />
            <Route path="/calendario" element={<CinematicCalendar />} />
            
            {/* SuperPAES */}
            <Route path="/superpaes" element={<SuperPAESMain />} />
            
            {/* Rutas legacy - redirigir al sistema principal */}
            <Route path="/reforzamiento" element={<Navigate to="/backend" replace />} />
            <Route path="/entrenamiento" element={<Navigate to="/lectoguia" replace />} />
            <Route path="/contenido" element={<Navigate to="/lectoguia" replace />} />
            <Route path="/evaluaciones" element={<Navigate to="/banco-evaluaciones" replace />} />
            <Route path="/analisis" element={<Navigate to="/dashboard" replace />} />
            <Route path="/simulaciones" element={<Navigate to="/diagnostico" replace />} />
            
            {/* Redirecciones adicionales */}
            <Route path="/paes-dashboard" element={<Navigate to="/universe/paes-dashboard" replace />} />
            <Route path="/paes-universe" element={<Navigate to="/universe/paes-dashboard" replace />} />
            <Route path="/educational-universe" element={<Navigate to="/universe/educational" replace />} />
            <Route path="/learning-universe" element={<Navigate to="/universe/learning" replace />} />
            <Route path="/finanzas" element={<Navigate to="/centro-financiero" replace />} />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </OptimizedProviderTree>
    </Router>
  );
};

export default App;
