import { Canvas } from '@react-three/fiber'

import { Experience } from './Experience/Experience'
import './App.css'

function App() {
  return (
      <Canvas
          shadows
          camera={ {
              fov: 45,
              near: 0.1,
              far: 200,
              position: [ - 8, 8, 10 ]
          } }
      >
          <Experience />
      </Canvas>
  )
}

export default App
