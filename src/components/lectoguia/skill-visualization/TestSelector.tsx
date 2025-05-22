
import React from "react";
import { Badge } from "@/components/ui/badge";
import { TPAESPrueba, getPruebaDisplayName } from "@/types/system-types";

interface TestSelectorProps {
  availableTests: TPAESPrueba[];
  selectedTest?: TPAESPrueba;
  onTestSelect: (test?: TPAESPrueba) => void;
}

export const TestSelector: React.FC<TestSelectorProps> = ({
  availableTests,
  selectedTest,
  onTestSelect
}) => {
  if (availableTests.length === 0) {
    return null;
  }
  
  // Nombres personalizados para las pruebas de matemáticas
  const getCustomDisplayName = (test: TPAESPrueba): string => {
    switch (test) {
      case "MATEMATICA_1":
        return "Matemática 1 (7° a 2° medio)";
      case "MATEMATICA_2":
        return "Matemática 2 (3° y 4° medio)";
      default:
        return getPruebaDisplayName(test);
    }
  };
  
  return (
    <div className="flex gap-2 flex-wrap">
      <Badge 
        variant={selectedTest ? "outline" : "default"} 
        className="cursor-pointer"
        onClick={() => onTestSelect(undefined)}
      >
        Todas las pruebas
      </Badge>
      {availableTests.map(test => (
        <Badge 
          key={test} 
          variant={selectedTest === test ? "default" : "outline"} 
          className="cursor-pointer"
          onClick={() => onTestSelect(test)}
        >
          {getCustomDisplayName(test)}
        </Badge>
      ))}
    </div>
  );
};
