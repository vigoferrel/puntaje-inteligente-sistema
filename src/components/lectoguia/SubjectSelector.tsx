
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { 
  BookOpen, 
  Calculator, 
  Flask, 
  GraduationCap, 
  Lightbulb,
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SubjectSelectorProps {
  activeSubject: string;
  onSubjectChange: (subject: string) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({ 
  activeSubject, 
  onSubjectChange 
}) => {
  const subjects = [
    { id: "general", name: "General", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "lectura", name: "Comprensión Lectora", icon: <BookOpen className="h-4 w-4" /> },
    { id: "matematicas", name: "Matemáticas", icon: <Calculator className="h-4 w-4" /> },
    { id: "ciencias", name: "Ciencias", icon: <Flask className="h-4 w-4" /> },
    { id: "historia", name: "Historia", icon: <Lightbulb className="h-4 w-4" /> },
  ];

  return (
    <TooltipProvider>
      <div className="flex items-center justify-center pb-1 w-full">
        <ToggleGroup 
          type="single" 
          value={activeSubject} 
          onValueChange={(value) => value && onSubjectChange(value)}
          className="flex flex-wrap justify-center gap-1"
        >
          {subjects.map((subject) => (
            <Tooltip key={subject.id}>
              <TooltipTrigger asChild>
                <ToggleGroupItem 
                  value={subject.id} 
                  aria-label={subject.name}
                  className={`data-[state=on]:bg-primary data-[state=on]:text-primary-foreground`}
                >
                  {subject.icon}
                </ToggleGroupItem>
              </TooltipTrigger>
              <TooltipContent>
                <p>{subject.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </ToggleGroup>
      </div>
    </TooltipProvider>
  );
};
