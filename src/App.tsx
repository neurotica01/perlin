import { NoiseTerrainViewer } from './components/NoiseTerrainViewer'
import { ControlPanel } from './components/ControlPanel'
import { useState } from 'react'

function App() {
  const [terrainParams, setTerrainParams] = useState({
    octaves: 4,
    persistence: 0.65,
    amplitude: 1,
    frequency: 1
  })

  return (
    <div className="app-container">
      <div className="viewer-container">
        <NoiseTerrainViewer params={terrainParams} />
      </div>
      <ControlPanel onParamsChange={setTerrainParams} />
    </div>
  )
}

export default App