/* eslint-disable react-refresh/only-export-components */
import { FC } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { Badge } from "../../../components/ui/badge";
import { TPAESPrueba, getPruebaDisplayName } from "../../../types/system-types";

interface TestSelectorProps {
  availableTests: TPAESPrueba[];
  selectedTest?: TPAESPrueba;
  onTestSelect: (test?: TPAESPrueba) => void;
}

export const TestSelector: FC<TestSelectorProps> = ({
  availableTests,
  selectedTest,
  onTestSelect
}) => {
  if (availableTests.length === 0) {
    return null;
  }
  
  // Nombres personalizados para las pruebas de matemÃ¡ticas
  const getCustomDisplayName = (test: TPAESPrueba): string => {
    switch (test) {
      case "MATEMATICA_1":
        return "MatemÃ¡tica 1 (7Â° a 2Â° medio)";
      case "MATEMATICA_2":
        return "MatemÃ¡tica 2 (3Â° y 4Â° medio)";
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

