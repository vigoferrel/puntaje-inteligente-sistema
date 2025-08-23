/**
 * QBTC VigoleonRocks - Quantum Configuration
 * Copyright (c) 2025 VigoleonRocks
 * All rights reserved
 */

const quantumConfig = {
    // Configuración de qubits
    quantum: {
        qubits: 8,                    // Número de qubits
        coherenceTime: 1000,          // Tiempo de coherencia (ms)
        entanglementPairs: 4,         // Pares entrelazados
        gateCalibration: true         // Calibración automática
    },

    // Configuración temporal
    temporal: {
        horizons: [300000, 900000, 3600000, 14400000],  // 5m, 15m, 1h, 4h
        patterns: ['fibonacci', 'elliott', 'cycles'],    // Patrones activos
        fusionWeights: [0.4, 0.35, 0.25]                // Pesos de fusión
    },

    // Configuración de arbitraje
    arbitrage: {
        dimensions: 6,                // Dimensiones activas
        maxPositions: 5,              // Posiciones máximas
        minProfit: 0.001,            // Profit mínimo (0.1%)
        riskMatrix: true,             // Matriz de riesgo activa
        diversification: true         // Diversificación dimensional
    },

    // Estrategias de trading
    strategies: {
        CONSERVATIVE: {
            minConfidence: 0.8,       // Confianza mínima: 80%
            minStrength: 0.7,         // Fuerza mínima: 70%
            risk: 'low',              // Riesgo: Bajo
            leverage: [1, 2]          // Leverage: 1-2x
        },
        MODERATE: {
            minConfidence: 0.6,       // Confianza mínima: 60%
            minStrength: 0.5,         // Fuerza mínima: 50%
            risk: 'medium',           // Riesgo: Medio
            leverage: [2, 3]          // Leverage: 2-3x
        },
        AGGRESSIVE: {
            minConfidence: 0.4,       // Confianza mínima: 40%
            minStrength: 0.3,         // Fuerza mínima: 30%
            risk: 'high',             // Riesgo: Alto
            leverage: [3, 5]          // Leverage: 3-5x
        },
        QUANTUM_MAX: {
            minConfidence: 0.2,       // Confianza mínima: 20%
            minStrength: 0.1,         // Fuerza mínima: 10%
            risk: 'maximum',          // Riesgo: Máximo
            leverage: [5, 10]         // Leverage: 5-10x
        }
    }
};

module.exports = quantumConfig;
