/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

// ðŸ—ºï¸ Mapeo de rutas a etiquetas cuÃ¡nticas
const routeLabels: Record<string, string> = {
  dashboard: 'ðŸ  Dashboard',
  superpaes: 'ðŸš€ SuperPAES',
  planning: 'ðŸ“‹ PlanificaciÃ³n',
  calendario: 'ðŸ“… Calendario',
  lectoguia: 'ðŸ“š LectoGuÃ­a',
  evaluaciones: 'ðŸ“Š Evaluaciones',
  ejercicios: 'ðŸ’ª Ejercicios',
  progreso: 'ðŸ“ˆ Progreso',
  financial: 'ðŸ’° Centro Financiero',
  gamification: 'ðŸŽ® GamificaciÃ³n',
  achievements: 'ðŸ† Logros',
  universe: 'ðŸŒŒ Universo',
  diagnostic: 'ðŸ” DiagnÃ³stico',
  settings: 'âš™ï¸ ConfiguraciÃ³n',
  entrenamiento: 'ðŸŽ¯ Entrenamiento',
  studio: 'ðŸŽµ Studio',
  acceleration: 'âš¡ AceleraciÃ³n',
  assistant: 'ðŸ¤– Asistente',
  auth: 'ðŸ” AutenticaciÃ³n',
  login: 'ðŸ”‘ Iniciar SesiÃ³n'
};

// ðŸ§  Context7 + Pensamiento Secuencial: Breadcrumbs CuÃ¡nticos DinÃ¡micos
export const QuantumBreadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // No mostrar breadcrumbs en rutas principales
  if (pathSegments.length === 0 || 
      (pathSegments.length === 1 && pathSegments[0] === 'dashboard') ||
      pathSegments[0] === 'auth' ||
      pathSegments[0] === 'login') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-purple-300 mb-6 px-4 py-2 bg-black/20 backdrop-blur-sm rounded-lg border border-purple-500/20">
      {/* Icono de Home siempre presente */}
      <Link 
        to="/dashboard" 
        className="flex items-center hover:text-white transition-colors p-1 rounded hover:bg-purple-500/20"
        title="Ir al Dashboard"
      >
        <Home className="w-4 h-4" />
      </Link>
      
      {/* Generar breadcrumbs dinÃ¡micamente */}
      {pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
        const isLast = index === pathSegments.length - 1;
        
        return (
          <React.Fragment key={path}>
            <ChevronRight className="w-4 h-4 text-purple-500" />
            {isLast ? (
              <span className="text-white font-medium px-2 py-1 bg-purple-600/30 rounded">
                {label}
              </span>
            ) : (
              <Link 
                to={path} 
                className="hover:text-white transition-colors px-2 py-1 rounded hover:bg-purple-500/20"
                title={`Ir a ${label}`}
              >
                {label}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default QuantumBreadcrumbs;
