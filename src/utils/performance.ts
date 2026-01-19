// Performance monitoring utilities
export interface PerformanceMetrics {
  renderTime: number;
  componentCount: number;
  memoryUsage?: number;
}

class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics[] = [];
  private startTime: number = 0;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(label: string): void {
    this.startTime = performance.now();
    performance.mark(`${label}-start`);
  }

  endMeasure(label: string): number {
    const endTime = performance.now();
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const duration = endTime - this.startTime;
    this.metrics.push({
      renderTime: duration,
      componentCount: this.metrics.length + 1,
    });

    // Keep only last 50 metrics
    if (this.metrics.length > 50) {
      this.metrics = this.metrics.slice(-50);
    }

    return duration;
  }

  getMetrics(): PerformanceMetrics[] {
    return [...this.metrics];
  }

  getAverageRenderTime(): number {
    if (this.metrics.length === 0) return 0;
    const total = this.metrics.reduce((sum, m) => sum + m.renderTime, 0);
    return total / this.metrics.length;
  }

  logSlowRenders(threshold: number = 100): void {
    const slowRenders = this.metrics.filter(m => m.renderTime > threshold);
    if (slowRenders.length > 0) {
      console.group('🐌 Slow Renders Detected');
      slowRenders.forEach((m, i) => {
        console.warn(`Render ${i + 1}: ${m.renderTime.toFixed(2)}ms`);
      });
      console.groupEnd();
    }
  }

  // Memory usage monitoring (if available)
  getMemoryUsage(): number | null {
    if ('memory' in performance) {
      const memory = (performance as unknown as { memory: { usedJSHeapSize: number } }).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return null;
  }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

// React hook for performance monitoring
export function usePerformanceMonitor(componentName: string) {
  const startMeasure = () => {
    performanceMonitor.startMeasure(componentName);
  };

  const endMeasure = () => {
    const duration = performanceMonitor.endMeasure(componentName);
    if (duration > 100) {
      console.warn(`🐌 Slow render: ${componentName} took ${duration.toFixed(2)}ms`);
    }
  };

  return { startMeasure, endMeasure };
}
