#!/usr/bin/env node

/**
 * MONITOR SISTEMA EDUCATIVO SUPERPAES
 * Sistema de monitoreo en segundo plano con reportes ASCII
 * 
 * Este sistema:
 * - Ejecuta en segundo plano de forma continua
 * - Monitorea componentes educativos (Context7, Quantum, Triada Renacentista, etc.)
 * - Genera reportes de desempeño en formato ASCII
 * - Facilita depuración y mantención del código
 * - Cumple con las reglas de ejecución en background
 */

import fs from 'fs';
import path from 'path';
import { spawn, exec } from 'child_process';
import { performance } from 'perf_hooks';

class MonitorSistemaEducativo {
    constructor() {
        this.isRunning = false;
        this.pidFile = 'monitor-educativo.pid';
        this.logFile = 'logs/monitor-educativo.log';
        this.metricsFile = 'logs/metricas-educativo.json';
        this.asciiReportFile = 'logs/reporte-ascii-educativo.txt';
        
        // Configuración de monitoreo
        this.config = {
            intervalo: 30000,  // 30 segundos
            timeout: 10000,    // 10 segundos para cada verificación
            maxLogs: 1000,
            retencionDias: 7
        };
        
        this.metricas = {
            context7: { status: 'unknown', tiempo_respuesta: 0, errores: 0, uptime: 0 },
            sistemaQuantico: { status: 'unknown', tiempo_respuesta: 0, errores: 0, uptime: 0 },
            triadaRenacentista: { status: 'unknown', tiempo_respuesta: 0, errores: 0, uptime: 0 },
            multimodalidadGemini: { status: 'unknown', tiempo_respuesta: 0, errores: 0, uptime: 0 },
            plataformaPAES: { status: 'unknown', tiempo_respuesta: 0, errores: 0, uptime: 0 },
            integridad: { status: 'unknown', tiempo_respuesta: 0, errores: 0, uptime: 0 }
        };
        
        this.historialEventos = [];
        this.inicioMonitoreo = Date.now();
        this.contadorCiclos = 0;
        
        // Asegurar que existe el directorio de logs
        this.asegurarDirectorioLogs();
    }
    
    /**
     * ASEGURAR DIRECTORIO DE LOGS
     */
    asegurarDirectorioLogs() {
        const logsDir = 'logs';
        if (!fs.existsSync(logsDir)) {
            fs.mkdirSync(logsDir, { recursive: true });
            this.log('📁 Directorio de logs creado');
        }
    }
    
    /**
     * LOGGING CON TIMESTAMP
     */
    log(mensaje, tipo = 'INFO') {
        const timestamp = new Date().toISOString();
        const logEntry = `[${timestamp}] [${tipo}] ${mensaje}`;
        
        console.log(logEntry);
        
        // Escribir a archivo de log
        fs.appendFileSync(this.logFile, logEntry + '\n');
        
        // Mantener historial en memoria (limitado)
        this.historialEventos.push({
            timestamp,
            tipo,
            mensaje
        });
        
        if (this.historialEventos.length > this.config.maxLogs) {
            this.historialEventos = this.historialEventos.slice(-this.config.maxLogs);
        }
    }
    
    /**
     * INICIAR MONITOREO EN SEGUNDO PLANO
     */
    async iniciarMonitoreo() {
        if (this.isRunning) {
            this.log('⚠️  Monitor ya está ejecutándose', 'WARN');
            return;
        }
        
        this.isRunning = true;
        
        // Guardar PID para control
        fs.writeFileSync(this.pidFile, process.pid.toString());
        
        this.log('🚀 INICIANDO MONITOR SISTEMA EDUCATIVO SUPERPAES', 'INFO');
        this.log(`📊 PID: ${process.pid}`, 'INFO');
        this.log(`⏱️  Intervalo de monitoreo: ${this.config.intervalo/1000} segundos`, 'INFO');
        
        // Configurar handlers para terminación limpia
        process.on('SIGTERM', () => this.detenerMonitoreo());
        process.on('SIGINT', () => this.detenerMonitoreo());
        process.on('uncaughtException', (error) => {
            this.log(`💥 Error crítico: ${error.message}`, 'ERROR');
            this.detenerMonitoreo();
        });
        
        // Iniciar bucle de monitoreo
        this.bucleMonitoreo();
    }
    
    /**
     * BUCLE PRINCIPAL DE MONITOREO
     */
    async bucleMonitoreo() {
        while (this.isRunning) {
            try {
                const inicioTiempo = performance.now();
                
                this.log('🔍 Iniciando ciclo de verificación', 'DEBUG');
                
                // Monitorear cada componente
                await this.monitorearContext7();
                await this.monitorearSistemaQuantico();
                await this.monitorearTriadaRenacentista();
                await this.monitorearMultimodalidadGemini();
                await this.monitorearPlataformaPAES();
                await this.monitorearIntegridad();
                
                // Generar reportes
                await this.generarMetricas();
                await this.generarReporteASCII();
                
                const tiempoTotal = performance.now() - inicioTiempo;
                this.contadorCiclos++;
                this.log(`✅ Ciclo completado en ${tiempoTotal.toFixed(2)}ms`, 'INFO');
                
                // Esperar antes del próximo ciclo
                await this.esperarIntervalo();
                
            } catch (error) {
                this.log(`❌ Error en bucle de monitoreo: ${error.message}`, 'ERROR');
                await this.esperarIntervalo();
            }
        }
    }
    
    /**
     * MONITOREAR CONTEXT7
     */
    async monitorearContext7() {
        const inicioTiempo = performance.now();
        
        try {
            // Verificar configuración educativa
            const configPath = 'paes-master/config/educational.json';
            
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                
                // Verificar asignaturas PAES
                const subjectosRequeridos = [
                    'MATEMATICA_M1', 'MATEMATICA_M2', 
                    'COMPETENCIA_LECTORA', 'CIENCIAS', 'HISTORIA'
                ];
                
                const subjectosPresentes = config.educational?.subjects || [];
                const todosPresentes = subjectosRequeridos.every(s => 
                    subjectosPresentes.includes(s)
                );
                
                const bloomCompleto = config.educational?.bloom_levels === 6;
                
                if (todosPresentes && bloomCompleto) {
                    this.metricas.context7.status = 'operational';
                    this.metricas.context7.errores = Math.max(0, this.metricas.context7.errores - 1);
                } else {
                    this.metricas.context7.status = 'degraded';
                    this.metricas.context7.errores++;
                }
            } else {
                this.metricas.context7.status = 'critical';
                this.metricas.context7.errores++;
            }
            
        } catch (error) {
            this.metricas.context7.status = 'critical';
            this.metricas.context7.errores++;
            this.log(`❌ Context7 Error: ${error.message}`, 'ERROR');
        }
        
        this.metricas.context7.tiempo_respuesta = performance.now() - inicioTiempo;
        this.metricas.context7.uptime = Date.now() - this.inicioMonitoreo;
    }
    
    /**
     * MONITOREAR SISTEMA CUÁNTICO
     */
    async monitorearSistemaQuantico() {
        const inicioTiempo = performance.now();
        
        try {
            const configPath = 'paes-master/config/educational.json';
            
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                
                const quantumEngine = config.features?.quantum_engine === true;
                const neuralLearning = config.educational?.neural_learning === 'enabled';
                
                if (quantumEngine && neuralLearning) {
                    this.metricas.sistemaQuantico.status = 'operational';
                    this.metricas.sistemaQuantico.errores = Math.max(0, this.metricas.sistemaQuantico.errores - 1);
                } else {
                    this.metricas.sistemaQuantico.status = 'degraded';
                    this.metricas.sistemaQuantico.errores++;
                }
            } else {
                this.metricas.sistemaQuantico.status = 'critical';
                this.metricas.sistemaQuantico.errores++;
            }
            
        } catch (error) {
            this.metricas.sistemaQuantico.status = 'critical';
            this.metricas.sistemaQuantico.errores++;
            this.log(`❌ Sistema Cuántico Error: ${error.message}`, 'ERROR');
        }
        
        this.metricas.sistemaQuantico.tiempo_respuesta = performance.now() - inicioTiempo;
        this.metricas.sistemaQuantico.uptime = Date.now() - this.inicioMonitoreo;
    }
    
    /**
     * MONITOREAR TRIADA RENACENTISTA
     */
    async monitorearTriadaRenacentista() {
        const inicioTiempo = performance.now();
        
        try {
            const configPath = 'paes-master/config/educational.json';
            
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                const asignaturas = config.educational?.subjects || [];
                
                // Pilar Científico
                const ciencia = asignaturas.includes('MATEMATICA_M1') && 
                              asignaturas.includes('MATEMATICA_M2') && 
                              asignaturas.includes('CIENCIAS');
                
                // Pilar Humanístico
                const humanidades = asignaturas.includes('HISTORIA') && 
                                  asignaturas.includes('COMPETENCIA_LECTORA');
                
                // Pilar Tecnológico
                const tecnologia = config.integrations?.spotify?.enabled === true;
                
                if (ciencia && humanidades && tecnologia) {
                    this.metricas.triadaRenacentista.status = 'operational';
                    this.metricas.triadaRenacentista.errores = Math.max(0, this.metricas.triadaRenacentista.errores - 1);
                } else {
                    this.metricas.triadaRenacentista.status = 'degraded';
                    this.metricas.triadaRenacentista.errores++;
                }
            } else {
                this.metricas.triadaRenacentista.status = 'critical';
                this.metricas.triadaRenacentista.errores++;
            }
            
        } catch (error) {
            this.metricas.triadaRenacentista.status = 'critical';
            this.metricas.triadaRenacentista.errores++;
            this.log(`❌ Triada Renacentista Error: ${error.message}`, 'ERROR');
        }
        
        this.metricas.triadaRenacentista.tiempo_respuesta = performance.now() - inicioTiempo;
        this.metricas.triadaRenacentista.uptime = Date.now() - this.inicioMonitoreo;
    }
    
    /**
     * MONITOREAR MULTIMODALIDAD GEMINI
     */
    async monitorearMultimodalidadGemini() {
        const inicioTiempo = performance.now();
        
        try {
            const configPath = 'paes-master/config/educational.json';
            
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                
                const openRouter = config.integrations?.openrouter?.enabled === true &&
                                 config.integrations?.openrouter?.purpose === 'educational_content_generation';
                const aiRecommendations = config.features?.ai_recommendations === true;
                
                if (openRouter && aiRecommendations) {
                    this.metricas.multimodalidadGemini.status = 'operational';
                    this.metricas.multimodalidadGemini.errores = Math.max(0, this.metricas.multimodalidadGemini.errores - 1);
                } else {
                    this.metricas.multimodalidadGemini.status = 'degraded';
                    this.metricas.multimodalidadGemini.errores++;
                }
            } else {
                this.metricas.multimodalidadGemini.status = 'critical';
                this.metricas.multimodalidadGemini.errores++;
            }
            
        } catch (error) {
            this.metricas.multimodalidadGemini.status = 'critical';
            this.metricas.multimodalidadGemini.errores++;
            this.log(`❌ Multimodalidad Gemini Error: ${error.message}`, 'ERROR');
        }
        
        this.metricas.multimodalidadGemini.tiempo_respuesta = performance.now() - inicioTiempo;
        this.metricas.multimodalidadGemini.uptime = Date.now() - this.inicioMonitoreo;
    }
    
    /**
     * MONITOREAR PLATAFORMA PAES
     */
    async monitorearPlataformaPAES() {
        const inicioTiempo = performance.now();
        
        try {
            const packagePath = 'paes-master/package.json';
            const configPath = 'paes-master/config/educational.json';
            
            let statusOk = true;
            
            if (fs.existsSync(packagePath)) {
                const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
                
                if (packageJson.name !== 'paes-educativo') {
                    statusOk = false;
                }
                
                const keywordsEducativas = ['paes', 'education', 'bloom', 'mathematics'];
                const tieneKeywords = keywordsEducativas.every(k => 
                    packageJson.keywords?.includes(k)
                );
                
                if (!tieneKeywords) statusOk = false;
            } else {
                statusOk = false;
            }
            
            if (fs.existsSync(configPath)) {
                const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
                
                if (config.integrations?.supabase?.enabled !== true ||
                    config.integrations?.supabase?.schema !== 'educational') {
                    statusOk = false;
                }
            } else {
                statusOk = false;
            }
            
            if (statusOk) {
                this.metricas.plataformaPAES.status = 'operational';
                this.metricas.plataformaPAES.errores = Math.max(0, this.metricas.plataformaPAES.errores - 1);
            } else {
                this.metricas.plataformaPAES.status = 'degraded';
                this.metricas.plataformaPAES.errores++;
            }
            
        } catch (error) {
            this.metricas.plataformaPAES.status = 'critical';
            this.metricas.plataformaPAES.errores++;
            this.log(`❌ Plataforma PAES Error: ${error.message}`, 'ERROR');
        }
        
        this.metricas.plataformaPAES.tiempo_respuesta = performance.now() - inicioTiempo;
        this.metricas.plataformaPAES.uptime = Date.now() - this.inicioMonitoreo;
    }
    
    /**
     * MONITOREAR INTEGRIDAD DEL SISTEMA
     */
    async monitorearIntegridad() {
        const inicioTiempo = performance.now();
        
        try {
            // Verificar que no existan componentes de trading
            const componentesProhibidos = [
                'quantum-core', 'quantum-ui', 'trading', 'binance', 'leonardo'
            ];
            
            let integridadOk = true;
            
            for (const componente of componentesProhibidos) {
                if (fs.existsSync(componente)) {
                    integridadOk = false;
                    this.log(`⚠️  Componente prohibido encontrado: ${componente}`, 'WARN');
                }
            }
            
            // Verificar archivos educativos esenciales
            const archivosEsenciales = [
                'paes-master/config/educational.json',
                'paes-master/package.json',
                'paes-master/README.md'
            ];
            
            for (const archivo of archivosEsenciales) {
                if (!fs.existsSync(archivo)) {
                    integridadOk = false;
                    this.log(`⚠️  Archivo esencial faltante: ${archivo}`, 'WARN');
                }
            }
            
            if (integridadOk) {
                this.metricas.integridad.status = 'operational';
                this.metricas.integridad.errores = Math.max(0, this.metricas.integridad.errores - 1);
            } else {
                this.metricas.integridad.status = 'degraded';
                this.metricas.integridad.errores++;
            }
            
        } catch (error) {
            this.metricas.integridad.status = 'critical';
            this.metricas.integridad.errores++;
            this.log(`❌ Integridad Error: ${error.message}`, 'ERROR');
        }
        
        this.metricas.integridad.tiempo_respuesta = performance.now() - inicioTiempo;
        this.metricas.integridad.uptime = Date.now() - this.inicioMonitoreo;
    }
    
    /**
     * GENERAR ARCHIVO DE MÉTRICAS JSON
     */
    async generarMetricas() {
        try {
            const metricas = {
                timestamp: new Date().toISOString(),
                uptime_total: Date.now() - this.inicioMonitoreo,
                pid: process.pid,
                componentes: { ...this.metricas },
                estadisticas: this.calcularEstadisticas(),
                eventos_recientes: this.historialEventos.slice(-50)
            };
            
            fs.writeFileSync(this.metricsFile, JSON.stringify(metricas, null, 2));
            
        } catch (error) {
            this.log(`❌ Error generando métricas: ${error.message}`, 'ERROR');
        }
    }
    
    /**
     * GENERAR REPORTE ASCII
     */
    async generarReporteASCII() {
        try {
            const timestamp = new Date().toLocaleString('es-CL');
            const uptimeHoras = ((Date.now() - this.inicioMonitoreo) / (1000 * 60 * 60)).toFixed(2);
            
            let reporte = '';
            
            // Header ASCII
            reporte += '╔══════════════════════════════════════════════════════════════════════════════╗\n';
            reporte += '║                    REPORTE SISTEMA EDUCATIVO SUPERPAES                      ║\n';
            reporte += '╠══════════════════════════════════════════════════════════════════════════════╣\n';
            reporte += `║ Timestamp: ${timestamp.padEnd(60)} ║\n`;
            reporte += `║ PID: ${process.pid.toString().padEnd(71)} ║\n`;
            reporte += `║ Uptime: ${uptimeHoras} horas${' '.repeat(56 - uptimeHoras.length)} ║\n`;
            reporte += '╠══════════════════════════════════════════════════════════════════════════════╣\n';
            
            // Estado de componentes
            reporte += '║                              ESTADO COMPONENTES                             ║\n';
            reporte += '╠════════════════════════════════════════════════════════════════════════════╢\n';
            
            for (const [nombre, metricas] of Object.entries(this.metricas)) {
                const nombreFormateado = this.formatearNombreComponente(nombre);
                const status = this.formatearStatus(metricas.status);
                const errores = metricas.errores.toString().padStart(3);
                const tiempo = metricas.tiempo_respuesta.toFixed(1).padStart(6);
                
                reporte += `║ ${nombreFormateado} │ ${status} │ Err:${errores} │ ${tiempo}ms ║\n`;
            }
            
            // Estadísticas generales
            const stats = this.calcularEstadisticas();
            reporte += '╠════════════════════════════════════════════════════════════════════════════╢\n';
            reporte += '║                            ESTADÍSTICAS GENERALES                           ║\n';
            reporte += '╠════════════════════════════════════════════════════════════════════════════╢\n';
            reporte += `║ Componentes Operacionales: ${stats.operacionales}/${stats.total}${' '.repeat(45)} ║\n`;
            reporte += `║ Disponibilidad: ${stats.disponibilidad}%${' '.repeat(57)} ║\n`;
            reporte += `║ Tiempo Promedio Respuesta: ${stats.tiempoPromedio}ms${' '.repeat(38)} ║\n`;
            reporte += `║ Total Errores: ${stats.totalErrores}${' '.repeat(61)} ║\n`;
            
            // Estado general del sistema
            reporte += '╠════════════════════════════════════════════════════════════════════════════╢\n';
            reporte += '║                              ESTADO GENERAL                                 ║\n';
            reporte += '╠════════════════════════════════════════════════════════════════════════════╢\n';
            
            const estadoGeneral = this.determinarEstadoGeneral(stats);
            reporte += `║ ${estadoGeneral.icono} ${estadoGeneral.mensaje.padEnd(73)} ║\n`;
            
            // Eventos recientes
            reporte += '╠════════════════════════════════════════════════════════════════════════════╢\n';
            reporte += '║                             EVENTOS RECIENTES                               ║\n';
            reporte += '╠════════════════════════════════════════════════════════════════════════════╢\n';
            
            const eventosRecientes = this.historialEventos.slice(-5);
            for (const evento of eventosRecientes) {
                const time = new Date(evento.timestamp).toLocaleTimeString('es-CL');
                const mensaje = evento.mensaje.substring(0, 60);
                reporte += `║ ${time} [${evento.tipo}] ${mensaje.padEnd(60 - evento.tipo.length - 1)} ║\n`;
            }
            
            reporte += '╚════════════════════════════════════════════════════════════════════════════╝\n';
            
            // Guardar reporte
            fs.writeFileSync(this.asciiReportFile, reporte);
            
            // También mostrar en consola cada 10 ciclos
            if (this.contadorCiclos % 10 === 0) {
                console.log('\n' + reporte);
            }
            
        } catch (error) {
            this.log(`❌ Error generando reporte ASCII: ${error.message}`, 'ERROR');
        }
    }
    
    /**
     * FORMATEAR NOMBRE DE COMPONENTE
     */
    formatearNombreComponente(nombre) {
        const nombres = {
            'context7': 'Context7               ',
            'sistemaQuantico': 'Sistema Cuántico       ',
            'triadaRenacentista': 'Triada Renacentista    ',
            'multimodalidadGemini': 'Multimodalidad Gemini  ',
            'plataformaPAES': 'Plataforma PAES        ',
            'integridad': 'Integridad Sistema     '
        };
        return nombres[nombre] || nombre.padEnd(23);
    }
    
    /**
     * FORMATEAR STATUS
     */
    formatearStatus(status) {
        const estados = {
            'operational': '🟢 OPERACIONAL',
            'degraded': '🟡 DEGRADADO  ',
            'critical': '🔴 CRÍTICO    ',
            'unknown': '⚪ DESCONOCIDO'
        };
        return estados[status] || '⚪ DESCONOCIDO';
    }
    
    /**
     * CALCULAR ESTADÍSTICAS
     */
    calcularEstadisticas() {
        const componentes = Object.values(this.metricas);
        const total = componentes.length;
        const operacionales = componentes.filter(c => c.status === 'operational').length;
        const disponibilidad = ((operacionales / total) * 100).toFixed(1);
        const tiempoPromedio = (componentes.reduce((sum, c) => sum + c.tiempo_respuesta, 0) / total).toFixed(1);
        const totalErrores = componentes.reduce((sum, c) => sum + c.errores, 0);
        
        return {
            total,
            operacionales,
            disponibilidad,
            tiempoPromedio,
            totalErrores
        };
    }
    
    /**
     * DETERMINAR ESTADO GENERAL
     */
    determinarEstadoGeneral(stats) {
        if (stats.disponibilidad >= 90) {
            return {
                icono: '🟢',
                mensaje: 'SISTEMA EDUCATIVO EN ESTADO ÓPTIMO - Todos los componentes funcionando'
            };
        } else if (stats.disponibilidad >= 70) {
            return {
                icono: '🟡',
                mensaje: 'SISTEMA EDUCATIVO REQUIERE ATENCIÓN - Algunos componentes degradados'
            };
        } else {
            return {
                icono: '🔴',
                mensaje: 'SISTEMA EDUCATIVO REQUIERE REPARACIÓN URGENTE - Múltiples fallos'
            };
        }
    }
    
    /**
     * ESPERAR INTERVALO
     */
    async esperarIntervalo() {
        return new Promise(resolve => {
            setTimeout(resolve, this.config.intervalo);
        });
    }
    
    /**
     * DETENER MONITOREO
     */
    detenerMonitoreo() {
        if (!this.isRunning) return;
        
        this.log('🛑 DETENIENDO MONITOR SISTEMA EDUCATIVO', 'INFO');
        this.isRunning = false;
        
        // Generar reporte final
        this.generarMetricas();
        this.generarReporteASCII();
        
        // Limpiar PID file
        if (fs.existsSync(this.pidFile)) {
            fs.unlinkSync(this.pidFile);
        }
        
        this.log('✅ Monitor detenido correctamente', 'INFO');
        process.exit(0);
    }
    
    /**
     * VERIFICAR SI YA ESTÁ EJECUTÁNDOSE
     */
    static yaEstaEjecutandose() {
        const pidFile = 'monitor-educativo.pid';
        
        if (fs.existsSync(pidFile)) {
            const pid = parseInt(fs.readFileSync(pidFile, 'utf8'));
            
            try {
                // Verificar si el proceso existe
                process.kill(pid, 0);
                return { ejecutandose: true, pid };
            } catch (error) {
                // El proceso no existe, limpiar PID file
                fs.unlinkSync(pidFile);
                return { ejecutandose: false };
            }
        }
        
        return { ejecutandose: false };
    }
}

// MANEJO DE ARGUMENTOS DE LÍNEA DE COMANDOS
const args = process.argv.slice(2);
const comando = args[0];

switch (comando) {
    case 'start':
        const estado = MonitorSistemaEducativo.yaEstaEjecutandose();
        if (estado.ejecutandose) {
            console.log(`⚠️  Monitor ya está ejecutándose (PID: ${estado.pid})`);
            process.exit(1);
        } else {
            const monitor = new MonitorSistemaEducativo();
            monitor.iniciarMonitoreo();
        }
        break;
        
    case 'stop':
        const estadoStop = MonitorSistemaEducativo.yaEstaEjecutandose();
        if (estadoStop.ejecutandose) {
            try {
                process.kill(estadoStop.pid, 'SIGTERM');
                console.log(`✅ Señal de detención enviada al proceso ${estadoStop.pid}`);
            } catch (error) {
                console.log(`❌ Error deteniendo proceso: ${error.message}`);
            }
        } else {
            console.log('ℹ️  Monitor no está ejecutándose');
        }
        break;
        
    case 'status':
        const estadoStatus = MonitorSistemaEducativo.yaEstaEjecutandose();
        if (estadoStatus.ejecutandose) {
            console.log(`🟢 Monitor ejecutándose (PID: ${estadoStatus.pid})`);
            
            // Mostrar último reporte si existe
            const reporteFile = 'logs/reporte-ascii-educativo.txt';
            if (fs.existsSync(reporteFile)) {
                const reporte = fs.readFileSync(reporteFile, 'utf8');
                console.log('\n📊 ÚLTIMO REPORTE:');
                console.log(reporte);
            }
        } else {
            console.log('🔴 Monitor no está ejecutándose');
        }
        break;
        
    case 'restart':
        console.log('🔄 Reiniciando monitor...');
        const estadoRestart = MonitorSistemaEducativo.yaEstaEjecutandose();
        if (estadoRestart.ejecutandose) {
            process.kill(estadoRestart.pid, 'SIGTERM');
            // Esperar un momento antes de reiniciar
            setTimeout(() => {
                const monitor = new MonitorSistemaEducativo();
                monitor.iniciarMonitoreo();
            }, 2000);
        } else {
            const monitor = new MonitorSistemaEducativo();
            monitor.iniciarMonitoreo();
        }
        break;
        
    default:
        console.log(`
🔧 MONITOR SISTEMA EDUCATIVO SUPERPAES

Uso: node monitor-sistema-educativo.js [comando]

Comandos disponibles:
  start     - Iniciar monitoreo en segundo plano
  stop      - Detener monitoreo
  status    - Ver estado actual y último reporte
  restart   - Reiniciar monitoreo

Archivos generados:
  logs/monitor-educativo.log          - Log completo del sistema
  logs/metricas-educativo.json        - Métricas en formato JSON
  logs/reporte-ascii-educativo.txt    - Reporte visual ASCII
  monitor-educativo.pid               - Archivo PID del proceso
        `);
        break;
}
