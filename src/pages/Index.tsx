
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedEducationalHub } from '@/components/unified-dashboard/UnifiedEducationalHub';

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
      'planificador': '/planning',
      'ecosystem': '/ecosystem',
      'achievements': '/achievements',
      'universe': '/universe'
    };

    const route = toolRoutes[tool];
    if (route) {
      navigate(route);
    } else {
      console.warn(`Ruta no encontrada para la herramienta: ${tool}`);
    }
  };

  return (
    <div className="min-h-screen">
      <UnifiedEducationalHub onNavigateToTool={handleNavigateToTool} />
    </div>
  );
};

export default Index;
