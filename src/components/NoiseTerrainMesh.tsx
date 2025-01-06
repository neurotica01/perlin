import { useMemo, useRef } from 'react'
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

  // Create base geometry with memoization
  const baseGeometry = useMemo(() => {
    return new PlaneGeometry(80, 80, 150, 150)
  }, [])

  // Update terrain every frame with separated logic
  useFrame((_, delta) => {
    if (!geometryRef.current) return

    // Update offset
    offsetRef.current.x += delta * params.speed
    offsetRef.current.y += delta * params.speed

    // Update geometry using utility function
    updateTerrainGeometry(
      geometryRef.current.attributes.position,
      offsetRef.current,
      params
    )
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