import { NoiseTerrainViewer } from './components/NoiseTerrainViewer'
import { ControlPanel } from './components/ControlPanel'
import { useState } from 'react'
import { TERRAIN_PARAMS_CONFIG } from './config/terrainConfig'

function App() {
  const [terrainParams, setTerrainParams] = useState({
    octaves: TERRAIN_PARAMS_CONFIG.octaves.default,
    persistence: TERRAIN_PARAMS_CONFIG.persistence.default,
    amplitude: TERRAIN_PARAMS_CONFIG.amplitude.default,
    frequency: TERRAIN_PARAMS_CONFIG.frequency.default,
    speed: TERRAIN_PARAMS_CONFIG.speed.default
  })

  return (
    <div className="app-container">
      <div className="viewer-container">
        <NoiseTerrainViewer params={terrainParams} />
      </div>
      <ControlPanel 
        params={terrainParams} 
        onParamsChange={setTerrainParams} 
      />
    </div>
  )
}

export default App