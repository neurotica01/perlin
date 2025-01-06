import { BufferAttribute, InterleavedBufferAttribute } from 'three'
import { octaveNoise } from './perlin'
import { TerrainParams } from '../types'
import { GEOMETRY_CONFIG } from '../config/geometryConfig'

interface TerrainOffset {
  x: number
  y: number
}

interface TerrainVertex {
  height: number
  offset: number
}

function easeOutQuart(x: number): number {
  return 1 - Math.pow(1 - x, 4)
}

function createWaterfallCurve(t: number): TerrainVertex {
  const eased = easeOutQuart(t)
  const fallDistance = (1 - eased) * GEOMETRY_CONFIG.BOUNDARY_THRESHOLD * 2
  
  return {
    height: eased,
    offset: fallDistance
  }
}

export function updateTerrainGeometry(
  positions: BufferAttribute | InterleavedBufferAttribute,
  offset: TerrainOffset,
  params: TerrainParams
) {
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i)
    const y = positions.getY(i)
    
    // Calculate distance from edges
    const distanceFromEdgeX = GEOMETRY_CONFIG.HALF_SIZE - Math.abs(x)
    const distanceFromEdgeY = GEOMETRY_CONFIG.HALF_SIZE - Math.abs(y)
    const minDistance = Math.min(distanceFromEdgeX, distanceFromEdgeY)
    
    // Calculate base terrain height
    const sampleX = (x + offset.x) * params.frequency
    const sampleY = (y + offset.y) * params.frequency
    let z = octaveNoise(sampleX, sampleY, params.octaves, params.persistence) * params.amplitude

    // Apply waterfall effect if within threshold
    if (minDistance < GEOMETRY_CONFIG.BOUNDARY_THRESHOLD) {
      const t = minDistance / GEOMETRY_CONFIG.BOUNDARY_THRESHOLD
      const { height, offset: vertexOffset } = createWaterfallCurve(t)
      
      z *= height
      z -= vertexOffset
    }

    positions.setZ(i, z)
  }

  positions.needsUpdate = true
}

export function sampleTerrainHeight(
  x: number, 
  y: number, 
  offset: TerrainOffset,
  params: TerrainParams
): number {
  const sampleX = (x + offset.x) * params.frequency
  const sampleY = (y + offset.y) * params.frequency
  
  return octaveNoise(
    sampleX,
    sampleY,
    params.octaves,
    params.persistence
  ) * params.amplitude
} 