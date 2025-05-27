
interface AssetStatus {
  url: string;
  status: 'loading' | 'loaded' | 'error' | 'missing';
  lastChecked: number;
  errorCount: number;
}

class AssetIntegrityChecker {
  private static instance: AssetIntegrityChecker;
  private assetCache = new Map<string, AssetStatus>();
  private criticalAssets = [
    '/vite.svg',
    '/favicon.ico'
  ];

  static getInstance(): AssetIntegrityChecker {
    if (!AssetIntegrityChecker.instance) {
      AssetIntegrityChecker.instance = new AssetIntegrityChecker();
    }
    return AssetIntegrityChecker.instance;
  }

  async validateCriticalAssets(): Promise<boolean> {
    console.log('🔍 Validando assets críticos...');
    
    const results = await Promise.allSettled(
      this.criticalAssets.map(asset => this.validateAsset(asset))
    );

    const failedAssets = results
      .map((result, index) => ({ result, asset: this.criticalAssets[index] }))
      .filter(({ result }) => result.status === 'rejected' || !result.value)
      .map(({ asset }) => asset);

    if (failedAssets.length > 0) {
      console.warn('⚠️ Assets faltantes:', failedAssets);
      await this.handleMissingAssets(failedAssets);
    }

    const allValid = failedAssets.length === 0;
    console.log(allValid ? '✅ Todos los assets críticos están disponibles' : '❌ Algunos assets críticos faltan');
    
    return allValid;
  }

  private async validateAsset(url: string): Promise<boolean> {
    const cached = this.assetCache.get(url);
    const now = Date.now();

    // Si está en cache y es reciente (menos de 5 minutos)
    if (cached && (now - cached.lastChecked) < 300000 && cached.status !== 'error') {
      return cached.status === 'loaded';
    }

    try {
      this.assetCache.set(url, {
        url,
        status: 'loading',
        lastChecked: now,
        errorCount: cached?.errorCount || 0
      });

      const response = await fetch(url, { 
        method: 'HEAD',
        cache: 'no-cache'
      });

      const isValid = response.ok;
      
      this.assetCache.set(url, {
        url,
        status: isValid ? 'loaded' : 'error',
        lastChecked: now,
        errorCount: isValid ? 0 : (cached?.errorCount || 0) + 1
      });

      return isValid;
    } catch (error) {
      this.assetCache.set(url, {
        url,
        status: 'error',
        lastChecked: now,
        errorCount: (cached?.errorCount || 0) + 1
      });

      console.error(`❌ Error validando asset ${url}:`, error);
      return false;
    }
  }

  private async handleMissingAssets(missingAssets: string[]): Promise<void> {
    for (const asset of missingAssets) {
      if (asset === '/vite.svg') {
        console.log('🔧 Asset /vite.svg detectado como faltante, pero debería estar creado');
      }
      
      // Registrar en el sistema de errores
      const { robustErrorCapture } = await import('../error-handling/RobustErrorCaptureSystem');
      robustErrorCapture.captureMessage(
        `Asset crítico faltante: ${asset}`,
        'error'
      );
    }
  }

  getAssetStatus(): Map<string, AssetStatus> {
    return new Map(this.assetCache);
  }

  clearCache(): void {
    this.assetCache.clear();
  }
}

export const assetIntegrityChecker = AssetIntegrityChecker.getInstance();
