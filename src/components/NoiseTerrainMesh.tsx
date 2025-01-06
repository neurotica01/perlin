import { useMemo, useRef } from 'react'
import { BufferGeometry, PlaneGeometry, Vector3 } from 'three'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { TerrainParams } from '../types'
import { updateTerrainGeometry } from '../utils/terrainUtils'
import { updatePerformanceMetrics, type PerformanceRef } from '../utils/metricsUtils'

const SEGMENTS = 200 // Fixed segment count

interface NoiseTerrainMeshProps {
  params: TerrainParams
}

export function NoiseTerrainMesh({ params }: NoiseTerrainMeshProps) {
  const geometryRef = useRef<BufferGeometry>(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const performanceRef = useRef<PerformanceRef>({
    lastUpdateTime: 0,
    frameCount: 0,
    averageUpdateTime: 0,
    rollingAverage: 0,
    sampleCount: 0,
    recentMeasurements: []
  })

  // Create base geometry
  const baseGeometry = useMemo(() => {
    return new PlaneGeometry(80, 80, SEGMENTS, SEGMENTS)
  }, [])

  // Update terrain every frame with performance monitoring
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

    // Calculate and update metrics
    const endTime = performance.now()
    const updateTime = endTime - startTime
    
    updatePerformanceMetrics(performanceRef.current, updateTime, endTime, params)
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      
      {/* <TerrainMarker params={params} offset={offsetRef.current} /> */}

      <mesh rotation-x={-Math.PI / 2}>
        <primitive object={baseGeometry} ref={geometryRef} />
        <meshStandardMaterial wireframe color="lime" />
      </mesh>
    </>
  )
} 