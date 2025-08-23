/* eslint-disable react-refresh/only-export-components */
// ComandanteInvisible.tsx - Comandante invisible del Organismo Dirac 
import React, { useEffect } from 'react'; 
import { useOrganismoDiracContext } from '../../contexts/OrganismoDiracProvider'; 
 
interface ComandanteInvisibleProps { 
  className?: string; 
} 
 
export const ComandanteInvisible: React.FC<ComandanteInvisibleProps> = ({ className }) => { 
  const { organismoActivo, saludGeneral, comandarInterfazEducativa } = useOrganismoDiracContext(); 
 
  useEffect(() => { 
    if (!organismoActivo) return; 
    console.log('ComandanteInvisible: Organismo Dirac ACTIVO'); 
    comandarInterfazEducativa('inicializar', { salud: saludGeneral }); 
  }, [organismoActivo, saludGeneral, comandarInterfazEducativa]); 
 
  if (process.env.NODE_ENV === 'development') { 
    return ( 
      <div className={`fixed top-2 right-2 z-50 opacity-20 ${className || ''}`} 
           style={{ width: '8px', height: '8px', borderRadius: '50%', 
                    background: saludGeneral > 80 ? '#10b981' : '#f59e0b' }} 
           title={`Organismo Dirac - Salud: ${saludGeneral}%`} /> 
    ); 
  } 
  return null; 
}; 
 
export default ComandanteInvisible; 

