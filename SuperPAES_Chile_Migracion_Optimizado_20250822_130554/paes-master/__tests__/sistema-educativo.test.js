/**
 * PRUEBAS UNITARIAS - SISTEMA EDUCATIVO PAES
 * Verificación de funcionalidades educativas después de la limpieza
 */

const fs = require('fs');
const path = require('path');

describe('Sistema Educativo PAES - Verificación Post-Limpieza', () => {
  
  describe('Context7 - Estructura PAES Oficial', () => {
    test('debe tener configuración educativa válida', () => {
      const configPath = 'config/educational.json';
      expect(fs.existsSync(configPath)).toBe(true);
      
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      expect(config.project.type).toBe('educational-platform');
      expect(config.educational.structure).toBe('official-paes');
    });

    test('debe incluir todas las asignaturas PAES', () => {
      const configPath = 'config/educational.json';
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      const subjectosRequeridos = [
        'MATEMATICA_M1',
        'MATEMATICA_M2',
        'COMPETENCIA_LECTORA',
        'CIENCIAS',
        'HISTORIA'
      ];
      
      subjectosRequeridos.forEach(materia => {
        expect(config.educational.subjects).toContain(materia);
      });
    });

    test('debe tener taxonomía Bloom completa', () => {
      const configPath = 'config/educational.json';
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      expect(config.educational.bloom_levels).toBe(6);
      expect(config.educational.learning_nodes).toBe('enabled');
    });
  });

  describe('Sistema Cuántico Educativo', () => {
    test('debe tener motor cuántico educativo habilitado', () => {
      const configPath = 'config/educational.json';
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      expect(config.features.quantum_engine).toBe(true);
      expect(config.educational.neural_learning).toBe('enabled');
    });
  });

  describe('Triada Renacentista Aplicativa', () => {
    test('debe integrar Arte, Ciencia y Tecnología', () => {
      const configPath = 'config/educational.json';
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      // Pilar Científico
      expect(config.educational.subjects).toContain('MATEMATICA_M1');
      expect(config.educational.subjects).toContain('MATEMATICA_M2');
      expect(config.educational.subjects).toContain('CIENCIAS');
      
      // Pilar Humanístico/Arte
      expect(config.educational.subjects).toContain('HISTORIA');
      expect(config.educational.subjects).toContain('COMPETENCIA_LECTORA');
      
      // Pilar Tecnológico
      expect(config.integrations.spotify.enabled).toBe(true);
      expect(config.integrations.spotify.purpose).toBe('educational_music');
    });
  });

  describe('Multimodalidad Gemini', () => {
    test('debe tener integración OpenRouter para contenido educativo', () => {
      const configPath = 'config/educational.json';
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      expect(config.integrations.openrouter.enabled).toBe(true);
      expect(config.integrations.openrouter.purpose).toBe('educational_content_generation');
      expect(config.features.ai_recommendations).toBe(true);
    });
  });

  describe('Plataforma PAES', () => {
    test('debe tener configuración educativa en package.json', () => {
      const packagePath = 'package.json';
      expect(fs.existsSync(packagePath)).toBe(true);
      
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      expect(packageJson.name).toBe('paes-educativo');
      expect(packageJson.description).toContain('educativ');
      expect(packageJson.keywords).toContain('paes');
      expect(packageJson.keywords).toContain('education');
    });

    test('debe tener dependencias educativas necesarias', () => {
      const packagePath = 'package.json';
      const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
      
      expect(packageJson.dependencies['@supabase/supabase-js']).toBeDefined();
      expect(packageJson.dependencies['typescript']).toBeDefined();
      expect(packageJson.dependencies['dotenv']).toBeDefined();
    });

    test('debe tener base de datos educativa configurada', () => {
      const configPath = 'config/educational.json';
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      expect(config.integrations.supabase.enabled).toBe(true);
      expect(config.integrations.supabase.schema).toBe('educational');
    });
  });

  describe('Integridad del Sistema - Post Limpieza', () => {
    test('NO debe contener componentes de trading', () => {
      const componentesProhibidos = [
        'quantum-core',
        'quantum-ui',
        'trading',
        'binance',
        'leonardo'
      ];
      
      componentesProhibidos.forEach(componente => {
        expect(fs.existsSync(componente)).toBe(false);
      });
    });

    test('debe mantener solo archivos educativos', () => {
      const archivosEducativos = [
        'config/educational.json',
        'package.json',
        'README.md'
      ];
      
      archivosEducativos.forEach(archivo => {
        expect(fs.existsSync(archivo)).toBe(true);
      });
    });

    test('NO debe tener referencias a trading en configuración', () => {
      const configPath = 'config/educational.json';
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      const configString = JSON.stringify(config).toLowerCase();
      
      const terminosProhibidos = ['trading', 'binance', 'leonardo', 'leverage', 'arbitrage'];
      terminosProhibidos.forEach(termino => {
        expect(configString).not.toContain(termino);
      });
    });

    test('debe tener variables de entorno educativas', () => {
      const configPath = 'config/educational.json';
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      const variablesRequeridas = [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'OPENROUTER_API_KEY',
        'SPOTIFY_CLIENT_ID',
        'SPOTIFY_CLIENT_SECRET'
      ];
      
      variablesRequeridas.forEach(variable => {
        expect(config.security.environment_variables).toContain(variable);
      });
    });
  });

  describe('Funcionalidades Analytics y Seguimiento', () => {
    test('debe tener análisis y seguimiento de progreso habilitado', () => {
      const configPath = 'config/educational.json';
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      
      expect(config.features.analytics).toBe(true);
      expect(config.features.progress_tracking).toBe(true);
    });
  });
});
