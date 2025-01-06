import { PerformanceMetrics, MetricsStore } from '../types/metrics'

const METRICS_STORAGE_KEY = 'terrain-metrics'
const ROLLING_WINDOW_SIZE = 100 // Adjust this for longer/shorter averaging

export function saveMetrics(metrics: PerformanceMetrics) {
  try {
    const existingData = localStorage.getItem(METRICS_STORAGE_KEY)
    const store: MetricsStore = existingData 
      ? JSON.parse(existingData)
      : { 
          sessionId: Date.now().toString(), 
          metrics: [], 
          rollingAverage: 0,
          sampleCount: 0 
        }

    // Update rolling average
    store.sampleCount++
    store.rollingAverage = 
      (store.rollingAverage * Math.min(store.sampleCount - 1, ROLLING_WINDOW_SIZE) + 
       metrics.averageUpdateTime) / 
      Math.min(store.sampleCount, ROLLING_WINDOW_SIZE)

    // Add metrics with rolling average
    store.metrics.push({
      ...metrics,
      rollingAverage: store.rollingAverage
    })

    // Optionally trim old metrics to prevent localStorage from growing too large
    if (store.metrics.length > ROLLING_WINDOW_SIZE) {
      store.metrics = store.metrics.slice(-ROLLING_WINDOW_SIZE)
    }

    localStorage.setItem(METRICS_STORAGE_KEY, JSON.stringify(store))

    if (import.meta.env.PROD) {
      void sendMetricsToAnalytics(metrics)
    }
  } catch (error) {
    console.error('Failed to save metrics:', error)
  }
}

export function getStoredMetrics(): MetricsStore[] {
  try {
    const data = localStorage.getItem(METRICS_STORAGE_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Failed to retrieve metrics:', error)
    return []
  }
}

async function sendMetricsToAnalytics(metrics: PerformanceMetrics) {
  // Implement your analytics service integration here
  // Example: Send to Google Analytics or custom backend
}

export function clearMetrics() {
  localStorage.removeItem(METRICS_STORAGE_KEY)
} 