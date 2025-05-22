
// Archivo principal que re-exporta todas las funcionalidades 
// para mantener la compatibilidad con el código existente

export * from './core';
// No reexportamos processImageWithOpenRouter para evitar ambigüedad
export { default as processImageFromImageProcessing } from './image-processing';
export * from './exercise-generation';
export * from './diagnostics';
export * from './performance-analysis';
export * from './feedback';
