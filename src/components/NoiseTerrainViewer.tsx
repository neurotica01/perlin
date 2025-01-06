import { Canvas } from '@react-three/fiber'
import { NoiseTerrainMesh } from './NoiseTerrainMesh'
import { TerrainParams } from '../types'

interface NoiseTerrainViewerProps {
  params: TerrainParams
}

export const NoiseTerrainViewer = ({ params }: NoiseTerrainViewerProps) => {
  return (
    <Canvas camera={{ position: [30, 30, 30], fov: 50 }}>
      <color attach="background" args={['#000000']} />
      <NoiseTerrainMesh params={params} />
    </Canvas>
  )
}