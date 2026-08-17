import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { KeyboardControls } from '@react-three/drei';
import { Leva } from 'leva';

import { Experience } from './Experience/Experience';
import { Joystick } from './components/Joystick';
import { useDebug } from './hooks/useDebug';
import './App.css';

function App() {
    const debug = useDebug();

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
            <Leva
                hidden={!debug}
                theme={{ sizes: { rootWidth: '350px' } }}
                collapsed
            />

            <Canvas
                shadows
                camera={{
                    fov: 45,
                    near: 0.1,
                    far: 2000,
                    position: [-15, 10, 39],
                }}
                flat
            >
                <Experience />

                {debug && <Perf position="top-left" />}
            </Canvas>

            <Joystick />
        </KeyboardControls>
    );
}

export default App;
