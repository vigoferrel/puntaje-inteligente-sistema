import React from "react";
import { useLocation, useAuth } from "@/hooks";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { LayoutDashboard, Brain, Target, ClipboardList, TrendingUp, BookOpen } from "lucide-react";
interface AppLayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}
const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  hideNavigation = false
}) => {
  const location = useLocation();
  const {
    user,
    isLoading
  } = useAuth();
  const navigationItems = [{
    href: '/',
    label: 'Dashboard',
    icon: LayoutDashboard
  }, {
    href: '/lectoguia',
    label: 'SuperPAES',
    icon: Brain,
    highlight: true
  },
  // Destacar SuperPAES
  {
    href: '/evaluacion',
    label: 'Evaluación',
    icon: Target
  }, {
    href: '/diagnostico',
    label: 'Diagnóstico',
    icon: ClipboardList
  }, {
    href: '/progreso',
    label: 'Progreso',
    icon: TrendingUp
  }, {
    href: '/planes-estudio',
    label: 'Planes',
    icon: BookOpen
  }];

  // Get user display name from metadata or fallback to email
  const getUserDisplayName = () => {
    if (user?.user_metadata?.name) return user.user_metadata.name;
    if (user?.user_metadata?.full_name) return user.user_metadata.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'Usuario';
  };
  return <div className="min-h-screen bg-background">
      {!hideNavigation && <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
          <div className="container mx-auto px-4 bg-zinc-950">
            <div className="flex h-16 items-center justify-between bg-zinc-950">
              <div className="flex items-center space-x-8">
                <Link to="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">P</span>
                  </div>
                  <span className="font-bold text-xl">PAES Pro</span>
                </Link>
                
                <nav className="hidden md:flex items-center space-x-1">
                  {navigationItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.href;
                return <Link key={item.href} to={item.href} className={cn("flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors", isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent", item.highlight && "relative")}>
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                        {item.highlight && <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" />}
                      </Link>;
              })}
                </nav>
              </div>

              <div className="flex items-center space-x-4">
                {user ? <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground">
                      <span className="text-sm">Hola, {getUserDisplayName()}</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground">
                      <span className="text-sm">Cerrar Sesión</span>
                    </button>
                  </div> : <div className="flex items-center space-x-2">
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground">
                      <span className="text-sm">Iniciar Sesión</span>
                    </button>
                    <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors bg-primary text-primary-foreground">
                      <span className="text-sm">Registrarse</span>
                    </button>
                  </div>}
              </div>
            </div>
          </div>
        </header>}

      <main className="flex-1">
        {children}
      </main>
    </div>;
};
export { AppLayout };