
import React from 'react';
import { 
  Breadcrumb, 
  BreadcrumbList, 
  BreadcrumbItem, 
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage
} from "@/components/ui/breadcrumb";
import { Home, BookOpen, Calculator, Atom, History, BrainCircuit } from 'lucide-react';
import { TPAESPrueba } from '@/types/system-types';
import { motion } from "framer-motion";

interface BreadcrumbItem {
  label: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}

interface LectoGuiaBreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

// Función para obtener el icono según la prueba o materia
const getSubjectIcon = (label: string) => {
  // Normalizar el texto para la comparación
  const normalizedLabel = label.toLowerCase();
  
  if (normalizedLabel.includes('matemática') || normalizedLabel.includes('matematica')) {
    return <Calculator className="h-3.5 w-3.5" />;
  } else if (normalizedLabel.includes('lectura') || normalizedLabel.includes('comprensión')) {
    return <BookOpen className="h-3.5 w-3.5" />;
  } else if (normalizedLabel.includes('ciencia')) {
    return <Atom className="h-3.5 w-3.5" />;
  } else if (normalizedLabel.includes('historia')) {
    return <History className="h-3.5 w-3.5" />;
  } else {
    return <BrainCircuit className="h-3.5 w-3.5" />;
  }
};

// Variantes de animación para los elementos de breadcrumb
const breadcrumbVariants = {
  hidden: { opacity: 0, x: -5 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { 
      delay: i * 0.1,
      duration: 0.3
    }
  })
};

export const LectoGuiaBreadcrumb: React.FC<LectoGuiaBreadcrumbProps> = ({ 
  items, 
  className 
}) => {
  if (!items || items.length === 0) return null;
  
  // Handler para el click en el ícono de home
  const handleHomeClick = () => {
    // Si hay un ítem inicial, usar su onClick
    if (items.length > 0 && items[0] && items[0].onClick) {
      items[0].onClick();
    }
  };
  
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#" onClick={(e) => {
            e.preventDefault();
            handleHomeClick();
          }}>
            <Home className="h-3.5 w-3.5" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        
        {items.map((item, index) => (
          <React.Fragment key={index}>
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              variants={breadcrumbVariants}
            >
              <BreadcrumbItem>
                {item.active ? (
                  <BreadcrumbPage className="flex items-center gap-1.5">
                    {item.icon || getSubjectIcon(item.label)}
                    <span>{item.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (item.onClick) item.onClick();
                    }}
                    className="flex items-center gap-1.5"
                  >
                    {item.icon || getSubjectIcon(item.label)}
                    <span>{item.label}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </motion.div>
            {index < items.length - 1 && <BreadcrumbSeparator />}
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
};
