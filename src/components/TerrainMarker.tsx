import { TerrainParams } from '../types'

interface TerrainMarkerProps {
  params: TerrainParams
}

export function TerrainMarker({ params }: TerrainMarkerProps) {
  return (
    <mesh position={[0, .4 * params.amplitude, 0]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
} 