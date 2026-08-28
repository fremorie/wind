import { Suspense, useCallback, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { KeyboardControls, Preload } from '@react-three/drei';
import { Leva } from 'leva';

import { Experience } from './Experience/Experience';
import { Joystick } from './components/Joystick';
import { LoadingOverlay, SceneReady, StartScreen } from './components/Intro';
import { Menu } from './components/Menu';
import { useCrossfadeLoop } from './hooks/useCrossfadeLoop';
import { useSwellLoop } from './hooks/useSwellLoop';
import { useDebug } from './hooks/useDebug';
import useGame from './store/useGame';
import './App.css';

const SOUNDTRACK_URL = './sounds/soundtrack/soundtrack.mp3';
const BIRDS_URL = './sounds/birds/birds.mp3';

function App() {
    const debug = useDebug();

    const startMusic = useCrossfadeLoop({
        url: SOUNDTRACK_URL,
        volume: 0.3,
        crossfadeDuration: 4,
    });

    const startBirds = useSwellLoop({
        url: BIRDS_URL,
        volume: 0.35,
        swellDuration: 20,
    });

    const start = useGame((state) => state.start);
    const hasStarted = useGame((state) => state.hasStarted);

    const [isSceneReady, setIsSceneReady] = useState(false);
    const handleSceneReady = useCallback(() => setIsSceneReady(true), []);

    return (
        <KeyboardControls
            map={[
                { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
                { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
                { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
                { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
                { name: 'sprint', keys: ['ShiftLeft', 'ShiftRight'] },
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
                <Suspense fallback={null}>
                    <Experience />
                    <Preload all />

                    <SceneReady onReady={handleSceneReady} />
                </Suspense>

                {debug && <Perf position="bottom-left" />}
            </Canvas>

            <LoadingOverlay isReady={isSceneReady} />

            <StartScreen
                isReady={isSceneReady}
                onStart={(isAudioEnabled) => {
                    start(isAudioEnabled);
                    if (isAudioEnabled) {
                        startMusic();
                        startBirds();
                    }
                }}
            />

            {hasStarted && (
                <>
                    <Joystick />
                    <Menu />
                </>
            )}
        </KeyboardControls>
    );
}

export default App;
