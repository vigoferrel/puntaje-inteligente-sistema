#!/usr/bin/env node
/**
 * Script de verificación de la unificación completa del sistema cuántico
 * Verifica que todos los usos de Math.random() han sido reemplazados
 * y que el sistema cuántico está correctamente implementado
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Configuración de archivos y directorios a verificar
const CONFIG = {
  // Directorios a incluir en la búsqueda
  includeDirs: [
    'app',
    'lib',
    'components',
    'pages',
    'src',
    'fuentes/bloom-skill-flow-main/src'
  ],
  
  // Extensiones de archivos a verificar
  fileExtensions: ['.ts', '.tsx', '.js', '.jsx'],
  
  // Directorios a excluir
  excludeDirs: [
    'node_modules',
    '.next',
    'dist',
    'build',
    '.git',
    'reading-competence-app/dist' // Código compilado externo
  ],
  
  // Archivos específicos a excluir (código compilado/bibliotecas externas)
  excludeFiles: [
    'dashboard.aa786e0d.js' // Código compilado de bibliotecas externas
  ]
};

class QuantumUnificationVerifier {
  constructor() {
    this.results = {
      totalFiles: 0,
      verifiedFiles: 0,
      mathRandomUsages: [],
      quantumImplementations: [],
      issues: [],
      summary: {}
    };
  }

  /**
   * Ejecuta la verificación completa
   */
  async verify() {
    console.log('🔍 Iniciando verificación de unificación del sistema cuántico...\n');
    
    try {
      // Verificar estructura del proyecto
      await this.verifyProjectStructure();
      
      // Buscar usos restantes de Math.random()
      await this.scanForMathRandom();
      
      // Verificar implementaciones del sistema cuántico
      await this.verifyQuantumImplementations();
      
      // Verificar configuración y endpoints
      await this.verifySystemConfiguration();
      
      // Generar reporte
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Error durante la verificación:', error);
      process.exit(1);
    }
  }

  /**
   * Verifica la estructura básica del proyecto
   */
  async verifyProjectStructure() {
    console.log('📁 Verificando estructura del proyecto...');
    
    const requiredFiles = [
      'lib/utils/quantumRandom.ts',
      'app/api/quantum-status/route.ts',
      'lib/services/examGeneratorService.ts'
    ];
    
    for (const file of requiredFiles) {
      const filePath = path.join(PROJECT_ROOT, file);
      if (!fs.existsSync(filePath)) {
        this.results.issues.push({
          type: 'missing_file',
          file: file,
          message: 'Archivo requerido del sistema cuántico no encontrado'
        });
      } else {
        console.log(`  ✅ ${file}`);
      }
    }
  }

  /**
   * Busca usos restantes de Math.random() en el código fuente
   */
  async scanForMathRandom() {
    console.log('\n🔎 Buscando usos restantes de Math.random()...');
    
    const files = this.getSourceFiles();
    
    for (const file of files) {
      this.results.totalFiles++;
      const content = fs.readFileSync(file, 'utf8');
      
      // Buscar Math.random()
      const mathRandomMatches = this.findMathRandomUsages(content, file);
      
      if (mathRandomMatches.length > 0) {
        this.results.mathRandomUsages.push({
          file: this.getRelativePath(file),
          matches: mathRandomMatches
        });
      } else {
        this.results.verifiedFiles++;
      }
    }
    
    if (this.results.mathRandomUsages.length === 0) {
      console.log('  ✅ No se encontraron usos de Math.random() en el código fuente');
    } else {
      console.log(`  ⚠️  Se encontraron ${this.results.mathRandomUsages.length} archivos con Math.random()`);
    }
  }

  /**
   * Encuentra usos de Math.random() en el contenido
   */
  findMathRandomUsages(content, filePath) {
    const lines = content.split('\n');
    const matches = [];
    
    lines.forEach((line, index) => {
      if (line.includes('Math.random()')) {
        // Verificar si es un uso legítimo (comentarios, fallbacks, etc.)
        const isComment = line.trim().startsWith('//') || line.trim().startsWith('*');
        const isFallback = line.includes('fallback') || line.includes('Fallback');
        const isDocumentation = line.includes('reemplaza') || line.includes('sistema');
        
        const usage = {
          lineNumber: index + 1,
          content: line.trim(),
          isLegitimate: isComment || isFallback || isDocumentation
        };
        
        matches.push(usage);
      }
    });
    
    return matches;
  }

  /**
   * Verifica las implementaciones del sistema cuántico
   */
  async verifyQuantumImplementations() {
    console.log('\n⚛️  Verificando implementaciones del sistema cuántico...');
    
    const quantumFiles = [
      'lib/utils/quantumRandom.ts',
      'lib/services/examGeneratorService.ts',
      'lib/services/examSessionService.ts',
      'lib/services/recommendationService.ts',
      'lib/services/userDataService.ts',
      'fuentes/bloom-skill-flow-main/src/bloom-assessment/ProgressiveAssessment.ts'
    ];
    
    for (const file of quantumFiles) {
      const filePath = path.join(PROJECT_ROOT, file);
      
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        const implementation = this.analyzeQuantumImplementation(content, file);
        
        this.results.quantumImplementations.push(implementation);
        
        if (implementation.hasQuantumImport && implementation.hasQuantumUsage) {
          console.log(`  ✅ ${file} - Sistema cuántico implementado`);
        } else if (implementation.analyzed) {
          console.log(`  ⚠️  ${file} - Implementación incompleta`);
        } else {
          console.log(`  ℹ️  ${file} - No requiere sistema cuántico`);
        }
      } else {
        console.log(`  ❌ ${file} - Archivo no encontrado`);
      }
    }
  }

  /**
   * Analiza la implementación del sistema cuántico en un archivo
   */
  analyzeQuantumImplementation(content, file) {
    const hasQuantumImport = content.includes('quantumRandom') || content.includes('generate_quantum_number');
    const hasQuantumUsage = content.includes('quantumRandom()') || content.includes('quantumRandomSync()') || content.includes('supabase.rpc(\'generate_quantum_number\')');
    const hasMathRandom = content.includes('Math.random()');
    const analyzed = hasQuantumImport || hasQuantumUsage || hasMathRandom;
    
    return {
      file,
      hasQuantumImport,
      hasQuantumUsage,
      hasMathRandom,
      analyzed,
      isComplete: hasQuantumImport && hasQuantumUsage && !hasMathRandom
    };
  }

  /**
   * Verifica la configuración del sistema
   */
  async verifySystemConfiguration() {
    console.log('\n⚙️  Verificando configuración del sistema...');
    
    // Verificar endpoint de estado
    const quantumStatusPath = path.join(PROJECT_ROOT, 'app/api/quantum-status/route.ts');
    if (fs.existsSync(quantumStatusPath)) {
      console.log('  ✅ Endpoint de estado cuántico configurado');
    } else {
      this.results.issues.push({
        type: 'missing_endpoint',
        message: 'Endpoint de estado cuántico no encontrado'
      });
    }
    
    // Verificar función RPC en Supabase (nota: no podemos verificar la DB directamente)
    console.log('  ℹ️  Verificar manualmente que la función RPC "generate_quantum_number" esté configurada en Supabase');
    
    // Verificar documentación
    const docsPath = path.join(PROJECT_ROOT, 'docs/quantum-random-system.md');
    if (fs.existsSync(docsPath)) {
      console.log('  ✅ Documentación del sistema cuántico disponible');
    } else {
      console.log('  ⚠️  Documentación del sistema cuántico no encontrada');
    }
  }

  /**
   * Obtiene todos los archivos fuente a verificar
   */
  getSourceFiles() {
    const files = [];
    
    for (const dir of CONFIG.includeDirs) {
      const dirPath = path.join(PROJECT_ROOT, dir);
      if (fs.existsSync(dirPath)) {
        const dirFiles = this.scanDirectory(dirPath);
        files.push(...dirFiles);
      }
    }
    
    return files.filter(file => {
      // Filtrar por extensión
      const hasValidExtension = CONFIG.fileExtensions.some(ext => file.endsWith(ext));
      
      // Excluir archivos específicos
      const isExcludedFile = CONFIG.excludeFiles.some(excluded => file.includes(excluded));
      
      // Excluir directorios
      const isInExcludedDir = CONFIG.excludeDirs.some(excluded => file.includes(excluded));
      
      return hasValidExtension && !isExcludedFile && !isInExcludedDir;
    });
  }

  /**
   * Escanea recursivamente un directorio
   */
  scanDirectory(dirPath) {
    const files = [];
    
    try {
      const entries = fs.readdirSync(dirPath);
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Recursivo para subdirectorios
          if (!CONFIG.excludeDirs.some(excluded => entry.includes(excluded))) {
            files.push(...this.scanDirectory(fullPath));
          }
        } else if (stat.isFile()) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      console.warn(`Advertencia: No se pudo escanear directorio ${dirPath}`);
    }
    
    return files;
  }

  /**
   * Obtiene la ruta relativa al proyecto
   */
  getRelativePath(filePath) {
    return path.relative(PROJECT_ROOT, filePath);
  }

  /**
   * Genera el reporte final
   */
  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('📊 REPORTE DE VERIFICACIÓN DEL SISTEMA CUÁNTICO');
    console.log('='.repeat(80));
    
    // Resumen general
    console.log('\n📈 RESUMEN GENERAL:');
    console.log(`  • Archivos verificados: ${this.results.verifiedFiles}/${this.results.totalFiles}`);
    console.log(`  • Implementaciones cuánticas: ${this.results.quantumImplementations.filter(impl => impl.isComplete).length}`);
    console.log(`  • Usos restantes de Math.random(): ${this.results.mathRandomUsages.length}`);
    console.log(`  • Problemas encontrados: ${this.results.issues.length}`);
    
    // Usos restantes de Math.random()
    if (this.results.mathRandomUsages.length > 0) {
      console.log('\n⚠️  USOS RESTANTES DE Math.random():');
      this.results.mathRandomUsages.forEach(usage => {
        console.log(`\n  📄 ${usage.file}:`);
        usage.matches.forEach(match => {
          const status = match.isLegitimate ? '✅' : '❌';
          console.log(`    ${status} Línea ${match.lineNumber}: ${match.content}`);
        });
      });
    }
    
    // Estado de implementaciones
    console.log('\n⚛️  ESTADO DE IMPLEMENTACIONES:');
    this.results.quantumImplementations.forEach(impl => {
      if (impl.analyzed) {
        const status = impl.isComplete ? '✅' : '⚠️ ';
        console.log(`  ${status} ${impl.file}`);
        if (!impl.isComplete) {
          if (!impl.hasQuantumImport) console.log(`      - Falta importar sistema cuántico`);
          if (!impl.hasQuantumUsage) console.log(`      - Falta usar funciones cuánticas`);
          if (impl.hasMathRandom) console.log(`      - Todavía usa Math.random()`);
        }
      }
    });
    
    // Problemas encontrados
    if (this.results.issues.length > 0) {
      console.log('\n❌ PROBLEMAS ENCONTRADOS:');
      this.results.issues.forEach((issue, index) => {
        console.log(`  ${index + 1}. ${issue.type}: ${issue.message}`);
        if (issue.file) console.log(`     Archivo: ${issue.file}`);
      });
    }
    
    // Conclusión
    const isFullyUnified = this.results.mathRandomUsages.every(usage => 
      usage.matches.every(match => match.isLegitimate)
    ) && this.results.issues.length === 0;
    
    console.log('\n' + '='.repeat(80));
    if (isFullyUnified) {
      console.log('🎉 ¡UNIFICACIÓN COMPLETA! El sistema cuántico ha sido implementado exitosamente.');
      console.log('   Todos los usos de Math.random() han sido reemplazados o son legítimos (comentarios/fallbacks).');
    } else {
      console.log('🔧 UNIFICACIÓN INCOMPLETA. Revisar los problemas encontrados arriba.');
    }
    console.log('='.repeat(80));
    
    // Recomendaciones
    console.log('\n💡 RECOMENDACIONES:');
    console.log('  1. Verificar manualmente la función RPC "generate_quantum_number" en Supabase');
    console.log('  2. Probar el endpoint GET /api/quantum-status para verificar el estado del sistema');
    console.log('  3. Ejecutar pruebas de los servicios que usan números aleatorios');
    console.log('  4. Monitorear el rendimiento del sistema cuántico en producción');
    
    return isFullyUnified;
  }
}

// Ejecutar verificación si se llama directamente
if (require.main === module) {
  const verifier = new QuantumUnificationVerifier();
  verifier.verify().then(() => {
    console.log('\n✨ Verificación completada.');
    process.exit(0);
  }).catch(error => {
    console.error('\n💥 Error en la verificación:', error);
    process.exit(1);
  });
}

module.exports = { QuantumUnificationVerifier };
