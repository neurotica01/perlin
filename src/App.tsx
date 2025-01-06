import { Canvas } from '@react-three/fiber'
import { NoiseTerrainMesh } from './components/NoiseTerrainMesh'

function App() {
  return (
    <Canvas camera={{ position: [0, 5, 5], fov: 75 }}>
      <NoiseTerrainMesh />
    </Canvas>
  )
}

export default App