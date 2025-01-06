import { Canvas } from '@react-three/fiber'
import { NoiseTerrainMesh } from './NoiseTerrainMesh'

interface NoiseTerrainViewerProps {
  params: {
    octaves: number
    persistence: number
    amplitude: number
    frequency: number
  }
}

export const NoiseTerrainViewer = ({ params }: NoiseTerrainViewerProps) => {
  return (
    <Canvas camera={{ position: [20, 10, 20], fov: 50 }}>
      <color attach="background" args={['#000000']} />
      <NoiseTerrainMesh params={params} />
    </Canvas>
  )
}