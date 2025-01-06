import { useState } from 'react'

interface ControlPanelProps {
  onParamsChange: (params: {
    octaves: number
    persistence: number
    amplitude: number
    frequency: number
  }) => void
}

export function ControlPanel({ onParamsChange }: ControlPanelProps) {
  const [params, setParams] = useState({
    octaves: 4,
    persistence: 0.65,
    amplitude: 1,
    frequency: 1
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const newParams = { ...params, [name]: parseFloat(value) }
    setParams(newParams)
    onParamsChange(newParams)
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
            max="2"
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
    </div>
  )
} 