/* eslint-disable react-refresh/only-export-components */
// ðŸ“¸ OCRValidator.tsx - Agente Neural de ValidaciÃ³n Leonardo Vision
// Context7 + Pensamiento Secuencial + OCR Integration

import React, { useState, useCallback, useRef } from 'react';
import { useQuantumEducationalArsenal } from '../../hooks/useQuantumEducationalArsenal';
import styles from './CuboFrontal.module.css';

// =====================================================================================
// ðŸŽ¯ INTERFACES TYPESCRIPT
// =====================================================================================

interface OCRResult {
  id: string;
  text: string;
  confidence: number;
  timestamp: number;
  language: string;
  mathDetected: boolean;
  exerciseType: string;
  suggestions: string[];
}

interface ValidationResult {
  isCorrect: boolean;
  score: number;
  feedback: string;
  improvements: string[];
  bloomLevel: number;
}

interface OCRValidatorProps {
  onValidationComplete?: (result: ValidationResult) => void;
  subject?: string;
  className?: string;
}

// =====================================================================================
// ðŸ“¸ COMPONENTE PRINCIPAL
// =====================================================================================

export const OCRValidator: React.FC<OCRValidatorProps> = ({
  onValidationComplete,
  subject = 'General',
  className = ''
}) => {
  // ðŸ”— Hooks
  const {
    trackMetric,
    isLoading
  } = useQuantumEducationalArsenal();

  // ðŸŽ¯ Estados
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ðŸŽ® Manejador de ValidaciÃ³n (definido primero para evitar dependencias circulares)
  const handleValidateExercise = useCallback(async (ocr: OCRResult) => {
    setIsProcessing(true);
    
    try {
      // Simular validaciÃ³n con IA
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockValidation: ValidationResult = {
        isCorrect: true,
        score: 95,
        feedback: 'Excelente resoluciÃ³n. Los pasos estÃ¡n bien estructurados y la verificaciÃ³n es correcta.',
        improvements: [
          'Considera explicar por quÃ© restas 5 de ambos lados',
          'PodrÃ­as mostrar la divisiÃ³n por 2 mÃ¡s claramente'
        ],
        bloomLevel: 3 // Aplicar
      };
      
      setValidationResult(mockValidation);
      
      // Registrar mÃ©trica de validaciÃ³n
      await trackMetric('exercise_validated', mockValidation.score, {
        subject,
        isCorrect: mockValidation.isCorrect,
        bloomLevel: mockValidation.bloomLevel
      });
      
      // Callback externo
      onValidationComplete?.(mockValidation);
      
    } catch (error) {
      console.error('Error validando ejercicio:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [subject, trackMetric, onValidationComplete]);

  // ðŸŽ® Manejador de SelecciÃ³n de Archivo
  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular procesamiento OCR con Leonardo Vision
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular resultado OCR
      const mockOCRResult: OCRResult = {
        id: `ocr-${Date.now()}`,
        text: `Resolver: 2x + 5 = 13\nSoluciÃ³n: x = 4\nVerificaciÃ³n: 2(4) + 5 = 8 + 5 = 13 âœ“`,
        confidence: 94.5,
        timestamp: Date.now(),
        language: 'es',
        mathDetected: true,
        exerciseType: 'EcuaciÃ³n Lineal',
        suggestions: ['Verificar pasos', 'Mostrar mÃ¡s detalle', 'Explicar conceptos']
      };
      
      setOcrResult(mockOCRResult);
      
      // Registrar mÃ©trica
      await trackMetric('ocr_processed', mockOCRResult.confidence, {
        subject,
        exerciseType: mockOCRResult.exerciseType,
        mathDetected: mockOCRResult.mathDetected
      });
      
      // ValidaciÃ³n automÃ¡tica
      await handleValidateExercise(mockOCRResult);
      
    } catch (error) {
      console.error('Error procesando OCR:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [subject, trackMetric, handleValidateExercise]);

  // ðŸŽ® Manejadores de Drag & Drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = // eslint-disable-next-line react-hooks/exhaustive-depsuseCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = // eslint-disable-next-line react-hooks/exhaustive-depsuseCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleUploadClick = // eslint-disable-next-line react-hooks/exhaustive-depsuseCallback(() => {
    fileInputRef.current?.click();
  }, []);useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRetakePhoto = useCallback(() => {
    setOcrResult(null);
    setValidationResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // ðŸŽ¨ Clases CSS
  const containerClasses = [
    styles.ocrContainer,
    className
  ].filter(Boolean).join(' ');

  const uploadZoneClasses = [
    styles.ocrUploadZone,
    dragActive ? styles.ocrUploadZoneActive : ''
  ].filter(Boolean).join(' ');

  // =====================================================================================
  // ðŸŽ¨ RENDERIZADO
  // =====================================================================================

  return (
    <div className={containerClasses}>
      <div className={styles.faceIcon}>ðŸ“¸</div>
      <div className={styles.faceName}>OCR Validator</div>
      
      {/* ðŸ“Š Estado del Procesamiento */}
      <div className={styles.faceData}>
        Leonardo Vision {isProcessing ? 'Procesando...' : 'Listo'}
      </div>

      {/* ðŸ“¸ Zona de Subida - SIN controles anidados */}
      {!ocrResult && (
        <>
          {/* Input oculto separado */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className={styles.hiddenFileInput}
            aria-label="Seleccionar archivo de imagen para procesamiento OCR"
            title="Seleccionar imagen del ejercicio"
          />
          
          {/* Zona visual de drop - NO clickeable */}
          <div
            className={uploadZoneClasses}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className={styles.ocrUploadIcon}>
              {isProcessing ? 'âš¡' : 'ðŸ“¸'}
            </div>
            <div className={styles.ocrUploadText}>
              {isProcessing 
                ? 'Procesando con Leonardo Vision...'
                : 'Arrastra imagen aquÃ­'
              }
            </div>
          </div>
          
          {/* BotÃ³n separado para activar input */}
          <button
            onClick={handleUploadClick}
            disabled={isProcessing}
            className={styles.createPlaylistButton}
            aria-label="Seleccionar imagen del ejercicio"
          >
            ðŸ“¸ Seleccionar Imagen
          </button>
        </>
      )}

      {/* ðŸ“ Resultado OCR */}
      {ocrResult && (
        <div className={styles.ocrResults}>
          <div className={styles.ocrAccuracy}>
            PrecisiÃ³n: {ocrResult.confidence.toFixed(1)}%
          </div>
          
          <div>
            <strong>Tipo:</strong> {ocrResult.exerciseType}
          </div>
          
          <div>
            <strong>MatemÃ¡ticas:</strong> {ocrResult.mathDetected ? 'SÃ­' : 'No'}
          </div>
          
          <div className={styles.ocrText}>
            {ocrResult.text}
          </div>
        </div>
      )}

      {/* âœ… Resultado de ValidaciÃ³n */}
      {validationResult && (
        <div className={styles.ocrResults}>
          <div className={styles.ocrAccuracy}>
            PuntuaciÃ³n: {validationResult.score}/100
          </div>
          
          <div>
            <strong>Estado:</strong> {validationResult.isCorrect ? 'âœ… Correcto' : 'âŒ Incorrecto'}
          </div>
          
          <div>
            <strong>Nivel Bloom:</strong> {validationResult.bloomLevel}/6
          </div>
          
          <div className={styles.ocrText}>
            <strong>Feedback:</strong><br />
            {validationResult.feedback}
          </div>
          
          {validationResult.improvements.length > 0 && (
            <div className={styles.ocrText}>
              <strong>Mejoras sugeridas:</strong><br />
              {validationResult.improvements.map((improvement, index) => (
                <div key={index}>â€¢ {improvement}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ðŸ”„ BotÃ³n de Nueva Foto */}
      {ocrResult && (
        <button
          onClick={handleRetakePhoto}
          disabled={isProcessing}
          className={styles.createPlaylistButton}
          aria-label="Tomar nueva foto del ejercicio"
        >
          ðŸ“¸ Nueva Foto
        </button>
      )}

      {/* ðŸ“Š MÃ©trica Visual */}
      <div className={styles.faceMetric}>
        <div className={`${styles.metricBar} ${styles.metricWidth89}`} />
      </div>
    </div>
  );
};

export default OCRValidator;

