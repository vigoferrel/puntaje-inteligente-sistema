/* eslint-disable react-refresh/only-export-components */
import { FC, ReactNode } from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../types/core';

import { useDiagnosticController, DiagnosticControllerState } from "../../hooks/use-diagnostic-controller";

export interface DiagnosticControllerProps {
  children: (props: DiagnosticControllerState) => ReactNode;
}

export { type DiagnosticControllerState };

export const DiagnosticController: FC<DiagnosticControllerProps> = ({ children }) => {
  const controllerState = useDiagnosticController();
  
  return children(controllerState);
};

