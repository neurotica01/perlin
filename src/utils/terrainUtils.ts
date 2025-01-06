import { BufferAttribute, InterleavedBufferAttribute } from 'three'
import { octaveNoise } from './perlin'
import { TerrainParams } from '../types'

interface TerrainOffset {
  x: number
  y: number
}

export function updateTerrainGeometry(
  positions: BufferAttribute | InterleavedBufferAttribute,
  offset: TerrainOffset,
  params: TerrainParams
) {
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    
    const sampleX = (x + offset.x) * params.frequency
    const sampleY = (y + offset.y) * params.frequency
    
    const z = octaveNoise(
      sampleX,
      sampleY,
      params.octaves,
      params.persistence
    ) * params.amplitude

    positions.setZ(i, z)
  }

  positions.needsUpdate = true
} 