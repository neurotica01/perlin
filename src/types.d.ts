import { MutableRefObject } from 'react'
import { Group } from 'three'
import { ThreeElements } from '@react-three/fiber'

export interface TerrainParamConfig {
  min: number
  max: number
  step: number
  default: number
}

export interface TerrainParamsConfig {
  octaves: TerrainParamConfig
  persistence: TerrainParamConfig
  amplitude: TerrainParamConfig
  frequency: TerrainParamConfig
  speed: TerrainParamConfig
}

export interface TerrainParams {
  octaves: number
  persistence: number
  amplitude: number
  frequency: number
  speed: number
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ThreeElements['group']
      mesh: ThreeElements['mesh']
      color: ThreeElements['color']
    }
  }
}