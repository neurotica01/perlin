import { Stats } from '@react-three/drei'
import { Html } from '@react-three/drei'
import { TerrainParams } from '../types'

interface CustomStatsProps {
  params: TerrainParams
}

export function CustomStats({ params }: CustomStatsProps) {
  const markerY = 0.4 * params.amplitude

  return (
    <>
      <Stats />
      <Html position={[0, 0, 0]} style={{
        position: 'absolute',
        top: '80px',
        left: '8px',
        color: 'white',
        fontSize: '12px',
        fontFamily: 'monospace',
        backgroundColor: 'rgba(0,0,0,0.65)',
        padding: '4px 8px',
        borderRadius: '4px',
        whiteSpace: 'pre'
      }}>
        Marker Position: [0, {markerY.toFixed(2)}, 0]
      </Html>
    </>
  )
} 