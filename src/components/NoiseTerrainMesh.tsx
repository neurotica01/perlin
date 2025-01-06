import { useMemo } from 'react'
import { BufferGeometry, PlaneGeometry } from 'three'
import { octaveNoise } from '../utils/perlin' // We'll create this next
import { OrbitControls } from '@react-three/drei'

interface NoiseTerrainMeshProps {
  params: {
    octaves: number
    persistence: number
    amplitude: number
    frequency: number
  }
}

export function NoiseTerrainMesh({ params }: NoiseTerrainMeshProps) {
  const geometry = useMemo(() => {
    // Increase size to 20x20, and add more segments for detail
    const baseGeometry = new PlaneGeometry(40, 40, 100, 100)
    const positions = baseGeometry.attributes.position

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      const z = octaveNoise(
        x * params.frequency, 
        y * params.frequency, 
        params.octaves, 
        params.persistence
      ) * params.amplitude
      positions.setZ(i, z)
    }

    return baseGeometry
  }, [params])

  return (
    <>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <mesh rotation-x={-Math.PI / 2}>
        <primitive object={geometry} />
        <meshStandardMaterial wireframe color="lime" />
      </mesh>
    </>
  )
} 