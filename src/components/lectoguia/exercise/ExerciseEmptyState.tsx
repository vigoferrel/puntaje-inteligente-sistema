
import React from 'react';

export const ExerciseEmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
      <div className="h-16 w-16 text-muted-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      </div>
      <h3 className="text-xl font-medium text-foreground">No hay ejercicios activos</h3>
      <p className="text-muted-foreground max-w-md">
        Pídele a LectoGuía que te genere un ejercicio de comprensión lectora según tus necesidades.
      </p>
    </div>
  );
};
