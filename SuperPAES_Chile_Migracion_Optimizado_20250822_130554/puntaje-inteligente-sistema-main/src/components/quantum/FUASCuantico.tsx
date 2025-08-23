/* eslint-disable react-refresh/only-export-components */
// ðŸŽ“ FUASCuantico.tsx - Agente Neural del Sistema de Becas FUAS
// Context7 + Pensamiento Secuencial + FUAS Integration

import React, { useState, useEffect, useCallback } from 'react';
import { useQuantumEducationalArsenal } from '../../hooks/useQuantumEducationalArsenal';
import styles from './CuboFrontal.module.css';

// =====================================================================================
// ðŸŽ¯ INTERFACES TYPESCRIPT
// =====================================================================================

interface FUASScholarship {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  requirements: string[];
  university: string;
  career: string;
  deadline: string;
  status: 'available' | 'pending' | 'not_eligible';
}

interface FUASProgress {
  currentScore: number;
  requiredScore: number;
  socialScore: number;
  academicScore: number;
  eligibilityPercentage: number;
  documentsSubmitted: number;
  totalDocuments: number;
}

interface FUASCuanticoProps {
  onScholarshipSelect?: (scholarship: FUASScholarship) => void;
  currentPAESScore?: number;
  className?: string;
}

// =====================================================================================
// ðŸŽ“ BECAS FUAS DISPONIBLES
// =====================================================================================

const FUAS_SCHOLARSHIPS: FUASScholarship[] = [
  {
    id: 'bea-excelencia',
    name: 'Beca de Excelencia AcadÃ©mica',
    amount: 1500000,
    percentage: 100,
    requirements: ['PAES â‰¥ 700', 'Ranking â‰¥ 90%', 'NEM â‰¥ 6.5'],
    university: 'Universidad de Chile',
    career: 'IngenierÃ­a',
    deadline: '2024-12-15',
    status: 'available'
  },
  {
    id: 'bea-socioecon',
    name: 'Beca SocioeconÃ³mica',
    amount: 1200000,
    percentage: 80,
    requirements: ['Quintil I-III', 'PAES â‰¥ 500', 'Documentos socioeconÃ³micos'],
    university: 'Universidad de Chile',
    career: 'IngenierÃ­a',
    deadline: '2024-12-20',
    status: 'pending'
  },
  {
    id: 'bea-regional',
    name: 'Beca de Apoyo Regional',
    amount: 800000,
    percentage: 50,
    requirements: ['RegiÃ³n extrema', 'PAES â‰¥ 450', 'Certificado residencia'],
    university: 'Universidad de Chile',
    career: 'IngenierÃ­a',
    deadline: '2024-12-25',
    status: 'not_eligible'
  },
  {
    id: 'bea-indigena',
    name: 'Beca IndÃ­gena',
    amount: 1000000,
    percentage: 70,
    requirements: ['AcreditaciÃ³n Ã©tnica', 'PAES â‰¥ 400', 'Certificado CONADI'],
    university: 'Universidad de Chile',
    career: 'IngenierÃ­a',
    deadline: '2024-12-30',
    status: 'available'
  }
];

// =====================================================================================
// ðŸŽ“ COMPONENTE PRINCIPAL
// =====================================================================================

export const FUASCuantico: React.FC<FUASCuanticoProps> = ({
  onScholarshipSelect,
  currentPAESScore = 650,
  className = ''
}) => {
  // ðŸ”— Hooks
  const {
    arsenalMetrics,
    trackMetric,
    generatePAESSimulation,
    isLoading
  } = useQuantumEducationalArsenal();

  // ðŸŽ¯ Estados
  const [selectedScholarship, setSelectedScholarship] = useState<FUASScholarship | null>(null);
  const [fuasProgress, setFuasProgress] = useState<FUASProgress>({
    currentScore: currentPAESScore,
    requiredScore: 700,
    socialScore: 85,
    academicScore: 78,
    eligibilityPercentage: 75,
    documentsSubmitted: 3,
    totalDocuments: 5
  });
  const [scholarships, setScholarships] = useState<FUASScholarship[]>(FUAS_SCHOLARSHIPS);

  // ðŸŽ® Manejadores
  const handleScholarshipSelect = useCallback(async (scholarship: FUASScholarship) => {
    setSelectedScholarship(scholarship);
    
    // Registrar mÃ©trica
    await trackMetric('fuas_scholarship_selected', scholarship.percentage, {
      scholarshipId: scholarship.id,
      amount: scholarship.amount,
      status: scholarship.status
    });

    // Callback externo
    onScholarshipSelect?.(scholarship);
  }, [trackMetric, onScholarshipSelect]);

  const handleSimulatePAES = useCallback(async () => {
    // Generar simulaciÃ³n PAES para mejorar puntaje
    const scores = {
      'MatemÃ¡ticas': fuasProgress.currentScore + 50,
      'ComprensiÃ³n Lectora': fuasProgress.currentScore + 30,
      'Ciencias': fuasProgress.currentScore + 40
    };
    
    await generatePAESSimulation(scores);
    
    await trackMetric('fuas_paes_simulation', fuasProgress.currentScore, {
      targetScore: fuasProgress.requiredScore,
      improvement: 50
    });
  }, [fuasProgress, generatePAESSimulation, trackMetric]);

  const handleSubmitDocuments = useCallback(async () => {
    // Simular envÃ­o de documentos
    setFuasProgress(prev => ({
      ...prev,
      documentsSubmitted: Math.min(prev.documentsSubmitted + 1, prev.totalDocuments),
      eligibilityPercentage: Math.min(prev.eligibilityPercentage + 5, 100)
    }));
    
    await trackMetric('fuas_documents_submitted', fuasProgress.documentsSubmitted + 1, {
      totalDocuments: fuasProgress.totalDocuments,
      eligibilityPercentage: fuasProgress.eligibilityPercentage + 5
    });
  }, [fuasProgress, trackMetric]);

  // ðŸ”„ Efectos
  useEffect(() => {
    // Actualizar elegibilidad basada en mÃ©tricas del arsenal
    const newScore = Math.round(currentPAESScore + (arsenalMetrics.engagement_score * 2));
    const newEligibility = Math.min((newScore / fuasProgress.requiredScore) * 100, 100);
    
    setFuasProgress(prev => ({
      ...prev,
      currentScore: newScore,
      eligibilityPercentage: newEligibility
    }));
    
    // Actualizar estado de becas
    setScholarships(prevScholarships => 
      prevScholarships.map(scholarship => {
        const minScore = parseInt(scholarship.requirements[0]?.match(/\d+/)?.[0] || '0');
        const isEligible = newScore >= minScore;
        
        return {
          ...scholarship,
          status: isEligible ? 'available' : 'not_eligible'
        };
      })
    );
  }, [currentPAESScore, arsenalMetrics.engagement_score, fuasProgress.requiredScore]);

  // ðŸŽ¨ Clases CSS
  const containerClasses = [
    styles.fuasContainer,
    className
  ].filter(Boolean).join(' ');

  // ðŸ“Š Calcular progreso
  const progressPercentage = Math.min((fuasProgress.currentScore / fuasProgress.requiredScore) * 100, 100);
  const documentsPercentage = (fuasProgress.documentsSubmitted / fuasProgress.totalDocuments) * 100;
  
  // Clases dinÃ¡micas para progreso
  const progressClass = `fuasProgressWidth${Math.round(progressPercentage / 5) * 5}`;
  const documentsClass = `fuasProgressWidth${Math.round(documentsPercentage / 5) * 5}`;

  // ðŸŽ¨ Obtener clase de estado
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'available':
        return styles.fuasStatusAvailable;
      case 'pending':
        return styles.fuasStatusPending;
      default:
        return styles.fuasStatusNotEligible;
    }
  };

  // =====================================================================================
  // ðŸŽ¨ RENDERIZADO
  // =====================================================================================

  return (
    <div className={containerClasses}>
      <div className={styles.faceIcon}>ðŸŽ“</div>
      <div className={styles.faceName}>FUAS CuÃ¡ntico</div>
      
      {/* ðŸ“Š Progreso Actual */}
      <div className={styles.faceData}>
        Puntaje: {fuasProgress.currentScore}/{fuasProgress.requiredScore}
      </div>

      {/* ðŸŽ¯ Barra de Progreso PAES */}
      <div className={styles.fuasProgress}>
        <div className={styles.fuasProgressBar}>
          <div className={`${styles.fuasProgressFill} ${styles[progressClass]}`} />
        </div>
        <div className={styles.fuasRequirements}>
          Elegibilidad: {Math.round(fuasProgress.eligibilityPercentage)}%
        </div>
      </div>

      {/* ðŸ“„ Progreso de Documentos */}
      <div className={styles.fuasProgress}>
        <div className={styles.fuasProgressBar}>
          <div className={`${styles.fuasProgressFill} ${styles[documentsClass]}`} />
        </div>
        <div className={styles.fuasRequirements}>
          Documentos: {fuasProgress.documentsSubmitted}/{fuasProgress.totalDocuments}
        </div>
      </div>

      {/* ðŸŽ“ Lista de Becas */}
      <div className={styles.fuasScholarshipList}>
        {scholarships.map((scholarship) => (
          <div
            key={scholarship.id}
            onClick={() => handleScholarshipSelect(scholarship)}
            className={`
              ${styles.fuasScholarshipItem}
              ${selectedScholarship?.id === scholarship.id ? styles.playlistItemSelected : ''}
            `.trim()}
          >
            <div className={styles.fuasScholarshipName}>
              {scholarship.name}
            </div>
            <div className={styles.fuasScholarshipAmount}>
              ${scholarship.amount.toLocaleString()} ({scholarship.percentage}%)
            </div>
            <div className={`${styles.fuasStatus} ${getStatusClass(scholarship.status)}`}>
              {scholarship.status === 'available' && 'âœ… Disponible'}
              {scholarship.status === 'pending' && 'â³ Pendiente'}
              {scholarship.status === 'not_eligible' && 'âŒ No elegible'}
            </div>
          </div>
        ))}
      </div>

      {/* ðŸŽ¯ Acciones FUAS */}
      <div className={styles.bloomSkillsGrid}>
        <button
          onClick={handleSimulatePAES}
          disabled={isLoading}
          className={styles.bloomSkillButton}
        >
          ðŸ“Š Simular PAES
        </button>
        
        <button
          onClick={handleSubmitDocuments}
          disabled={isLoading || fuasProgress.documentsSubmitted >= fuasProgress.totalDocuments}
          className={`
            ${styles.bloomSkillButton}
            ${fuasProgress.documentsSubmitted >= fuasProgress.totalDocuments ? styles.bloomSkillButtonCompleted : ''}
          `.trim()}
        >
          ðŸ“„ Enviar Docs {fuasProgress.documentsSubmitted >= fuasProgress.totalDocuments && 'âœ“'}
        </button>
      </div>

      {/* ðŸ“Š Estado General */}
      <div className={`${styles.fuasStatus} ${getStatusClass(fuasProgress.eligibilityPercentage > 80 ? 'available' : 'pending')}`}>
        {fuasProgress.eligibilityPercentage > 80 
          ? 'ðŸŽ‰ Excelente elegibilidad para becas'
          : 'ðŸ“ˆ Mejora tu puntaje para mÃ¡s opciones'
        }
      </div>

      {/* ðŸ“Š MÃ©trica Visual */}
      <div className={styles.faceMetric}>
        <div className={`${styles.metricBar} ${styles.metricWidth85}`} />
      </div>
    </div>
  );
};

export default FUASCuantico;
