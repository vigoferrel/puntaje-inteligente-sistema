/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Link, useLocation } from 'react-router-dom';
import { Home, Brain, GraduationCap, Settings } from 'lucide-react';

export const AppSidebar: FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-700 p-4 min-h-screen">
      <div className="space-y-4">
        <div className="text-white font-bold text-lg flex items-center gap-2">
          <Brain className="w-6 h-6 text-cyan-400" />
          PAES Master
        </div>
        
        <nav className="space-y-2">
          <Link 
            to="/" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/') 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Home className="w-4 h-4" />
            Inicio
          </Link>
          
          <Link 
            to="/unified" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/unified') 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Brain className="w-4 h-4" />
            Sistema Unificado
          </Link>
          
          <Link 
            to="/paes" 
            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
              isActive('/paes') 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Dashboard PAES
          </Link>
        </nav>

        <div className="pt-4 border-t border-gray-700">
          <div className="text-xs text-gray-400 space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Sistema Activo</span>
            </div>
            <div>VersiÃ³n 2.0</div>
          </div>
        </div>
      </div>
    </div>
  );
};

