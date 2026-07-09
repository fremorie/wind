import { Sky } from '@react-three/drei';
import { type ComponentRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { type DirectionalLight } from 'three';
// import { folder, useControls } from 'leva';

import useGame from '../store/useGame';
import { useSkyControls } from './useSkyControls';

export function Environment() {
    const lightRef = useRef<DirectionalLight>(null);
    const skyRef = useRef<ComponentRef<typeof Sky>>(null);

    const playerPosition = useGame((state) => state.playerPosition);
    const sky = useSkyControls();

    // const { fogColor } = useControls({
    //     Fog: folder({
    //         fogColor: '#bed6e3',
    //     }),
    // });

    useFrame(() => {
        if (!lightRef.current || !skyRef.current) return;

        // keep the light at a fixed offset above/beside the player...
        lightRef.current.position.set(
            playerPosition.x + 1,
            playerPosition.y + 2,
            playerPosition.z + 3,
        );
        // ...and aim its shadow box at the player
        lightRef.current.target.position.copy(playerPosition);
        lightRef.current.target.updateMatrixWorld();

        // Sky follows the player
        skyRef.current.position.copy(playerPosition);
    });

    return (
        <>
            <Sky ref={skyRef} {...sky} />
            <directionalLight
                ref={lightRef}
                castShadow
                position={[1, 2, 3]}
                intensity={4.5}
                shadow-normalBias={0.04}
                shadow-camera-left={-15}
                shadow-camera-right={15}
                shadow-camera-top={15}
                shadow-camera-bottom={-15}
                shadow-camera-near={-20}
                shadow-camera-far={20}
                shadow-radius={10}
                shadow-mapSize={[2048, 2048]}
            />
            <ambientLight intensity={1.5} />
            {/*<fog attach="fog" args={[fogColor, 20, 150]} />*/}
        </>
    );
}
