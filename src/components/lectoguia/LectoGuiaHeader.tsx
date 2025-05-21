
import React from 'react';

export const LectoGuiaHeader: React.FC = () => {
  return (
    <div className="flex flex-col space-y-2">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground">LectoGuía AI</h1>
      <p className="text-muted-foreground">Tu asistente personalizado para mejorar tu competencia lectora en la PAES</p>
    </div>
  );
};
