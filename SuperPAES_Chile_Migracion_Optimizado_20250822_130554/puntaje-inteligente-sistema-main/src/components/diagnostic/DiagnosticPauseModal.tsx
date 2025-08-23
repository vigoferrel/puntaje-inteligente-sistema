/* eslint-disable react-refresh/only-export-components */
import React from 'react';
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface DiagnosticPauseModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const DiagnosticPauseModal = ({
  onConfirm,
  onCancel
}: DiagnosticPauseModalProps) => {
  return (
    <AlertDialog open={true} onOpenChange={() => onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Â¿Pausar diagnÃ³stico?</AlertDialogTitle>
          <AlertDialogDescription>
            Tu progreso serÃ¡ guardado y podrÃ¡s continuar mÃ¡s tarde desde donde lo dejaste.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Continuar diagnÃ³stico</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Guardar y salir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

