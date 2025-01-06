import { Canvas } from '@react-three/fiber'


export const NoiseTerrainViewer = () => {
  return (
    <Canvas
      camera={{ position: [20, 20, 20], fov: 50 }}
    >
      <color attach="background" args={['#000000']} />
      {/* Our terrain mesh will go here */}
    </Canvas>
  )
}