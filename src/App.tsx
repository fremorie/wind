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
            <div style={{
                position: 'fixed',
                bottom: 16,
                left: 16,
                color: '#ffffff',
                fontFamily: 'sans-serif'
            }}>
                <a style={{color: '#ffffff'}} href="https://poly.pizza/m/5pBoRkAPQk6">Bicycle</a>&nbsp;
                by <a style={{color: '#ffffff'}} href="https://poly.pizza/u/Poly%20by%20Google">Poly by Google</a> <a style={{color: '#ffffff'}} href="https://creativecommons.org/licenses/by/3.0/">[CC-BY]</a>&nbsp;
                via <a style={{color: '#ffffff'}} href="https://poly.pizza/m/5pBoRkAPQk6">Poly Pizza</a>
            </div>
        </KeyboardControls>
    );
}

export default App;
