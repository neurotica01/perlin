import { Canvas } from '@react-three/fiber'
import { NoiseTerrainMesh } from './NoiseTerrainMesh'

export const NoiseTerrainViewer = () => {
  return (
    <Canvas camera={{ position: [20, 20, 20], fov: 50 }}>
      <color attach="background" args={['#000000']} />
      <NoiseTerrainMesh />
    </Canvas>
  )
}