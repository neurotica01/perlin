import { useState } from 'react'

interface ControlPanelProps {
  params: {
    octaves: number
    persistence: number
    amplitude: number
    frequency: number
    speed: number
  }
  onParamsChange: (params: {
    octaves: number
    persistence: number
    amplitude: number
    frequency: number
    speed: number
  }) => void
}

export function ControlPanel({ params, onParamsChange }: ControlPanelProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onParamsChange({ ...params, [name]: parseFloat(value) })
  }

  return (
    <div className="control-panel">
      <h3>Terrain Controls</h3>
      
      <div className="control-group">
        <label>
          Octaves: {params.octaves}
          <input
            type="range"
            name="octaves"
            min="1"
            max="8"
            step="1"
            value={params.octaves}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Persistence: {params.persistence}
          <input
            type="range"
            name="persistence"
            min="0.1"
            max="1"
            step="0.05"
            value={params.persistence}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Amplitude: {params.amplitude}
          <input
            type="range"
            name="amplitude"
            min="0.1"
            max="100"
            step="0.1"
            value={params.amplitude}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Frequency: {params.frequency}
          <input
            type="range"
            name="frequency"
            min="0.1"
            max="2"
            step="0.1"
            value={params.frequency}
            onChange={handleChange}
          />
        </label>
      </div>

      <div className="control-group">
        <label>
          Flight Speed: {params.speed}
          <input
            type="range"
            name="speed"
            min="0"
            max="2"
            step="0.1"
            value={params.speed}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  )
} 