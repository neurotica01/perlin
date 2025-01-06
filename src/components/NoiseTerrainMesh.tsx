import { useMemo } from 'react'
import { BufferGeometry, PlaneGeometry } from 'three'
import { octaveNoise } from '../utils/perlin' // We'll create this next
import { OrbitControls } from '@react-three/drei'

export function NoiseTerrainMesh() {
  const geometry = useMemo(() => {
    // Increase size to 20x20, and add more segments for detail
    const baseGeometry = new PlaneGeometry(40, 40, 100, 100)
    const positions = baseGeometry.attributes.position

    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i)
      const y = positions.getY(i)
      // Adjust frequency to get more waves across the larger surface
    //   const z = noise(x * 0.8, y * 0.8) * 2
      const z = octaveNoise(x * 0.8, y * 0.8) * 2
      positions.setZ(i, z)
    }

    return baseGeometry
  }, [])

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