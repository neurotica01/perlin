import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { NoiseTerrainMesh } from './NoiseTerrainMesh'
import { TerrainParams } from '../types'
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'

interface NoiseTerrainViewerProps {
  params: TerrainParams
}

// const CameraRig = () => {
//   const cameraRef = useRef<THREE.PerspectiveCamera>(null)
//   const angle = useRef(0)
  
//   useFrame((_, delta) => {
//     if (!cameraRef.current) return
    
//     // Update angle (0.1 radians per second)
//     angle.current += delta * 0.05
    
//     // Calculate new camera position in the x-y plane according to the custom basis
//     const radius = 100 // Distance from center
//     const x = Math.cos(angle.current) * radius * (-1/Math.sqrt(2))
//     const y = Math.sin(angle.current) * radius * (-1/Math.sqrt(2))
//     // const z = Math.cos(angle.current) * radius * (1/Math.sqrt(2))
    
//     // Update camera position
//     cameraRef.current.position.set(x, 55, y)
//     cameraRef.current.lookAt(0, 0, 0)
//   })

//   return <PerspectiveCamera ref={cameraRef} makeDefault position={[50, 30, 50]} fov={50} />
// }

export const NoiseTerrainViewer = ({ params }: NoiseTerrainViewerProps) => {
  return (
    <Canvas>
      <color attach="background" args={['#000000']} />
      {/* <CameraRig /> */}
      <PerspectiveCamera 
        makeDefault 
        position={[50, 55, 50]} 
        fov={75}
      />
      <OrbitControls
        position={[50, 55, 50]} 
        target={[0, 0, 0]}
        maxPolarAngle={Math.PI / 2.1} // Prevent going below the ground
        makeDefault
      />
      <NoiseTerrainMesh params={params} />
    </Canvas>
  )
}