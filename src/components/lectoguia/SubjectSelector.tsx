
import React from 'react';
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from "@/components/ui/select";
import { SUBJECT_DISPLAY_NAMES } from '@/contexts/LectoGuiaContext';

interface SubjectSelectorProps {
  activeSubject: string;
  onSelectSubject: (subject: string) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({ 
  activeSubject, 
  onSelectSubject 
}) => {
  return (
    <Select value={activeSubject} onValueChange={onSelectSubject}>
      <SelectTrigger className="max-w-[200px] bg-background">
        <SelectValue placeholder="Selecciona una materia" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="general">General</SelectItem>
        <SelectItem value="lectura">Comprensión Lectora</SelectItem>
        <SelectItem value="matematicas-basica">Matemática 1 (7° a 2° medio)</SelectItem>
        <SelectItem value="matematicas-avanzada">Matemática 2 (3° y 4° medio)</SelectItem>
        <SelectItem value="ciencias">Ciencias</SelectItem>
        <SelectItem value="historia">Historia</SelectItem>
      </SelectContent>
    </Select>
  );
};
