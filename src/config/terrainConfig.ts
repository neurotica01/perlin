import { TerrainParamsConfig } from '../types'

export const TERRAIN_PARAMS_CONFIG: TerrainParamsConfig = {
  octaves: {
    min: 1,
    max: 8,
    step: 1,
    default: 6
  },
  persistence: {
    min: 0.1,
    max: 1.0,
    step: 0.05,
    default: 0.65
  },
  amplitude: {
    min: 0.1,
    max: 100,
    step: 0.1,
    default: 40.1
  },
  frequency: {
    min: 0.1,
    max: 2.0,
    step: 0.1,
    default: 0.8
  },
  speed: {
    min: 0,
    max: 5.0,
    step: 0.1,
    default: 2.5
  }
} 