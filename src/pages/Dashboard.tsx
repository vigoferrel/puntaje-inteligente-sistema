
import React, { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';
import { SimpleLoadingScreen } from '@/components/SimpleLoadingScreen';

            // Lazy load de componentes principales - Versión EDUCATIVA PAES
            const PAESEducationalDashboard = React.lazy(() => 
              import('@/components/educational/PAESEducationalDashboard')
            );
const SimpleNavigationSystem = React.lazy(() => 
  import('@/components/navigation/SimpleNavigationSystem')
);
const SimpleNotificationSystem = React.lazy(() => 
  import('@/components/notifications/SimpleNotificationSystem')
);
const SimpleAdaptiveThemeProvider = React.lazy(() => 
  import('@/components/theming/SimpleAdaptiveThemeSystem').then(module => ({
    default: module.SimpleAdaptiveThemeProvider
  }))
);
const SimpleThemeCustomizer = React.lazy(() => 
  import('@/components/theming/SimpleAdaptiveThemeSystem').then(module => ({
    default: module.SimpleThemeCustomizer
  }))
);
const SimpleAIAssistant = React.lazy(() => 
  import('@/components/help/SimpleAIAssistant')
);
const SimpleOnboardingSystem = React.lazy(() => 
  import('@/components/onboarding/SimpleOnboardingSystem')
);

const DashboardContent: React.FC = () => {
  const { user, isLoading } = useAuth();
  const [isSystemReady, setIsSystemReady] = useState(false);
  const { isSidebarOpen } = useSidebar();
  
  // Inicializar sistema después de que el usuario esté cargado
  useEffect(() => {
    if (user && !isLoading) {
      const timer = setTimeout(() => setIsSystemReady(true), 100);
      return () => clearTimeout(timer);
    }
  }, [user, isLoading]);

  if (isLoading || !user) {
    return <SimpleLoadingScreen />;
  }

  if (!isSystemReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <div>Inicializando sistema PAES avanzado...</div>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<SimpleLoadingScreen />}>
      <SimpleAdaptiveThemeProvider userId={user.id}>
        <div className="dashboard-container min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900">
          {/* Sistema de Navegación Simplificado */}
          <SimpleNavigationSystem />
          
          {/* Dashboard Principal EDUCATIVO PAES */}
          <div className={`dashboard-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}>
            <PAESEducationalDashboard />
          </div>
          
          {/* Sistemas de Apoyo */}
          <SimpleNotificationSystem userId={user.id} />
          <SimpleThemeCustomizer />
          <SimpleAIAssistant userId={user.id} />
          
          {/* Sistema de Onboarding Simplificado */}
          <SimpleOnboardingSystem userId={user.id} />
        </div>
      </SimpleAdaptiveThemeProvider>
    </Suspense>
  );
};



const Dashboard: React.FC = () => {
  return (
    <SidebarProvider>
      <DashboardContent />
    </SidebarProvider>
  );
};

export default Dashboard;
