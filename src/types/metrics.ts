import { TerrainParams } from "../types"

export interface PerformanceMetrics {
  timestamp: number
  averageUpdateTime: number
  frameCount: number
  params: TerrainParams
  rollingAverage: number
}

export interface MetricsStore {
  sessionId: string
  metrics: PerformanceMetrics[]
  rollingAverage: number
  sampleCount: number
} 