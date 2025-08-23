
import { useState } from 'react';

/**
 * Hook para gestionar las pestañas de LectoGuia
 */
export function useTabManagement() {
  // Estado para gestionar la pestaña activa
  const [activeTab, setActiveTab] = useState("chat");

  return {
    activeTab,
    setActiveTab
  };
}
