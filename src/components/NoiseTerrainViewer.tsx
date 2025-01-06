import { Canvas } from '@react-three/fiber'
import { NoiseTerrainMesh } from './NoiseTerrainMesh'

interface NoiseTerrainViewerProps {
  params: {
    octaves: number
    persistence: number
    amplitude: number
    frequency: number
    speed: number
  }
}

export const NoiseTerrainViewer = ({ params }: NoiseTerrainViewerProps) => {
  return (
    <Canvas camera={{ position: [30, 30, 30], fov: 50 }}>
      <color attach="background" args={['#000000']} />
      <NoiseTerrainMesh params={params} />
    </Canvas>
  )
}