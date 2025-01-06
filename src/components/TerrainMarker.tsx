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
  const xVelocity = useRef(0)
  
  // Configuration constants
  const CONSTANT_HEIGHT = 100
  const LOOK_AHEAD_DISTANCE = 50
  const SAMPLE_POINTS = 15
  const MAX_WEAVE = 25
  const MAX_VELOCITY = 8
  const ACCELERATION = 12
  const DECELERATION = 15
  
  useFrame((_, delta) => {
    if (!markerRef.current) return
    
    // Sample points ahead along y-basis to detect obstacles
    const obstacles: number[] = []
    for (let i = 1; i <= SAMPLE_POINTS; i++) {
      const distance = (i / SAMPLE_POINTS) * LOOK_AHEAD_DISTANCE
      const sampleX = -distance / Math.sqrt(2)
      const sampleZ = distance / Math.sqrt(2)
      
      // Sample multiple points perpendicular to travel direction
      for (let j = -2; j <= 2; j++) {
        const offsetX = j * 5 * (-1 / Math.sqrt(2))
        const offsetZ = j * 5 * (-1 / Math.sqrt(2))
        
        const height = sampleTerrainHeight(
          sampleX + offsetX,
          sampleZ + offsetZ,
          offset,
          params
        )
        obstacles.push(height)
      }
    }
    
    const maxObstacleHeight = Math.max(...obstacles)
    const heightDifference = maxObstacleHeight - CONSTANT_HEIGHT
    
    // Determine desired direction based on obstacles
    let targetVelocity = 0
    if (heightDifference > -10) {
      targetVelocity = currentXOffset.current >= 0 ? MAX_VELOCITY : -MAX_VELOCITY
    } else {
      targetVelocity = -Math.sign(currentXOffset.current) * MAX_VELOCITY * 0.5
    }
    
    // Apply acceleration/deceleration with dampening
    const acceleration = targetVelocity !== 0 ? ACCELERATION : DECELERATION
    const deltaV = acceleration * delta * 0.8
    
    if (Math.abs(targetVelocity - xVelocity.current) <= deltaV) {
      xVelocity.current = targetVelocity
    } else {
      xVelocity.current += deltaV * Math.sign(targetVelocity - xVelocity.current)
    }
    
    // Update position with velocity and additional dampening
    currentXOffset.current += xVelocity.current * delta * 0.9
    currentXOffset.current = Math.max(-MAX_WEAVE, Math.min(MAX_WEAVE, currentXOffset.current))
    
    // Apply movement along x-basis
    const xBasisScale = currentXOffset.current / Math.sqrt(2)
    markerRef.current.position.x = -xBasisScale
    markerRef.current.position.z = -xBasisScale
    markerRef.current.position.y = CONSTANT_HEIGHT
  })

  return (
    <mesh ref={markerRef}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="red" />
    </mesh>
  )
} 