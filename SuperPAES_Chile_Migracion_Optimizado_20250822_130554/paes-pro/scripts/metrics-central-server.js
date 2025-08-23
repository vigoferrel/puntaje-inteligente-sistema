// PAES-PRO Central Metrics Server v2.0
// Servidor central para recibir y consolidar métricas de todos los procesos
// Compatible con Windows PowerShell - Solo ASCII/JSON

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuración del servidor
const CONFIG = {
    port: process.env.METRICS_PORT || 3001,
    host: process.env.METRICS_HOST || 'localhost',
    logRoot: './logs',
    metricsStorage: './logs/central-metrics',
    retentionDays: 7,
    maxFileSize: 50 * 1024 * 1024, // 50MB
    heartbeatInterval: 30000, // 30 segundos
    processes: new Map(), // Registro de procesos conectados
    alerts: {
        cpu_threshold: 80,
        memory_threshold: 90,
        disk_threshold: 85
    }
};

// Almacén central de métricas
const metricsStore = {
    processes: new Map(),
    system: {
        startTime: new Date().toISOString(),
        totalRequests: 0,
        activeConnections: 0,
        lastUpdate: null
    },
    alerts: [],
    history: {
        cpu: [],
        memory: [],
        disk: [],
        database: []
    }
};

// Función para escribir logs ASCII
function writeASCIILog(filePath, message, level = 'INFO') {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const logEntry = `${timestamp} [${level}] ${message}\n`;
    
    // Asegurar que el directorio existe
    const logDir = path.dirname(filePath);
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Escribir en ASCII sin BOM
    fs.appendFileSync(filePath, logEntry, { encoding: 'ascii' });
}

// Función para guardar métricas en JSON ASCII
function saveMetricsJSON(data, filename) {
    const filePath = path.join(CONFIG.metricsStorage, filename);
    const jsonData = JSON.stringify(data, null, 2);
    
    // Asegurar directorio existe
    if (!fs.existsSync(CONFIG.metricsStorage)) {
        fs.mkdirSync(CONFIG.metricsStorage, { recursive: true });
    }
    
    // Escribir JSON en ASCII
    fs.writeFileSync(filePath, jsonData, { encoding: 'ascii' });
}

// Función para procesar métricas recibidas
function processMetrics(metrics, sourceProcess) {
    const now = new Date().toISOString();
    
    // Registrar proceso si no existe
    if (!metricsStore.processes.has(sourceProcess)) {
        metricsStore.processes.set(sourceProcess, {
            name: sourceProcess,
            firstSeen: now,
            lastSeen: now,
            metricsCount: 0,
            status: 'active'
        });
        
        writeASCIILog(
            path.join(CONFIG.logRoot, 'central-server.log'),
            `Nuevo proceso registrado: ${sourceProcess}`,
            'INFO'
        );
    }
    
    // Actualizar registro del proceso
    const processInfo = metricsStore.processes.get(sourceProcess);
    processInfo.lastSeen = now;
    processInfo.metricsCount++;
    processInfo.lastMetrics = metrics;
    
    // Procesar alertas
    processAlerts(metrics, sourceProcess);
    
    // Almacenar histórico
    updateHistoricalData(metrics);
    
    // Guardar snapshot actual
    saveCurrentSnapshot();
    
    metricsStore.system.lastUpdate = now;
    metricsStore.system.totalRequests++;
    
    writeASCIILog(
        path.join(CONFIG.logRoot, 'metrics-received.log'),
        `Métricas recibidas de ${sourceProcess}: CPU=${metrics.cpu?.total_usage || 'N/A'}%, Memory=${metrics.memory?.usage_percent || 'N/A'}%`,
        'METRICS'
    );
}

// Función para procesar alertas
function processAlerts(metrics, sourceProcess) {
    const now = new Date().toISOString();
    
    // Alert por CPU alta
    if (metrics.cpu && metrics.cpu.total_usage > CONFIG.alerts.cpu_threshold) {
        const alert = {
            timestamp: now,
            source: sourceProcess,
            type: 'HIGH_CPU',
            value: metrics.cpu.total_usage,
            threshold: CONFIG.alerts.cpu_threshold,
            severity: 'warning'
        };
        
        metricsStore.alerts.push(alert);
        writeASCIILog(
            path.join(CONFIG.logRoot, 'alerts.log'),
            `ALERT [${sourceProcess}] HIGH CPU: ${metrics.cpu.total_usage}% (threshold: ${CONFIG.alerts.cpu_threshold}%)`,
            'ALERT'
        );
    }
    
    // Alert por memoria alta
    if (metrics.memory && metrics.memory.usage_percent > CONFIG.alerts.memory_threshold) {
        const alert = {
            timestamp: now,
            source: sourceProcess,
            type: 'HIGH_MEMORY',
            value: metrics.memory.usage_percent,
            threshold: CONFIG.alerts.memory_threshold,
            severity: 'warning'
        };
        
        metricsStore.alerts.push(alert);
        writeASCIILog(
            path.join(CONFIG.logRoot, 'alerts.log'),
            `ALERT [${sourceProcess}] HIGH MEMORY: ${metrics.memory.usage_percent}% (threshold: ${CONFIG.alerts.memory_threshold}%)`,
            'ALERT'
        );
    }
    
    // Alert por disco lleno
    if (metrics.disk && metrics.disk.usage_percent > CONFIG.alerts.disk_threshold) {
        const alert = {
            timestamp: now,
            source: sourceProcess,
            type: 'HIGH_DISK',
            value: metrics.disk.usage_percent,
            threshold: CONFIG.alerts.disk_threshold,
            severity: 'warning'
        };
        
        metricsStore.alerts.push(alert);
        writeASCIILog(
            path.join(CONFIG.logRoot, 'alerts.log'),
            `ALERT [${sourceProcess}] HIGH DISK: ${metrics.disk.usage_percent}% (threshold: ${CONFIG.alerts.disk_threshold}%)`,
            'ALERT'
        );
    }
    
    // Alert por base de datos down
    if (metrics.database && metrics.database.status === 'down') {
        const alert = {
            timestamp: now,
            source: sourceProcess,
            type: 'DATABASE_DOWN',
            value: metrics.database.status,
            error: metrics.database.error,
            severity: 'critical'
        };
        
        metricsStore.alerts.push(alert);
        writeASCIILog(
            path.join(CONFIG.logRoot, 'alerts.log'),
            `CRITICAL [${sourceProcess}] DATABASE DOWN: ${metrics.database.error || 'Connection failed'}`,
            'CRITICAL'
        );
    }
    
    // Limpiar alertas antiguas (más de 24 horas)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    metricsStore.alerts = metricsStore.alerts.filter(alert => alert.timestamp > oneDayAgo);
}

// Función para actualizar datos históricos
function updateHistoricalData(metrics) {
    const maxHistoryPoints = 1440; // 24 horas en minutos
    
    if (metrics.cpu) {
        metricsStore.history.cpu.push({
            timestamp: new Date().toISOString(),
            value: metrics.cpu.total_usage
        });
        
        if (metricsStore.history.cpu.length > maxHistoryPoints) {
            metricsStore.history.cpu = metricsStore.history.cpu.slice(-maxHistoryPoints);
        }
    }
    
    if (metrics.memory) {
        metricsStore.history.memory.push({
            timestamp: new Date().toISOString(),
            value: metrics.memory.usage_percent
        });
        
        if (metricsStore.history.memory.length > maxHistoryPoints) {
            metricsStore.history.memory = metricsStore.history.memory.slice(-maxHistoryPoints);
        }
    }
    
    if (metrics.disk) {
        metricsStore.history.disk.push({
            timestamp: new Date().toISOString(),
            value: metrics.disk.usage_percent
        });
        
        if (metricsStore.history.disk.length > maxHistoryPoints) {
            metricsStore.history.disk = metricsStore.history.disk.slice(-maxHistoryPoints);
        }
    }
    
    if (metrics.database) {
        metricsStore.history.database.push({
            timestamp: new Date().toISOString(),
            status: metrics.database.status,
            response_time: metrics.database.response_time_ms
        });
        
        if (metricsStore.history.database.length > maxHistoryPoints) {
            metricsStore.history.database = metricsStore.history.database.slice(-maxHistoryPoints);
        }
    }
}

// Función para guardar snapshot actual
function saveCurrentSnapshot() {
    const snapshot = {
        timestamp: new Date().toISOString(),
        system: metricsStore.system,
        processes: Object.fromEntries(metricsStore.processes),
        alerts: metricsStore.alerts.slice(-50), // Últimas 50 alertas
        summary: {
            total_processes: metricsStore.processes.size,
            active_processes: Array.from(metricsStore.processes.values()).filter(p => p.status === 'active').length,
            total_alerts: metricsStore.alerts.length,
            critical_alerts: metricsStore.alerts.filter(a => a.severity === 'critical').length
        }
    };
    
    saveMetricsJSON(snapshot, 'current-snapshot.json');
}

// Función para manejar requests HTTP
function handleRequest(req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const method = req.method;
    
    // Headers CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    try {
        // Endpoint para recibir métricas
        if (pathname === '/metrics' && method === 'POST') {
            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                try {
                    const metrics = JSON.parse(body);
                    const sourceProcess = req.headers['x-process-name'] || 'unknown';
                    
                    processMetrics(metrics, sourceProcess);
                    
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: 'Métricas recibidas correctamente',
                        timestamp: new Date().toISOString()
                    }));
                    
                } catch (error) {
                    writeASCIILog(
                        path.join(CONFIG.logRoot, 'error.log'),
                        `Error procesando métricas: ${error.message}`,
                        'ERROR'
                    );
                    
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ success: false, error: 'Invalid JSON' }));
                }
            });
            return;
        }
        
        // Endpoint para obtener snapshot actual
        if (pathname === '/status' && method === 'GET') {
            const snapshot = {
                timestamp: new Date().toISOString(),
                system: metricsStore.system,
                processes: Object.fromEntries(metricsStore.processes),
                alerts: metricsStore.alerts.slice(-10),
                summary: {
                    total_processes: metricsStore.processes.size,
                    active_processes: Array.from(metricsStore.processes.values()).filter(p => p.status === 'active').length,
                    total_alerts: metricsStore.alerts.length,
                    uptime_minutes: Math.round((Date.now() - new Date(metricsStore.system.startTime).getTime()) / 60000)
                }
            };
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(snapshot, null, 2));
            return;
        }
        
        // Endpoint para obtener histórico
        if (pathname === '/history' && method === 'GET') {
            const hours = parseInt(parsedUrl.query.hours) || 1;
            const since = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
            
            const filteredHistory = {
                cpu: metricsStore.history.cpu.filter(entry => entry.timestamp > since),
                memory: metricsStore.history.memory.filter(entry => entry.timestamp > since),
                disk: metricsStore.history.disk.filter(entry => entry.timestamp > since),
                database: metricsStore.history.database.filter(entry => entry.timestamp > since)
            };
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(filteredHistory, null, 2));
            return;
        }
        
        // Endpoint para obtener alertas
        if (pathname === '/alerts' && method === 'GET') {
            const severity = parsedUrl.query.severity;
            let alerts = metricsStore.alerts;
            
            if (severity) {
                alerts = alerts.filter(alert => alert.severity === severity);
            }
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(alerts.slice(-50), null, 2));
            return;
        }
        
        // Health check
        if (pathname === '/health' && method === 'GET') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'healthy',
                timestamp: new Date().toISOString(),
                uptime: Math.round((Date.now() - new Date(metricsStore.system.startTime).getTime()) / 1000),
                version: '2.0'
            }));
            return;
        }
        
        // 404 para rutas no encontradas
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
        
    } catch (error) {
        writeASCIILog(
            path.join(CONFIG.logRoot, 'error.log'),
            `Error en request handler: ${error.message}`,
            'ERROR'
        );
        
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
    }
}

// Función para limpiar procesos inactivos
function cleanupInactiveProcesses() {
    const now = Date.now();
    const timeoutMs = 5 * 60 * 1000; // 5 minutos
    
    for (const [processName, processInfo] of metricsStore.processes) {
        const lastSeenTime = new Date(processInfo.lastSeen).getTime();
        
        if (now - lastSeenTime > timeoutMs) {
            processInfo.status = 'inactive';
            
            writeASCIILog(
                path.join(CONFIG.logRoot, 'central-server.log'),
                `Proceso marcado como inactivo: ${processName} (última actividad: ${processInfo.lastSeen})`,
                'WARN'
            );
        }
    }
}

// Función de heartbeat del servidor
function serverHeartbeat() {
    writeASCIILog(
        path.join(CONFIG.logRoot, 'central-server.log'),
        `Heartbeat - Procesos activos: ${Array.from(metricsStore.processes.values()).filter(p => p.status === 'active').length}, Total requests: ${metricsStore.system.totalRequests}`,
        'HEARTBEAT'
    );
    
    // Limpiar procesos inactivos
    cleanupInactiveProcesses();
    
    // Guardar snapshot periódico
    saveCurrentSnapshot();
    
    // Rotar logs si son muy grandes
    rotateLargeLogFiles();
}

// Función para rotar logs grandes
function rotateLargeLogFiles() {
    const logFiles = [
        path.join(CONFIG.logRoot, 'central-server.log'),
        path.join(CONFIG.logRoot, 'metrics-received.log'),
        path.join(CONFIG.logRoot, 'alerts.log'),
        path.join(CONFIG.logRoot, 'error.log')
    ];
    
    logFiles.forEach(logFile => {
        if (fs.existsSync(logFile)) {
            const stats = fs.statSync(logFile);
            if (stats.size > CONFIG.maxFileSize) {
                const backupName = `${path.basename(logFile, '.log')}_${new Date().toISOString().replace(/[:.]/g, '-')}.log`;
                const backupPath = path.join(path.dirname(logFile), backupName);
                
                fs.renameSync(logFile, backupPath);
                writeASCIILog(logFile, `Log rotado a ${backupName}`, 'INFO');
            }
        }
    });
}

// Inicializar servidor
function startServer() {
    // Crear directorios necesarios
    const directories = [CONFIG.logRoot, CONFIG.metricsStorage];
    directories.forEach(dir => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Directorio creado: ${dir}`);
        }
    });
    
    // Crear servidor HTTP
    const server = http.createServer(handleRequest);
    
    server.listen(CONFIG.port, CONFIG.host, () => {
        console.log(`\n==================================================`);
        console.log(`🚀 PAES-PRO Central Metrics Server v2.0 INICIADO`);
        console.log(`==================================================`);
        console.log(`📡 Servidor: http://${CONFIG.host}:${CONFIG.port}`);
        console.log(`📊 Endpoints disponibles:`);
        console.log(`   POST /metrics    - Recibir métricas`);
        console.log(`   GET  /status     - Estado actual`);
        console.log(`   GET  /history    - Datos históricos`);
        console.log(`   GET  /alerts     - Alertas del sistema`);
        console.log(`   GET  /health     - Health check`);
        console.log(`📁 Logs: ${CONFIG.logRoot}`);
        console.log(`💾 Métricas: ${CONFIG.metricsStorage}`);
        console.log(`==================================================`);
        
        writeASCIILog(
            path.join(CONFIG.logRoot, 'central-server.log'),
            `Servidor central de métricas iniciado en http://${CONFIG.host}:${CONFIG.port}`,
            'INFO'
        );
    });
    
    // Configurar heartbeat
    setInterval(serverHeartbeat, CONFIG.heartbeatInterval);
    
    // Manejar cierre graceful
    process.on('SIGINT', () => {
        console.log('\n⏹️  Cerrando servidor...');
        writeASCIILog(
            path.join(CONFIG.logRoot, 'central-server.log'),
            'Servidor central de métricas detenido',
            'INFO'
        );
        server.close(() => {
            console.log('✅ Servidor cerrado correctamente');
            process.exit(0);
        });
    });
    
    return server;
}

// Verificar si es ejecución directa
if (require.main === module) {
    startServer();
}

module.exports = { startServer, CONFIG, metricsStore };
