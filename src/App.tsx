
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

const App: React.FC = () => {
  return (
    <Router>
      <OptimizedProviderTree>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
          <Routes>
            {/* Ruta principal - Dashboard */}
            <Route path="/" element={<OptimizedDashboard />} />
            <Route path="/dashboard" element={<OptimizedDashboard />} />
            
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
            <Route path="/evaluaciones" element={<Navigate to="/diagnostico" replace />} />
            <Route path="/analisis" element={<Navigate to="/dashboard" replace />} />
            <Route path="/simulaciones" element={<Navigate to="/diagnostico" replace />} />
            
            {/* Ruta por defecto */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </OptimizedProviderTree>
    </Router>
  );
};

export default App;
