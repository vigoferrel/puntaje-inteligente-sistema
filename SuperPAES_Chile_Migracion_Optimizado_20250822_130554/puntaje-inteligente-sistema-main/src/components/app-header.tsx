/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { SidebarTrigger } from '../components/ui/sidebar';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Brain, Settings, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useIntersectional } from '../hooks/useIntersectional';

export const AppHeader: FC = () => {
  const { user } = useAuth();
  const { neuralHealth } = useIntersectional();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <SidebarTrigger />
        </div>
        
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <span className="font-medium text-sm">Sistema Neural PAES</span>
              <Badge variant="default" className="bg-green-600">
                {Math.round(neuralHealth.neural_efficiency)}% Activo
              </Badge>
            </div>
          </div>
          
          <nav className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <User className="h-4 w-4" />
              <span className="ml-2 text-sm">
                {user?.email?.split('@')[0] || 'Usuario'}
              </span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
};

