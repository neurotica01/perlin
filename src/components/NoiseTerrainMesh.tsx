import { useMemo, useRef } from 'react'
import { BufferGeometry, PlaneGeometry, Vector3 } from 'three'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { TerrainParams } from '../types'
import { updateTerrainGeometry } from '../utils/terrainUtils'
import { saveMetrics } from '../utils/metricsUtils'

// Define LOD levels based on camera distance
const LOD_LEVELS = {
  NEAR: { distance: 40, segments: 200 },
  MID: { distance: 80, segments: 100 },
  FAR: { distance: Infinity, segments: 50 }
}

interface NoiseTerrainMeshProps {
  params: TerrainParams
}

export function NoiseTerrainMesh({ params }: NoiseTerrainMeshProps) {
  const geometryRef = useRef<BufferGeometry>(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const { camera } = useThree()
  const lastLODRef = useRef(LOD_LEVELS.MID.segments)
  const performanceRef = useRef({
    lastUpdateTime: 0,
    frameCount: 0,
    averageUpdateTime: 0,
    rollingAverage: 0,
    sampleCount: 0,
    recentMeasurements: [] as number[]
  })

  // Create base geometry with LOD-based memoization
  const baseGeometry = useMemo(() => {
    const distance = camera.position.distanceTo(new Vector3(0, 0, 0))
    let segments = LOD_LEVELS.MID.segments

    if (distance < LOD_LEVELS.NEAR.distance) {
      segments = LOD_LEVELS.NEAR.segments
    } else if (distance < LOD_LEVELS.MID.distance) {
      segments = LOD_LEVELS.MID.segments
    } else {
      segments = LOD_LEVELS.FAR.segments
    }

    lastLODRef.current = segments
    return new PlaneGeometry(80, 80, segments, segments)
  }, [camera.position])

  // Update terrain every frame with LOD check and performance monitoring
  useFrame((_, delta) => {
    if (!geometryRef.current) return

    const startTime = performance.now()
    const distance = camera.position.distanceTo(new Vector3(0, 0, 0))
    let currentLOD = lastLODRef.current

    // Check if LOD needs to change
    if (distance < LOD_LEVELS.NEAR.distance) {
      currentLOD = LOD_LEVELS.NEAR.segments
    } else if (distance < LOD_LEVELS.MID.distance) {
      currentLOD = LOD_LEVELS.MID.segments
    } else {
      currentLOD = LOD_LEVELS.FAR.segments
    }

    // Update offset
    offsetRef.current.x += delta * params.speed
    offsetRef.current.y += delta * params.speed

    // Update geometry using utility function
    updateTerrainGeometry(
      geometryRef.current.attributes.position,
      offsetRef.current,
      params
    )

    // Calculate metrics
    const endTime = performance.now()
    const updateTime = endTime - startTime
    
    const WINDOW_SIZE = 100 // Keep last 100 measurements
    const measurements = performanceRef.current.recentMeasurements

    // Add new measurement
    measurements.push(updateTime)

    // Remove oldest measurement if we exceed window size
    if (measurements.length > WINDOW_SIZE) {
      measurements.shift()
    }

    // Calculate new average from recent measurements only
    performanceRef.current.averageUpdateTime = 
      measurements.reduce((sum, val) => sum + val, 0) / measurements.length

    performanceRef.current.frameCount++

    // Save metrics every second
    if (endTime - performanceRef.current.lastUpdateTime > 1000) {
      saveMetrics({
        averageUpdateTime: performanceRef.current.averageUpdateTime,
        frameCount: performanceRef.current.frameCount,
        timestamp: Date.now(),
        params,
        rollingAverage: performanceRef.current.rollingAverage
      })
      performanceRef.current.lastUpdateTime = endTime
    }
  })

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      
      <mesh position={[0, .4 * params.amplitude, 0]}>
        <sphereGeometry args={[, 16, 16]} />
        <meshStandardMaterial color="red" />
      </mesh>

      <mesh rotation-x={-Math.PI / 2}>
        <primitive object={baseGeometry} ref={geometryRef} />
        <meshStandardMaterial wireframe color="lime" />
      </mesh>
    </>
  )
} 