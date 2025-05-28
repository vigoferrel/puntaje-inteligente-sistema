
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster";
import { WebGLContextProvider } from '@/core/webgl/WebGLContextManager';

// Lazy load pages to prevent simultaneous 3D context creation
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const PAESUniversePage = React.lazy(() => import('@/pages/PAESUniversePage'));

function App() {
  return (
    <AuthProvider>
      <WebGLContextProvider>
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
                <Route path="/" element={<HomePage />} />
                <Route path="/paes-universe" element={<PAESUniversePage />} />
              </Routes>
            </React.Suspense>
            <Toaster />
          </div>
        </Router>
      </WebGLContextProvider>
    </AuthProvider>
  );
}

export default App;
