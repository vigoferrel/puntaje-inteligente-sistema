
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CinematicProvider } from '@/components/cinematic/CinematicTransitionSystem';
import { CinematicAudioProvider } from '@/components/cinematic/UniversalCinematicSystem';
import { CinematicLayout } from '@/components/layout/CinematicLayout';
import { CinematicDashboard } from '@/components/dashboard/CinematicDashboard';
import { CinematicUnifiedDashboard } from '@/components/dashboard/CinematicUnifiedDashboard';
import { SubjectPage } from '@/components/subjects/SubjectPage';
import { HelpCenter } from '@/components/help/HelpCenter';

function App() {
  return (
    <AuthProvider>
      <CinematicProvider>
        <CinematicAudioProvider>
          <Router>
            <Routes>
              <Route path="/" element={<CinematicLayout />}>
                <Route index element={<CinematicUnifiedDashboard />} />
                <Route path="dashboard" element={<CinematicDashboard />} />
                <Route path="materias/:subject" element={<SubjectPage />} />
                <Route path="ayuda" element={<HelpCenter />} />
              </Route>
            </Routes>
          </Router>
        </CinematicAudioProvider>
      </CinematicProvider>
    </AuthProvider>
  );
}

export default App;
