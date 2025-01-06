import { useMemo, useRef } from 'react'
import { BufferGeometry, PlaneGeometry, ShaderMaterial } from 'three'
import { useFrame } from '@react-three/fiber'
import { TerrainParams } from '../types'
import { updateTerrainGeometry } from '../utils/terrainUtils'
import { updatePerformanceMetrics } from '../utils/metricsUtils'
import { GEOMETRY_CONFIG } from '../config/geometryConfig'

interface NoiseTerrainMeshProps {
  params: TerrainParams
}

const vertexShader = `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform vec3 color;

  void main() {
    gl_FragColor = vec4(color, 1.0);
  }
`

export function NoiseTerrainMesh({ params }: NoiseTerrainMeshProps) {
  const baseGeometryRef = useRef<BufferGeometry>(null)
  const wireframeGeometryRef = useRef<BufferGeometry>(null)
  const materialRef = useRef<ShaderMaterial>(null)
  const offsetRef = useRef({ x: 0, y: 0 })
  const performanceRef = useRef({
    lastUpdateTime: 0,
    frameCount: 0,
    averageUpdateTime: 0,
    rollingAverage: 0,
    sampleCount: 0,
    recentMeasurements: []
  })

  // Create base geometry
  const baseGeometry = useMemo(() => {
    return new PlaneGeometry(
      GEOMETRY_CONFIG.PLANE_SIZE,
      GEOMETRY_CONFIG.PLANE_SIZE,
      GEOMETRY_CONFIG.SEGMENTS,
      GEOMETRY_CONFIG.SEGMENTS
    )
  }, [])

  // Create wireframe shader material
  const wireframeMaterial = useMemo(() => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      wireframe: true,
      uniforms: {
        color: { value: [0, 1, 0] }
      }
    })
  }, [])

  useFrame((_, delta) => {
    if (!baseGeometryRef.current || !wireframeGeometryRef.current) return

    const startTime = performance.now()

    // Update offset
    offsetRef.current.x += delta * params.speed
    offsetRef.current.y += delta * params.speed

    // Update both geometries
    updateTerrainGeometry(
      baseGeometryRef.current.attributes.position,
      offsetRef.current,
      params
    )
    updateTerrainGeometry(
      wireframeGeometryRef.current.attributes.position,
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
      
      {/* Base black terrain */}
      <mesh rotation-x={-Math.PI / 2}>
        <primitive object={baseGeometry} ref={baseGeometryRef} />
        <meshBasicMaterial color="black" />
      </mesh>

      {/* Green wireframe overlay */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.1, 0]}>
        <primitive object={baseGeometry.clone()} ref={wireframeGeometryRef} />
        <primitive object={wireframeMaterial} ref={materialRef} />
      </mesh>
    </>
  )
} 