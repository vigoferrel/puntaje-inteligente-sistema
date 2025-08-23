/* eslint-disable react-refresh/only-export-components */
import React, { useState, useEffect } from 'react';
import { performanceMonitor, type PerformanceMetrics } from '../../utils/performanceMetrics';

export const RealTimePerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-depsuseEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(setMetrics);
    return unsubscribe;
  }, []);useEffect(() => {
    const unsubscribe = performanceMonitor.subscribe(setMetrics);
    return unsubscribe;
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      >
        Performance Monitor
      </button>
    );
  }

  const getStatusColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value <= thresholds.good) return 'text-green-400';
    if (value <= thresholds.warning) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-xl z-50 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold">Performance Monitor</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          X
        </button>
      </div>

      {metrics && (
        <div className="space-y-3">
          <div>
            <h4 className="font-semibold mb-2">Core Web Vitals</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-400">FCP:</span>
                <span className={getStatusColor(metrics.fcp, { good: 1500, warning: 2500 })}>
                  {metrics.fcp.toFixed(0)}ms
                </span>
              </div>
              <div>
                <span className="text-gray-400">LCP:</span>
                <span className={getStatusColor(metrics.lcp, { good: 2500, warning: 4000 })}>
                  {metrics.lcp.toFixed(0)}ms
                </span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Handler Violations</h4>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Long Tasks:</span>
                <span className={metrics.longTasks > 0 ? 'text-red-400' : 'text-green-400'}>
                  {metrics.longTasks}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Memory Usage:</span>
                <span className={getStatusColor(metrics.memoryUsage * 100, { good: 50, warning: 80 })}>
                  {(metrics.memoryUsage * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-700">
            <div className="flex items-center justify-center">
              {metrics.longTasks === 0 && metrics.fcp < 1500 && metrics.lcp < 2500 ? (
                <span className="text-green-400 font-semibold">Performance Optimal</span>
              ) : (
                <span className="text-red-400 font-semibold">Performance Issues</span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};



