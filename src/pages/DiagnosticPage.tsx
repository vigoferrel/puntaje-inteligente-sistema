
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';

const DiagnosticPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Target className="w-6 h-6" />
              Diagnóstico PAES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white/90">
              <p className="mb-4">Evaluación diagnóstica integral para preparación PAES.</p>
              <div className="bg-blue-500/20 p-4 rounded-lg border border-blue-500/30">
                <p className="text-blue-200">Módulo en desarrollo - Próximamente disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DiagnosticPage;
