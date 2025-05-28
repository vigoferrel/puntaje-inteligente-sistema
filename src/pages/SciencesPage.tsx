
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FlaskConical } from 'lucide-react';

const SciencesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <FlaskConical className="w-6 h-6" />
              Ciencias PAES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white/90">
              <p className="mb-4">Preparación integral en Física, Química y Biología para PAES.</p>
              <div className="bg-violet-500/20 p-4 rounded-lg border border-violet-500/30">
                <p className="text-violet-200">Módulo en desarrollo - Próximamente disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SciencesPage;
