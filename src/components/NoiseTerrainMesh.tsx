import { useMemo, useRef } from 'react'
import { BufferGeometry, PlaneGeometry } from 'three'
import { octaveNoise } from '../utils/perlin'
import { OrbitControls } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

interface NoiseTerrainMeshProps {
  params: {
    octaves: number
    persistence: number
    amplitude: number
    frequency: number
    speed: number
  }
}

export function NoiseTerrainMesh({ params }: NoiseTerrainMeshProps) {
  const geometryRef = useRef<BufferGeometry>(null)
  const offsetRef = useRef({ x: 0, y: 0 })

  // Create base geometry
  const baseGeometry = useMemo(() => {
    return new PlaneGeometry(80, 80, 150, 150)
  }, [])

  // Update terrain every frame
  useFrame((state, delta) => {
    if (!geometryRef.current) return

    // Update offset using the speed parameter
    offsetRef.current.x += delta * params.speed
    offsetRef.current.y += delta * params.speed

    const positions = geometryRef.current.attributes.position

    // Update vertex positions
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      
      // Add offset to sampling coordinates
      const sampleX = (x + offsetRef.current.x) * params.frequency
      const sampleY = (y + offsetRef.current.y) * params.frequency
      
      const z = octaveNoise(
        sampleX,
        sampleY,
        params.octaves,
        params.persistence
      ) * params.amplitude

      positions.setZ(i, z)
    }

    positions.needsUpdate = true
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