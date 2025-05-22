
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DiagnosticPauseModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const DiagnosticPauseModal = ({
  onConfirm,
  onCancel,
}: DiagnosticPauseModalProps) => {
  return (
    <AlertDialog open={true} onOpenChange={() => onCancel()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Pausar diagnóstico?</AlertDialogTitle>
          <AlertDialogDescription>
            Tu progreso será guardado y podrás continuar más tarde desde donde lo dejaste.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Continuar diagnóstico</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            Guardar y salir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
