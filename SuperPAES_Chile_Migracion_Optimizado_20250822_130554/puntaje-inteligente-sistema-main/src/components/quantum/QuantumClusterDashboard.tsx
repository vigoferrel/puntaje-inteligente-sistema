import React, { useState, useCallback } from 'react';
import styles from './QuantumClusterDashboard.module.css';
import { useQuantumClusters } from '../../hooks/quantum/useQuantumClusters';

export const QuantumClusterDashboard: React.FC = () => {
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const {
    clusters,
    totalCount,
    loading,
    error,
    createCluster,
    updateCluster,
    deleteCluster,
    reload,
  } = useQuantumClusters(currentPage, pageSize, filterText);

  const totalPages = Math.ceil(totalCount / pageSize);

  const startEdit = useCallback((cluster: { id: string; name: string; description?: string }) => {
    setEditingId(cluster.id);
    setEditName(cluster.name);
    setEditDescription(cluster.description || '');
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditName('');
    setEditDescription('');
  }, []);

  const saveEdit = useCallback(async () => {
    if (editingId) {
      await updateCluster(editingId, { name: editName, description: editDescription });
      cancelEdit();
    }
  }, [editingId, editName, editDescription, updateCluster, cancelEdit]);

  const handleCreate = useCallback(async () => {
    if (newName.trim() === '') return;
    await createCluster({ name: newName, description: newDescription });
    setNewName('');
    setNewDescription('');
    setCurrentPage(1);
  }, [newName, newDescription, createCluster]);

  return (
    <div className={styles.dashboard}>
      <h2>Quantum Cluster Dashboard</h2>

      {loading && <p>Cargando clusters...</p>}
      {error && <p className={styles.error}>Error: {error}</p>}

      <div className={styles.createForm}>
        <input
          type="text"
          placeholder="Nombre del nuevo cluster"
          value={newName}
          disabled={loading}
          onChange={e => setNewName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newDescription}
          disabled={loading}
          onChange={e => setNewDescription(e.target.value)}
        />
        <button onClick={handleCreate} disabled={loading}>
          Crear Cluster
        </button>
      </div>

      <div className={styles.filterForm}>
        <input
          type="text"
          placeholder="Filtrar clusters por nombre"
          value={filterText}
          onChange={e => {
            setFilterText(e.target.value);
            setCurrentPage(1);
          }}
          disabled={loading}
        />
      </div>

      <ul className={styles.clusterList}>
        {clusters.map(cluster => (
          <li key={cluster.id} className={styles.clusterItem}>
            {editingId === cluster.id ? (
              <>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                />
                <button onClick={saveEdit} disabled={loading}>
                  Guardar
                </button>
                <button onClick={cancelEdit} disabled={loading}>
                  Cancelar
                </button>
              </>
            ) : (
              <>
                <strong>{cluster.name}</strong> - {cluster.description} <br />
                <span>Nivel: {cluster.nivel}</span> | <span>Progreso: {cluster.progreso}%</span> | <span>Estado: {cluster.estado}</span>
                <br />
                <button onClick={() => startEdit(cluster)} disabled={loading}>
                  Editar
                </button>
                <button onClick={() => deleteCluster(cluster.id)} disabled={loading}>
                  Eliminar
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className={styles.paginationControls}>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={loading || currentPage === 1}
        >
          Anterior
        </button>
        <span>
          Página {currentPage} de {totalPages || 1}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={loading || currentPage === totalPages || totalPages === 0}
        >
          Siguiente
        </button>
      </div>

      <button onClick={reload} disabled={loading}>
        Recargar
      </button>
    </div>
  );
};
