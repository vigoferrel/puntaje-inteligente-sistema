
/**
 * Logger simplificado sin dependencias circulares
 */
class SimpleLogger {
  private static instance: SimpleLogger;
  private isProduction = process.env.NODE_ENV === 'production';

  static getInstance(): SimpleLogger {
    if (!SimpleLogger.instance) {
      SimpleLogger.instance = new SimpleLogger();
    }
    return SimpleLogger.instance;
  }

  private log(level: string, module: string, message: string, data?: any) {
    if (!this.isProduction) {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] [${module}] ${message}`, data || '');
    }
  }

  debug(module: string, message: string, data?: any) {
    this.log('debug', module, message, data);
  }

  info(module: string, message: string, data?: any) {
    this.log('info', module, message, data);
  }

  warn(module: string, message: string, data?: any) {
    this.log('warn', module, message, data);
  }

  error(module: string, message: string, data?: any) {
    this.log('error', module, message, data);
  }
}

export const simpleLogger = SimpleLogger.getInstance();
