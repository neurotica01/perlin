import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { TerrainParams } from '../types'
import { sampleTerrainHeight } from '../utils/terrainUtils'
import { Mesh } from 'three'
import { Html } from '@react-three/drei'


interface TerrainMarkerProps {
  params: TerrainParams
  offset: { x: number, y: number }
}

export function TerrainMarker({ params, offset }: TerrainMarkerProps) {
  const markerRef = useRef<Mesh>(null)
  
  useFrame(() => {
    if (!markerRef.current) return
    
    // Sample current position
    const currentHeight = sampleTerrainHeight(0, 0, offset, params)
    
    // Update marker height to match terrain
    markerRef.current.position.y = currentHeight
    
    // Sample points ahead
    const lookAheadDistance = 5
    const aheadHeight = sampleTerrainHeight(
      lookAheadDistance, 
      lookAheadDistance, 
      offset, 
      params
    )
    
    // Log only when height changes significantly
    if (Math.abs(currentHeight - aheadHeight) > 1) {
      console.log('Significant height change detected:', {
        current: currentHeight.toFixed(2),
        ahead: aheadHeight.toFixed(2),
      })
    }
  })

  return (
    <group>
      {/* Main marker */}
      <mesh ref={markerRef} position={[0, 0, 0]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>
      
      {/* Debug marker for look-ahead point */}
      <mesh position={[5, 0, 5]}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshStandardMaterial color="yellow" wireframe />
      </mesh>


      {/* Corner markers */}
      {[
        { pos: [40, 0, 40], label: "-x", color: "yellow" },
        { pos: [-40, 0, -40], label: "+x", color: "yellow" },
        { pos: [-40, 0, 40], label: "+y", color: "blue" },
        { pos: [40, 0, -40], label: "-y", color: "blue" }
      ].map(({ pos, label, color }) => (
        <group key={label} position={[pos[0], pos[1], pos[2]]}>
          <mesh>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color={color} />
          </mesh>
          <Html center>
            <div style={{
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0.8)',
              padding: '4px 8px',
              borderRadius: '4px',
              fontSize: '12px',
              whiteSpace: 'nowrap'
            }}>
              {label}
            </div>
          </Html>
        </group>
      ))}

    </group>

    
  )
} 