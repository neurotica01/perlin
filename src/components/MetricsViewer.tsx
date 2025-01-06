import { useState, useEffect } from 'react'
import { getStoredMetrics, clearMetrics } from '../utils/metricsUtils'
import { MetricsStore } from '../types/metrics'

export function MetricsViewer() {
  const [metrics, setMetrics] = useState<MetricsStore[]>([])

  useEffect(() => {
    setMetrics(getStoredMetrics())
  }, [])

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(metrics, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `terrain-metrics-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="metrics-viewer">
      <h3>Performance Metrics</h3>
      <div className="metrics-controls">
        <button onClick={handleExport}>Export Metrics</button>
        <button onClick={() => { clearMetrics(); setMetrics([]) }}>Clear Metrics</button>
      </div>
      <div className="metrics-list">
        {metrics.map((store) => (
          <div key={store.sessionId} className="metrics-session">
            <h4>Session: {new Date(parseInt(store.sessionId)).toLocaleString()}</h4>
            <ul>
              {store.metrics.map((metric, idx) => (
                <li key={idx}>
                  Update Time: {metric.averageUpdateTime.toFixed(2)}ms | 
                  Frames: {metric.frameCount} |
                  Time: {new Date(metric.timestamp).toLocaleTimeString()}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
} 