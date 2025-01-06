import { NoiseTerrainViewer } from './components/NoiseTerrainViewer'
import { ControlPanel } from './components/ControlPanel'
import { useState } from 'react'

function App() {
  const [terrainParams, setTerrainParams] = useState({
    octaves: 6,
    persistence: 0.65,
    amplitude: 40.1,
    frequency: 0.8,
    speed: 1.6
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