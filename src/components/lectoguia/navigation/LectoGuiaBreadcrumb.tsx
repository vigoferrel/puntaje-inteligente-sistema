
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  active: boolean;
  onClick?: () => void;
}

interface LectoGuiaBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const LectoGuiaBreadcrumb: React.FC<LectoGuiaBreadcrumbProps> = ({ 
  items, 
  className = "" 
}) => {
  return (
    <nav className={`flex items-center space-x-1 text-sm text-muted-foreground ${className}`}>
      <Home className="h-4 w-4" />
      {items.map((item, index) => (
        <div key={`breadcrumb-${index}`} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className={`hover:text-foreground transition-colors ${
                item.active ? 'text-foreground font-medium' : ''
              }`}
            >
              {item.label}
            </button>
          ) : (
            <span className={item.active ? 'text-foreground font-medium' : ''}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};
