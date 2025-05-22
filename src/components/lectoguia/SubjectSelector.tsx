
import React from 'react';
import { cn } from "@/lib/utils";
import { 
  BookIcon, 
  BrainCircuitIcon, 
  FlaskConicalIcon, 
  GlobeIcon, 
  GraduationCapIcon 
} from "lucide-react";

interface SubjectSelectorProps {
  activeSubject: string;
  onSelectSubject: (subject: string) => void;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  activeSubject,
  onSelectSubject
}) => {
  const subjects = [
    {
      id: "general",
      name: "General",
      icon: <GraduationCapIcon className="h-5 w-5" />
    },
    {
      id: "lectura",
      name: "Lectura",
      icon: <BookIcon className="h-5 w-5" />
    },
    {
      id: "matematicas-basica",
      name: "Matemática 1",
      description: "7° a 2° medio",
      icon: <BrainCircuitIcon className="h-5 w-5" />
    },
    {
      id: "matematicas-avanzada",
      name: "Matemática 2",
      description: "3° y 4° medio",
      icon: <BrainCircuitIcon className="h-5 w-5" />
    },
    {
      id: "ciencias",
      name: "Ciencias",
      icon: <FlaskConicalIcon className="h-5 w-5" />
    },
    {
      id: "historia",
      name: "Historia",
      icon: <GlobeIcon className="h-5 w-5" />
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {subjects.map((subject) => (
        <button
          key={subject.id}
          onClick={() => onSelectSubject(subject.id)}
          className={cn(
            "flex flex-col items-center justify-center p-3 rounded-lg border transition-colors min-w-[90px]",
            activeSubject === subject.id
              ? "border-primary bg-primary/10 text-primary"
              : "border-muted bg-background hover:bg-accent/30"
          )}
        >
          <span className="mb-1">{subject.icon}</span>
          <span className="text-sm font-medium">{subject.name}</span>
          {subject.description && (
            <span className="text-xs text-muted-foreground">{subject.description}</span>
          )}
        </button>
      ))}
    </div>
  );
};
