import { TerrainParams } from '../types'
import { TERRAIN_PARAMS_CONFIG } from '../config/terrainConfig'

interface ControlPanelProps {
  params: TerrainParams
  onParamsChange: (params: TerrainParams) => void
}

export function ControlPanel({ params, onParamsChange }: ControlPanelProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    onParamsChange({
      ...params,
      [name]: parseFloat(value)
    })
  }

  return (
    <div className="control-panel">
      {Object.entries(TERRAIN_PARAMS_CONFIG).map(([key, config]) => (
        <div key={key} className="control-group">
          <label>
            {key.charAt(0).toUpperCase() + key.slice(1)}: {params[key as keyof TerrainParams]}
            <input
              type="range"
              name={key}
              min={config.min}
              max={config.max}
              step={config.step}
              value={params[key as keyof TerrainParams]}
              onChange={handleChange}
            />
          </label>
        </div>
      ))}
    </div>
  )
} 