import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';

import { Experience } from './Experience/Experience';
import './App.css';

function App() {
    return (
        <Canvas
            shadows
            camera={{
                fov: 45,
                near: 0.1,
                far: 200,
                position: [10, 15, 25],
            }}
        >
            <Experience />
            <Perf position="top-left" />
        </Canvas>
    );
}

export default App;
