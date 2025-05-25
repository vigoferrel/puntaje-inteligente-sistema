
import React, { useState } from "react";
import { AppLayout } from "@/components/app-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { PAESEvaluationDashboard } from "@/components/paes/PAESEvaluationDashboard";
import { 
  TrendingUp, 
  Target, 
  Award,
  BarChart3,
  Calendar,
  PlayCircle
} from "lucide-react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link, useNavigate } from "react-router-dom";

const PAESDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<'dashboard' | 'analytics' | 'schedule'>('dashboard');

  const handleStartDiagnostic = () => {
    navigate('/diagnostico');
  };

  const handleViewResults = () => {
    navigate('/analisis');
  };

  const handleScheduleTest = () => {
    navigate('/calendario');
  };

  return (
    <AppLayout>
      <div className="container py-8">
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild><Link to="/">Inicio</Link></BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>Evaluación PAES</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Evaluación PAES</h1>
              <p className="text-muted-foreground">
                Dashboard completo de tu preparación y resultados PAES
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'analytics', label: 'Análisis', icon: TrendingUp },
              { id: 'schedule', label: 'Cronograma', icon: Calendar }
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeSection === tab.id ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveSection(tab.id as any)}
                className="gap-2"
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PAESEvaluationDashboard 
            onStartDiagnostic={handleStartDiagnostic}
            onViewResults={handleViewResults}
            onScheduleTest={handleScheduleTest}
          />
        </motion.div>

        {/* Additional Analytics */}
        {activeSection === 'analytics' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Análisis Avanzado</CardTitle>
                <CardDescription>
                  Métricas detalladas de tu preparación PAES
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Tendencias de Puntaje</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Comprensión Lectora</span>
                        <Badge variant="default" className="bg-green-600">+15%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Matemática M1</span>
                        <Badge variant="default" className="bg-blue-600">+8%</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Ciencias</span>
                        <Badge variant="secondary">+3%</Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-3">Predicciones IA</h4>
                    <div className="space-y-2">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="text-sm text-blue-700">Puntaje Proyectado</div>
                        <div className="font-bold text-blue-900">720 puntos</div>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="text-sm text-green-700">Probabilidad de Meta</div>
                        <div className="font-bold text-green-900">87%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
};

export default PAESDashboard;
