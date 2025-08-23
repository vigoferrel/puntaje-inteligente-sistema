
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { GlobalEducationProvider } from '@/contexts/GlobalEducationProvider';
import { CriticalWebGLProvider } from '@/core/webgl/CriticalWebGLManager';
import { Critical3DErrorBoundary } from '@/core/error-handling/Critical3DErrorBoundary';
import { PrimitiveConversionErrorBoundary } from '@/core/error-handling/PrimitiveConversionErrorBoundary';

// Lazy load optimizado para prevenir contextos simultáneos
const Dashboard = React.lazy(() => import('@/pages/Dashboard'));
const PAESUniversePage = React.lazy(() => import('@/pages/PAESUniversePage'));
const UnifiedEducationalHubPage = React.lazy(() => import('@/pages/UnifiedEducationalHub'));
const LectoGuiaPage = React.lazy(() => import('@/pages/LectoGuiaPage'));
const DiagnosticPage = React.lazy(() => import('@/pages/DiagnosticPage'));
const FinancialPage = React.lazy(() => import('@/pages/FinancialPage'));
const MathematicsPage = React.lazy(() => import('@/pages/MathematicsPage'));
const SciencesPage = React.lazy(() => import('@/pages/SciencesPage'));
const HistoryPage = React.lazy(() => import('@/pages/HistoryPage'));
const EvaluationsPage = React.lazy(() => import('@/pages/EvaluationsPage'));

// Nuevas páginas de sistemas avanzados
const AIRecommendationsPage = React.lazy(() => import('@/pages/AIRecommendationsPage'));
const GamificationPage = React.lazy(() => import('@/pages/GamificationPage'));
const AnalyticsPage = React.lazy(() => import('@/pages/AnalyticsPage'));
const SpotifyIntegrationPage = React.lazy(() => import('@/pages/SpotifyIntegrationPage'));
const Holographic3DPage = React.lazy(() => import('@/pages/Holographic3DPage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));

// Páginas adicionales del sistema
const PAESPage = React.lazy(() => import('@/pages/PAES'));
const PAESDashboard = React.lazy(() => import('@/pages/PAESDashboard'));
const ValidationDashboard = React.lazy(() => import('@/pages/ValidationDashboard'));
const SecurityDashboard = React.lazy(() => import('@/pages/SecurityDashboard'));
const ProgresoPage = React.lazy(() => import('@/pages/Progreso'));
const PlanPage = React.lazy(() => import('@/pages/Plan'));
const EntrenamientoPage = React.lazy(() => import('@/pages/Entrenamiento'));
const EjerciciosPage = React.lazy(() => import('@/pages/Ejercicios'));
const EvaluacionPage = React.lazy(() => import('@/pages/Evaluacion'));
const DiagnosticoPage = React.lazy(() => import('@/pages/Diagnostico'));
const ContenidoPage = React.lazy(() => import('@/pages/Contenido'));
const CalendarioPage = React.lazy(() => import('@/pages/Calendario'));
const AuthPage = React.lazy(() => import('@/pages/Auth'));
const LoginPage = React.lazy(() => import('@/pages/Login'));
const NotFoundPage = React.lazy(() => import('@/pages/NotFound'));

function App() {
  return (
    <AuthProvider>
      <GlobalEducationProvider>
        <CriticalWebGLProvider>
          <Critical3DErrorBoundary componentName="App">
            <PrimitiveConversionErrorBoundary>
              <Router>
                <div className="min-h-screen">
                  <React.Suspense 
                    fallback={
                      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
                        <div className="text-white text-center">
                          <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4"></div>
                          <div>Cargando aplicación...</div>
                        </div>
                      </div>
                    }
                  >
                    <Routes>
                      {/* Rutas principales */}
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* Rutas del universo PAES */}
                      <Route path="/paes-universe" element={<PAESUniversePage />} />
                      <Route path="/paes" element={<PAESPage />} />
                      <Route path="/paes-dashboard" element={<PAESDashboard />} />
                      
                      {/* Rutas educativas */}
                      <Route path="/unified" element={<UnifiedEducationalHubPage />} />
                      <Route path="/unified-educational-hub" element={<UnifiedEducationalHubPage />} />
                      <Route path="/lectoguia" element={<LectoGuiaPage />} />
                      
                      {/* Rutas de diagnóstico */}
                      <Route path="/diagnostic" element={<DiagnosticPage />} />
                      <Route path="/diagnostico" element={<DiagnosticoPage />} />
                      
                      {/* Rutas de materias */}
                      <Route path="/financial" element={<FinancialPage />} />
                      <Route path="/mathematics" element={<MathematicsPage />} />
                      <Route path="/sciences" element={<SciencesPage />} />
                      <Route path="/history" element={<HistoryPage />} />
                      
                      {/* Rutas de evaluaciones */}
                      <Route path="/evaluations" element={<EvaluationsPage />} />
                      <Route path="/evaluacion" element={<EvaluacionPage />} />
                      <Route path="/validation-dashboard" element={<ValidationDashboard />} />
                      
                      {/* Rutas de sistemas avanzados */}
                      <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
                      <Route path="/gamification" element={<GamificationPage />} />
                      <Route path="/analytics" element={<AnalyticsPage />} />
                      <Route path="/spotify-integration" element={<SpotifyIntegrationPage />} />
                      <Route path="/spotify/sessions" element={<SpotifyIntegrationPage />} />
                      <Route path="/spotify/playlists" element={<SpotifyIntegrationPage />} />
                      <Route path="/3d-dashboard" element={<Holographic3DPage />} />
                      <Route path="/holographic-3d" element={<Holographic3DPage />} />
                      <Route path="/settings" element={<SettingsPage />} />
                      
                      {/* Rutas de progreso y planificación */}
                      <Route path="/progreso" element={<ProgresoPage />} />
                      <Route path="/plan" element={<PlanPage />} />
                      <Route path="/entrenamiento" element={<EntrenamientoPage />} />
                      <Route path="/ejercicios" element={<EjerciciosPage />} />
                      <Route path="/contenido" element={<ContenidoPage />} />
                      <Route path="/calendario" element={<CalendarioPage />} />
                      
                      {/* Rutas de seguridad */}
                      <Route path="/security-dashboard" element={<SecurityDashboard />} />
                      
                      {/* Rutas de autenticación */}
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      
                      {/* Ruta 404 */}
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </React.Suspense>
                  <Toaster />
                </div>
              </Router>
            </PrimitiveConversionErrorBoundary>
          </Critical3DErrorBoundary>
        </CriticalWebGLProvider>
      </GlobalEducationProvider>
    </AuthProvider>
  );
}

export default App;
