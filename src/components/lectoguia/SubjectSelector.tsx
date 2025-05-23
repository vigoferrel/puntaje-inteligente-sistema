
import React from 'react';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useLectoGuia } from '@/contexts/LectoGuiaContext';

interface SubjectSelectorProps {
  activeSubject: string;
  onSelectSubject: (subject: string) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({ 
  activeSubject, 
  onSelectSubject 
}) => {
  const { selectedPrueba, nodes } = useLectoGuia();
  
  const subjectOptions = [
    { value: 'lectura', label: 'Comprensión Lectora', prueba: 'COMPETENCIA_LECTORA' },
    { value: 'matematicas-basica', label: 'Matemática 1', prueba: 'MATEMATICA_1' },
    { value: 'matematicas-avanzada', label: 'Matemática 2', prueba: 'MATEMATICA_2' },
    { value: 'ciencias', label: 'Ciencias', prueba: 'CIENCIAS' },
    { value: 'historia', label: 'Historia', prueba: 'HISTORIA' }
  ];
  
  // Contar nodos disponibles por materia
  const getNodesCount = (prueba: string) => {
    return nodes.filter(node => node.prueba === prueba).length;
  };
  
  const getCurrentSubjectLabel = () => {
    const current = subjectOptions.find(opt => opt.value === activeSubject);
    return current?.label || 'Selecciona una materia';
  };

  return (
    <div className="flex items-center gap-2">
      <Select value={activeSubject} onValueChange={onSelectSubject}>
        <SelectTrigger className="max-w-[220px] bg-background">
          <SelectValue placeholder="Selecciona una materia" />
        </SelectTrigger>
        <SelectContent>
          {subjectOptions.map((option) => {
            const nodesCount = getNodesCount(option.prueba);
            const isActive = option.prueba === selectedPrueba;
            
            return (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center justify-between w-full">
                  <span className={isActive ? 'font-medium' : ''}>{option.label}</span>
                  <div className="flex items-center gap-1 ml-2">
                    {isActive && (
                      <Badge variant="default" className="text-xs px-1">
                        Activa
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs px-1">
                      {nodesCount} nodos
                    </Badge>
                  </div>
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      
      {/* Indicador visual de la materia activa */}
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-muted-foreground">
          {getCurrentSubjectLabel()}
        </span>
      </div>
    </div>
  );
};
