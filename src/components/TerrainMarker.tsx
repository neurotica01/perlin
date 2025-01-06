import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { TerrainParams } from '../types'
import { sampleTerrainHeight } from '../utils/terrainUtils'
import { Mesh, Vector3 } from 'three'

interface TerrainMarkerProps {
  params: TerrainParams
  offset: { x: number; y: number }
}

export function TerrainMarker({ params, offset }: TerrainMarkerProps) {
  const markerRef = useRef<Mesh>(null)
  const currentXOffset = useRef(0)
  const CONSTANT_HEIGHT = 20 // Height we want to maintain
  const LOOK_AHEAD_DISTANCE = 20 // How far ahead to check for obstacles
  const SAMPLE_POINTS = 5 // Number of points to sample ahead
  const MAX_WEAVE = 15 // Maximum x-basis deviation
  
  useFrame((_, delta) => {
    if (!markerRef.current) return
    
    // Sample points ahead along y-basis to detect obstacles
    const obstacles: number[] = []
    for (let i = 1; i <= SAMPLE_POINTS; i++) {
      // Calculate sample point along y-basis [-1/√2, 0, 1/√2]
      const distance = (i / SAMPLE_POINTS) * LOOK_AHEAD_DISTANCE
      const sampleX = -distance / Math.sqrt(2)
      const sampleZ = distance / Math.sqrt(2)
      
      // Get height at sample point
      const height = sampleTerrainHeight(
        sampleX,
        sampleZ,
        offset,
        params
      )
      obstacles.push(height)
    }
    
    // Find highest upcoming obstacle
    const maxObstacleHeight = Math.max(...obstacles)
    
    // If obstacle detected, adjust x-basis position to avoid
    if (maxObstacleHeight > CONSTANT_HEIGHT - 5) {
      // Move along x-basis away from current position
      currentXOffset.current += delta * 10
      if (currentXOffset.current > MAX_WEAVE) currentXOffset.current = MAX_WEAVE
    } else {
      // Return to center if no obstacles
      currentXOffset.current *= 0.95
    }
    
    // Apply x-basis movement [-1/√2, 0, -1/√2]
    const xBasisScale = currentXOffset.current / Math.sqrt(2)
    markerRef.current.position.x = -xBasisScale
    markerRef.current.position.z = -xBasisScale
    
    // Maintain constant height
    markerRef.current.position.y = CONSTANT_HEIGHT
  })

  return (
    <mesh ref={markerRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
} 