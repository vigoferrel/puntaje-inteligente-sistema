
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AppLayout } from "@/components/app-layout";
import { AppInitializer } from "@/components/AppInitializer";
import { PAESUnifiedDashboard } from "@/components/paes-unified/PAESUnifiedDashboard";
import { PAESLearningUniverse } from "@/components/paes-learning-universe/PAESLearningUniverse";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Map, 
  ArrowRight, 
  Sparkles,
  Brain,
  Target
} from "lucide-react";

const PAESDashboard = () => {
  const [viewMode, setViewMode] = useState<'traditional' | 'universe'>('universe');

  const ViewToggle = () => (
    <motion.div 
      className="mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="bg-gradient-to-r from-slate-800 to-slate-900 border-slate-700">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-blue-400" />
                <h2 className="text-xl font-bold text-white">Dashboard PAES</h2>
                <Badge className="bg-blue-600 text-white border-none">
                  277 Nodos Activos
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'traditional' ? 'default' : 'outline'}
                className={`${
                  viewMode === 'traditional' 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => setViewMode('traditional')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Vista Analítica
              </Button>
              <Button
                variant={viewMode === 'universe' ? 'default' : 'outline'}
                className={`${
                  viewMode === 'universe' 
                    ? 'bg-purple-600 hover:bg-purple-700' 
                    : 'border-slate-600 text-slate-300 hover:bg-slate-700'
                }`}
                onClick={() => setViewMode('universe')}
              >
                <Map className="w-4 h-4 mr-2" />
                Mapa Curricular 3D
                <Badge className="ml-2 bg-yellow-500 text-black text-xs">
                  NUEVO
                </Badge>
              </Button>
            </div>
          </div>
          
          {viewMode === 'universe' && (
            <motion.div 
              className="mt-4 pt-4 border-t border-slate-600"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-green-400" />
                    <span className="text-sm">Navegación 3D Interactiva</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-blue-400" />
                    <span className="text-sm">Rutas de Aprendizaje Inteligentes</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span className="text-sm">Validación con Ejercicios Reales</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  if (viewMode === 'universe') {
    return (
      <AppInitializer>
        <AppLayout>
          <div className="container mx-auto py-6 px-4">
            <ViewToggle />
          </div>
          <div className="h-[calc(100vh-200px)]">
            <PAESLearningUniverse />
          </div>
        </AppLayout>
      </AppInitializer>
    );
  }

  return (
    <AppInitializer>
      <AppLayout>
        <div className="container mx-auto py-6 px-4">
          <ViewToggle />
          <PAESUnifiedDashboard />
        </div>
      </AppLayout>
    </AppInitializer>
  );
};

export default PAESDashboard;
