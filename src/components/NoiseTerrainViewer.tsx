import { Canvas } from '@react-three/fiber'
import { NoiseTerrainMesh } from './NoiseTerrainMesh'
import { TerrainParams } from '../types'
import { Stats } from '@react-three/drei'

interface NoiseTerrainViewerProps {
  params: TerrainParams
}

export const NoiseTerrainViewer = ({ params }: NoiseTerrainViewerProps) => {
  return (
    <Canvas camera={{ position: [30, 30, 30], fov: 50 }}>
      <Stats />
      <color attach="background" args={['#000000']} />
      <NoiseTerrainMesh params={params} />
    </Canvas>
  )
}