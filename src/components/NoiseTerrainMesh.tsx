import { useMemo, useRef, useEffect } from 'react'
import { BufferGeometry, PlaneGeometry } from 'three'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { TerrainParams } from '../types'
import { updateTerrainGeometry } from '../utils/terrainUtils'

interface NoiseTerrainMeshProps {
  params: TerrainParams
}

export function NoiseTerrainMesh({ params }: NoiseTerrainMeshProps) {
  const geometryRef = useRef<BufferGeometry>(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const performanceRef = useRef({
    lastUpdateTime: 0,
    frameCount: 0,
    averageUpdateTime: 0
  })

  // Create base geometry with memoization
  const baseGeometry = useMemo(() => {
    return new PlaneGeometry(80, 80, 150, 150)
  }, [])

  // Update terrain every frame with separated logic and performance monitoring
  useFrame((_, delta) => {
    if (!geometryRef.current) return

    const startTime = performance.now()

    // Update offset
    offsetRef.current.x += delta * params.speed
    offsetRef.current.y += delta * params.speed

    // Update geometry using utility function
    updateTerrainGeometry(
      geometryRef.current.attributes.position,
      offsetRef.current,
      params
    )

    // Calculate performance metrics
    const endTime = performance.now()
    const updateTime = endTime - startTime
    
    performanceRef.current.frameCount++
    performanceRef.current.averageUpdateTime = 
      (performanceRef.current.averageUpdateTime * (performanceRef.current.frameCount - 1) + updateTime) 
      / performanceRef.current.frameCount

    // Log performance every second
    if (endTime - performanceRef.current.lastUpdateTime > 1000) {
      console.log(`Average update time: ${performanceRef.current.averageUpdateTime.toFixed(2)}ms`)
      performanceRef.current.lastUpdateTime = endTime
      performanceRef.current.frameCount = 0
    }
  })

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <mesh rotation-x={-Math.PI / 2}>
        <primitive object={baseGeometry} ref={geometryRef} />
        <meshStandardMaterial wireframe color="lime" />
      </mesh>
    </>
  )
} 