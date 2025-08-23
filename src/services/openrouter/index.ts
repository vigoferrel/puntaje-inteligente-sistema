
// Archivo principal que re-exporta todas las funcionalidades 
// para mantener la compatibilidad con el código existente

export * from './core';
// Exportamos específicamente la función processImageWithOpenRouter desde image-processing
// con un nombre diferente para evitar ambigüedad con la función del mismo nombre en core.ts
export { processImageWithOpenRouter as processImageFromImageProcessing } from './image-processing';
export * from './exercise-generation';
export * from './diagnostics';
export * from './performance-analysis';
export * from './feedback';
