import React from 'react';
import { usePAESService } from '../hooks/usePAESService';

const PAESExamList: React.FC = () => {
  const { loading, error, exams } = usePAESService();

  if (loading) {
    return <div>Cargando exámenes PAES...</div>;
  }

  if (error) {
    return <div>Error al cargar los exámenes: {error.message}</div>;
  }

  if (!exams || exams.length === 0) {
    return <div>No hay exámenes PAES disponibles.</div>;
  }

  return (
    <div>
      <h2>Listado de Exámenes PAES</h2>
      <ul>
        {exams.map((exam) => (
          <li key={exam.codigo}>
            {exam.nombre} (Código: {exam.codigo})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PAESExamList;