import { MutableRefObject } from 'react'
import { Group } from 'three'
import { ThreeElements } from '@react-three/fiber'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: ThreeElements['group']
      mesh: ThreeElements['mesh']
      color: ThreeElements['color']
    }
  }
}