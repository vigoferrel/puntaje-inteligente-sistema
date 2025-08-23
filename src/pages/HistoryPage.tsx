
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scroll } from 'lucide-react';

const HistoryPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-3">
              <Scroll className="w-6 h-6" />
              Historia y Ciencias Sociales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-white/90">
              <p className="mb-4">Preparación completa en Historia y Ciencias Sociales para PAES.</p>
              <div className="bg-orange-500/20 p-4 rounded-lg border border-orange-500/30">
                <p className="text-orange-200">Módulo en desarrollo - Próximamente disponible</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HistoryPage;
