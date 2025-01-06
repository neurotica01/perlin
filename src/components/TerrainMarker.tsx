import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { TerrainParams } from '../types'
import { sampleTerrainHeight } from '../utils/terrainUtils'
import { Mesh } from 'three'
import { Html } from '@react-three/drei'

interface TerrainMarkerProps {
  params: TerrainParams
  offset: { x: number; y: number }
}

export function TerrainMarker({ params, offset }: TerrainMarkerProps) {
  const markerRef = useRef<Mesh>(null)
  const weaveRef = useRef(0)
  
  useFrame((_, delta) => {
    if (!markerRef.current) return
    
    // Update weave position using sin wave
    weaveRef.current += delta
    const weaveAmplitude = 10 // Maximum sideways distance
    const weaveFrequency = 0.5 // Speed of weaving
    
    // Calculate weave offset along x-basis
    const weaveOffset = Math.sin(weaveRef.current * weaveFrequency) * weaveAmplitude
    
    // Apply x-basis movement [-1/√2, 0, -1/√2]
    const xBasisScale = weaveOffset / Math.sqrt(2)
    markerRef.current.position.x = -xBasisScale
    markerRef.current.position.z = -xBasisScale
    
    // Sample terrain height at new position
    const currentHeight = sampleTerrainHeight(
      markerRef.current.position.x,
      markerRef.current.position.z,
      offset,
      params
    )
    
    // Update marker height
    markerRef.current.position.y = currentHeight
  })

  return (
    <group>
      {/* Main marker */}
      <mesh ref={markerRef}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshStandardMaterial color="red" />
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