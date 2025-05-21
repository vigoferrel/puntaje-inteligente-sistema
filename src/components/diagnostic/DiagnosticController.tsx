
import React from "react";
import { useDiagnosticController, DiagnosticControllerState } from "@/hooks/use-diagnostic-controller";

export interface DiagnosticControllerProps {
  children: (props: DiagnosticControllerState) => React.ReactNode;
}

export { type DiagnosticControllerState };

export const DiagnosticController: React.FC<DiagnosticControllerProps> = ({ children }) => {
  const controllerState = useDiagnosticController();
  
  return children(controllerState);
};
