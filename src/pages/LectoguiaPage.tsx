
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';

const LectoguiaPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <BookOpen className="w-6 h-6" />
              LectoGuía - Competencia Lectora
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white/90">
              <p className="mb-4">Sistema de comprensión lectora con IA para preparación PAES.</p>
              <div className="bg-cyan-500/20 p-4 rounded-lg border border-cyan-500/30">
                <p className="text-cyan-200">Módulo en desarrollo - Próximamente disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LectoguiaPage;
