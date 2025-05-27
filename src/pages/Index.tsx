
import { CinematicDashboard } from '@/components/unified-dashboard/CinematicDashboard';

const Index = () => {
  const handleNavigateToTool = (tool: string) => {
    console.log(`Navegando a herramienta: ${tool}`);
    // Aquí se puede agregar lógica de navegación específica si es necesaria
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <CinematicDashboard onNavigateToTool={handleNavigateToTool} />
    </div>
  );
};

export default Index;
