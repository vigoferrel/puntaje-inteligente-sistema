
import React from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '@/components/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, GraduationCap, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Index: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        <div className="container mx-auto px-4 py-16">
          
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Brain className="w-12 h-12 text-cyan-400" />
              <h1 className="text-5xl font-bold text-white">
                PAES Master
              </h1>
            </div>
            <p className="text-xl text-cyan-200 max-w-2xl mx-auto">
              Plataforma Inteligente de Preparación PAES con IA
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="w-6 h-6 text-cyan-400" />
                  Sistema Unificado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">
                  Dashboard completo con IA, métricas y análisis avanzado
                </p>
                <Link to="/unified">
                  <Button className="w-full bg-cyan-600 hover:bg-cyan-700">
                    Acceder
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-green-400" />
                  Dashboard PAES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">
                  Evaluaciones, resultados y preparación PAES
                </p>
                <Link to="/paes">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Acceder
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/20 transition-all">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-purple-400" />
                  Análisis IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/80 mb-4">
                  Predicciones y recomendaciones personalizadas
                </p>
                <Button className="w-full bg-purple-600 hover:bg-purple-700" disabled>
                  Próximamente
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Status */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">
                Sistema Activo • {user ? 'Autenticado' : 'Visitante'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
