import { PerformanceMetrics, MetricsStore } from '../types/metrics'
import { TerrainParams } from '../types'

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

export interface PerformanceRef {
  lastUpdateTime: number
  frameCount: number
  averageUpdateTime: number
  rollingAverage: number
  sampleCount: number
  recentMeasurements: number[]
}

export function updatePerformanceMetrics(
  performanceRef: PerformanceRef,
  updateTime: number,
  endTime: number,
  params: TerrainParams
) {
  const WINDOW_SIZE = 100 // Keep last 100 measurements
  const measurements = performanceRef.recentMeasurements

  // Add new measurement
  measurements.push(updateTime)

  // Remove oldest measurement if we exceed window size
  if (measurements.length > WINDOW_SIZE) {
    measurements.shift()
  }

  // Calculate new average from recent measurements only
  performanceRef.averageUpdateTime = 
    measurements.reduce((sum, val) => sum + val, 0) / measurements.length

  performanceRef.frameCount++

  // Save metrics every second
  if (endTime - performanceRef.lastUpdateTime > 1000) {
    saveMetrics({
      averageUpdateTime: performanceRef.averageUpdateTime,
      frameCount: performanceRef.frameCount,
      timestamp: Date.now(),
      params: params,
      rollingAverage: performanceRef.rollingAverage
    })
    performanceRef.lastUpdateTime = endTime
  }
} 