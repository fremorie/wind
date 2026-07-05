import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { KeyboardControls } from '@react-three/drei';

import { Experience } from './Experience/Experience';
import './App.css';

function App() {
    return (
        <KeyboardControls
            map={[
                { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
                { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
                { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
                { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
                { name: 'jump', keys: ['Space'] },
            ]}
        >
            <Canvas
                shadows
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 2000,
                    position: [-15, 10, 39],
                }}
            >
                <Experience />
                <Perf position="top-left" />
            </Canvas>
        </KeyboardControls>
    );
}

export default App;
