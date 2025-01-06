import { useMemo, useRef } from 'react'
import { BufferGeometry, PlaneGeometry, Vector3, Material, MeshStandardMaterial, ShaderMaterial, BufferAttribute } from 'three'
import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { TerrainParams } from '../types'
import { updateTerrainGeometry } from '../utils/terrainUtils'
import { updatePerformanceMetrics, type PerformanceRef } from '../utils/metricsUtils'
import { GEOMETRY_CONFIG } from '../config/geometryConfig'

interface NoiseTerrainMeshProps {
  params: TerrainParams
}

const vertexShader = `
  attribute float vertexOpacity;
  varying float vOpacity;

  void main() {
    vOpacity = vertexOpacity;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  varying float vOpacity;
  uniform vec3 color;

  void main() {
    gl_FragColor = vec4(color, vOpacity);
  }
`

export function NoiseTerrainMesh({ params }: NoiseTerrainMeshProps) {
  const geometryRef = useRef<BufferGeometry>(null)
  const materialRef = useRef<ShaderMaterial>(null)
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
    return new PlaneGeometry(
      GEOMETRY_CONFIG.PLANE_SIZE, 
      GEOMETRY_CONFIG.PLANE_SIZE, 
      GEOMETRY_CONFIG.SEGMENTS, 
      GEOMETRY_CONFIG.SEGMENTS
    )
  }, [])

  // Create custom shader material
  const shaderMaterial = useMemo(() => {
    return new ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      wireframe: true,
      uniforms: {
        color: { value: [0, 1, 0] } // lime color
      }
    })
  }, [])

  // Update terrain every frame with performance monitoring
  useFrame((_, delta) => {
    if (!geometryRef.current || !materialRef.current) return

    const startTime = performance.now()

    // Update offset
    offsetRef.current.x += delta * params.speed
    offsetRef.current.y += delta * params.speed

    // Update geometry and get opacity array
    const opacityArray = updateTerrainGeometry(
      geometryRef.current.attributes.position,
      offsetRef.current,
      params
    )

    // Update vertex opacity attribute
    if (!geometryRef.current.attributes.vertexOpacity) {
      geometryRef.current.setAttribute('vertexOpacity', new BufferAttribute(opacityArray, 1))
    } else {
      geometryRef.current.attributes.vertexOpacity.array = opacityArray
      geometryRef.current.attributes.vertexOpacity.needsUpdate = true
    }

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
        <primitive object={shaderMaterial} ref={materialRef} />
      </mesh>
    </>
  )
} 