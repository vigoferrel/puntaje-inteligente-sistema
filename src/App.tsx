
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import Index from './pages/Index';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import Plan from './pages/Plan';
import LectoGuia from './pages/LectoGuia';
import Diagnostico from './pages/Diagnostico';
import { Toaster } from './components/ui/toaster';
import { ProtectedRoute } from './components/protected-route';
import GeneradorDiagnostico from './pages/admin/GeneradorDiagnostico';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/plan" element={<ProtectedRoute><Plan /></ProtectedRoute>} />
            <Route path="/lectoguia" element={<ProtectedRoute><LectoGuia /></ProtectedRoute>} />
            <Route path="/diagnostico" element={<ProtectedRoute><Diagnostico /></ProtectedRoute>} />
            <Route path="/admin/generador-diagnostico" element={<ProtectedRoute><GeneradorDiagnostico /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
