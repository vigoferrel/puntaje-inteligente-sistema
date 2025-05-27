
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CinematicDashboard } from '@/components/unified-dashboard/CinematicDashboard';

const Index = () => {
  const navigate = useNavigate();

  const handleNavigateToTool = (tool: string) => {
    console.log(`Navegando a herramienta: ${tool}`);
    
    // Mapeo de herramientas a rutas
    const toolRoutes: Record<string, string> = {
      'lectoguia': '/lectoguia',
      'financial': '/financial',
      'diagnostic': '/diagnostic',
      'planning': '/planning',
      'centro-financiero': '/financial',
      'diagnostico': '/diagnostic',
      'planificador': '/planning'
    };

    const route = toolRoutes[tool];
    if (route) {
      navigate(route);
    } else {
      console.warn(`Ruta no encontrada para la herramienta: ${tool}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <CinematicDashboard onNavigateToTool={handleNavigateToTool} />
    </div>
  );
};

export default Index;
