
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Brain, GraduationCap } from 'lucide-react';

export const AppSidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 p-4">
      <div className="space-y-4">
        <div className="text-white font-bold text-lg">PAES Master</div>
        
        <nav className="space-y-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Inicio
          </Link>
          
          <Link 
            to="/unified" 
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <Brain className="w-4 h-4" />
            Sistema Unificado
          </Link>
          
          <Link 
            to="/paes" 
            className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <GraduationCap className="w-4 h-4" />
            Dashboard PAES
          </Link>
        </nav>
      </div>
    </div>
  );
};
