
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from 'lucide-react';

const MathematicsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Calculator className="w-6 h-6" />
              Matemáticas PAES
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white/90">
              <p className="mb-4">Preparación completa en Matemática M1 y M2 para PAES.</p>
              <div className="bg-purple-500/20 p-4 rounded-lg border border-purple-500/30">
                <p className="text-purple-200">Módulo en desarrollo - Próximamente disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MathematicsPage;
