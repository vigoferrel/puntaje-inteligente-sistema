
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { CinematicLayout } from '@/components/layout/CinematicLayout';
import { CinematicDashboard } from '@/components/dashboard/CinematicDashboard';
import { SubjectPage } from '@/components/subjects/SubjectPage';
import { HelpCenter } from '@/components/help/HelpCenter';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<CinematicLayout />}>
            <Route index element={<CinematicDashboard />} />
            <Route path="materias/:subject" element={<SubjectPage />} />
            <Route path="ayuda" element={<HelpCenter />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
