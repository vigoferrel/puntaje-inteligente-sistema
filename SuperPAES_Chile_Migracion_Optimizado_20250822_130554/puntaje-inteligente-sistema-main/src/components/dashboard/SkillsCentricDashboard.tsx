/* eslint-disable react-refresh/only-export-components */
// Optimizado con Context7 - React.memo aplicado
import React, { useState, useEffect } from 'react'
import { memo } from 'react';;
import type { SafeString, SafeNumber, SafeBoolean, APIResponse, OperationResult } from '../../types/core';
import { motion, AnimatePresence } from 'framer-motion';
import { useGlobalCinematic } from '../../hooks/useGlobalCinematic';
import './SkillsCentricDashboard.css';

// Skills especÃƒÂ­ficas por prueba PAES segÃƒÂºn el plan
const SKILLS_BY_TEST = {
  'CL-TEST': ['LOC-001', 'INT-002', 'ANA-003', 'EVA-004', 'ARG-007'],
  'M1-TEST': ['RES-005', 'MOD-006'],
  'M2-TEST': ['RES-005', 'MOD-006'],
  'HST-TEST': ['LOC-001', 'INT-002', 'ANA-003', 'EVA-004', 'ARG-007'],
  'CIE-TEST': ['LOC-001', 'ANA-003', 'RES-005']
};

const SKILL_CONFIG = {
  'LOC-001': {
    name: 'Localizar InformaciÃƒÂ³n',
    color: '#06b6d4', // Cyan
    icon: 'Ã°Å¸â€Â',
    description: 'Identificar y extraer informaciÃƒÂ³n especÃƒÂ­fica de textos',
    tests: ['CL', 'HST', 'CIE']
  },
  'INT-002': {
    name: 'Interpretar y Relacionar',
    color: '#8b5cf6', // PÃƒÂºrpura
    icon: 'Ã°Å¸Â§Â©',
    description: 'Establecer conexiones entre ideas y conceptos',
    tests: ['CL', 'M1', 'HST']
  },
  'ANA-003': {
    name: 'Analizar y Sintetizar',
    color: '#10b981', // Esmeralda
    icon: 'Ã¢Å¡â€”Ã¯Â¸Â',
    description: 'Descomponer y reorganizar informaciÃƒÂ³n compleja',
    tests: ['CL', 'HST', 'CIE']
  },
  'EVA-004': {
    name: 'Evaluar y Reflexionar',
    color: '#f59e0b', // Dorado
    icon: 'Ã¢Å¡â€“Ã¯Â¸Â',
    description: 'Emitir juicios crÃƒÂ­ticos fundamentados',
    tests: ['CL', 'HST']
  },
  'RES-005': {
    name: 'Resolver Problemas',
    color: '#ef4444', // Rojo
    icon: 'Ã°Å¸â€ºÂ Ã¯Â¸Â',
    description: 'Aplicar estrategias para solucionar situaciones',
    tests: ['M1', 'M2', 'CIE']
  },
  'MOD-006': {
    name: 'Modelar',
    color: '#a855f7', // Violeta
    icon: 'Ã°Å¸Ââ€”Ã¯Â¸Â',
    description: 'Representar situaciones mediante modelos',
    tests: ['M1', 'M2']
  },
  'ARG-007': {
    name: 'Argumentar y Comunicar',
    color: '#f97316', // Naranja
    icon: 'Ã°Å¸Å½Â­',
    description: 'Construir y expresar argumentos coherentes',
    tests: ['CL', 'HST']
  }
};

const TEST_UNIVERSES = {
  'CL': {
    name: 'Competencia Lectora',
    nodes: 30,
    color: '#06b6d4',
    description: 'Universo literario con efectos de texto flotante'
  },
  'M1': {
    name: 'MatemÃƒÂ¡tica M1',
    nodes: 25,
    color: '#8b5cf6',
    description: 'Universo geomÃƒÂ©trico con visualizaciones 3D'
  },
  'M2': {
    name: 'MatemÃƒÂ¡tica M2',
    nodes: 15,
    color: '#a855f7',
    description: 'Universo matemÃƒÂ¡tico avanzado'
  },
  'HST': {
    name: 'Historia',
    nodes: 65,
    color: '#f59e0b',
    description: 'Universo temporal con lÃƒÂ­neas de tiempo cinematogrÃƒÂ¡ficas'
  },
  'CIE': {
    name: 'Ciencias',
    nodes: 65,
    color: '#10b981',
    description: 'Universo molecular con efectos de laboratorio'
  }
};

interface SkillsCentricDashboardProps {
  onSkillSelect?: (skillCode: string) => void;
  onTestSelect?: (testCode: string) => void;
}

export const SkillsCentricDashboard: React.FC<SkillsCentricDashboardProps> = ({
  onSkillSelect,
  onTestSelect
}) => {
  const { state } = useGlobalCinematic();
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'skills' | 'tests' | 'matrix'>('skills');

  const handleSkillClick = (skillCode: string) => {
    setSelectedSkill(skillCode);
    onSkillSelect?.(skillCode);
  };

  const handleTestClick = (testCode: string) => {
    setSelectedTest(testCode);
    onTestSelect?.(testCode);
  };

  return (
    <div className="skills-centric-dashboard min-h-screen p-6">
      {/* Header con navegaciÃƒÂ³n de vistas */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-4xl font-bold text-white mb-4 cinematic-text-glow">
          Ã°Å¸Å½Â¬ SuperPAES Universe Advance
        </h1>
        <p className="text-white/80 text-lg mb-6">
          Skills por Prueba EspecÃƒÂ­fica - Base Fundacional de 200 Nodos PAES
        </p>
        
        {/* Selector de vista */}
        <div className="flex gap-4 mb-6">
          {[
            { key: 'skills', label: 'Skills View', icon: 'Ã°Å¸Å½Â¯' },
            { key: 'tests', label: 'Tests Universe', icon: 'Ã°Å¸Å’Å’' },
            { key: 'matrix', label: 'Skills Matrix', icon: 'Ã°Å¸â€â€”' }
          ].map((view) => (
            <motion.button
              key={view.key}
              onClick={() => setViewMode(view.key as 'skills' | 'tests' | 'matrix')}
              className={`px-6 py-3 rounded-lg border transition-all duration-300 ${
                viewMode === view.key
                  ? 'bg-purple-600/30 border-purple-400 text-white'
                  : 'bg-black/20 border-white/20 text-white/70 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {view.icon} {view.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {viewMode === 'skills' && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="skills-grid"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Ã°Å¸Å½Â¯ Skills EspecÃƒÂ­ficas por Competencia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Object.entries(SKILL_CONFIG).map(([skillCode, skill]) => (
                <motion.div
                  key={skillCode}
                  onClick={() => handleSkillClick(skillCode)}
                  className={`skill-card ${
                    selectedSkill === skillCode ? 'selected' : ''
                  } skill-card-${skillCode.toLowerCase().split('-')[0]}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center mb-4">
                    <span className="text-3xl mr-3">{skill.icon}</span>
                    <div>
                      <h3 className={`font-bold text-lg skill-name-${skillCode.toLowerCase().split('-')[0]}`}>
                        {skill.name}
                      </h3>
                      <p className="text-white/60 text-sm">{skillCode}</p>
                    </div>
                  </div>
                  
                  <p className="text-white/80 text-sm mb-4">
                    {skill.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {skill.tests.map((test) => (
                      <span
                        key={test}
                        className="px-2 py-1 bg-black/30 rounded text-xs text-white/70"
                      >
                        {test}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {viewMode === 'tests' && (
          <motion.div
            key="tests"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="tests-grid"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Ã°Å¸Å’Å’ Universos de Prueba PAES
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(TEST_UNIVERSES).map(([testCode, test]) => (
                <motion.div
                  key={testCode}
                  onClick={() => handleTestClick(testCode)}
                  className={`test-universe-card ${
                    selectedTest === testCode ? 'selected' : ''
                  } test-universe-card-${testCode.toLowerCase()}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <h3 className={`text-2xl font-bold mb-2 test-name-${testCode.toLowerCase()}`}>
                    {test.name}
                  </h3>
                  
                  <div className="flex items-center mb-4">
                    <span className="text-white/60 text-sm">
                      {test.nodes} nodos de aprendizaje
                    </span>
                  </div>
                  
                  <p className="text-white/80 text-sm mb-6">
                    {test.description}
                  </p>
                  
                  {/* Skills asociadas */}
                  <div className="space-y-2">
                    <p className="text-white/60 text-xs uppercase tracking-wide">
                      Skills Asociadas:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {SKILLS_BY_TEST[`${testCode}-TEST` as keyof typeof SKILLS_BY_TEST]?.map((skillCode) => (
                        <span
                          key={skillCode}
                          className={`px-2 py-1 rounded text-xs skill-badge-${skillCode.toLowerCase().split('-')[0]}`}
                        >
                          {SKILL_CONFIG[skillCode as keyof typeof SKILL_CONFIG].icon} {skillCode}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {viewMode === 'matrix' && (
          <motion.div
            key="matrix"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="skills-matrix"
          >
            <h2 className="text-2xl font-bold text-white mb-6">
              Ã°Å¸â€â€” Matriz Skills Ãƒâ€” Pruebas PAES
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 text-left text-white/80 border-b border-white/20">
                      Skill
                    </th>
                    {Object.entries(TEST_UNIVERSES).map(([testCode, test]) => (
                      <th
                        key={testCode}
                        className={`p-4 text-center border-b border-white/20 test-name-${testCode.toLowerCase()}`}
                      >
                        {testCode}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(SKILL_CONFIG).map(([skillCode, skill]) => (
                    <tr key={skillCode} className="border-b border-white/10">
                      <td className="p-4">
                        <div className="flex items-center">
                          <span className="text-2xl mr-3">{skill.icon}</span>
                          <div>
                            <p className={`font-bold skill-name-${skillCode.toLowerCase().split('-')[0]}`}>
                              {skill.name}
                            </p>
                            <p className="text-white/60 text-sm">{skillCode}</p>
                          </div>
                        </div>
                      </td>
                      {Object.keys(TEST_UNIVERSES).map((testCode) => (
                        <td key={testCode} className="p-4 text-center">
                          {skill.tests.includes(testCode) ? (
                            <motion.div
                              className={`w-8 h-8 rounded-full mx-auto matrix-cell-active skill-card-${skillCode.toLowerCase().split('-')[0]}`}
                              whileHover={{ scale: 1.2 }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full mx-auto matrix-cell-inactive" />
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* InformaciÃƒÂ³n de progreso */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-12 p-6 bg-black/20 rounded-xl border border-white/20"
      >
        <h3 className="text-xl font-bold text-white mb-4">
          Ã°Å¸â€œÅ  Base Fundacional SuperPAES
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(TEST_UNIVERSES).map(([testCode, test]) => (
            <div key={testCode} className="text-center">
              <div className={`text-2xl font-bold mb-1 test-name-${testCode.toLowerCase()}`}>
                {test.nodes}
              </div>
              <div className="text-white/60 text-sm">
                Nodos {testCode}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="text-center">
            <span className="text-3xl font-bold text-purple-400">200</span>
            <span className="text-white/80 ml-2">Nodos PAES Totales</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default React.memo(SkillsCentricDashboard);

