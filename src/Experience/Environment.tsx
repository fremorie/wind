import { Sky /* useHelper */ } from '@react-three/drei';
import { type ComponentRef, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { type DirectionalLight } from 'three';
// import * as THREE from 'three';
// import { folder, useControls } from 'leva';

import useGame from '../store/useGame';
import { useSkyControls } from './useSkyControls';
import { CHUNK_SIZE } from '../utils/constants';

export function Environment() {
    const lightRef = useRef<DirectionalLight>(null);
    const skyRef = useRef<ComponentRef<typeof Sky>>(null);
    //const [shadowCamera, setShadowCamera] = useState(null)

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

    // useHelper(
    //     lightRef,
    //     THREE.DirectionalLightHelper,
    //     1
    // )
    //
    // useHelper(
    //     shadowCamera ? { current: shadowCamera } : null,
    //     THREE.CameraHelper
    // )
    //
    // useEffect(() => {
    //     if (lightRef.current) {
    //         setShadowCamera(lightRef.current.shadow.camera)
    //     }
    // }, [])

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
                shadow-camera-right={CHUNK_SIZE * 2}
                shadow-camera-top={15}
                shadow-camera-bottom={-CHUNK_SIZE * 2}
                shadow-camera-near={-CHUNK_SIZE * 2}
                shadow-camera-far={CHUNK_SIZE}
                shadow-radius={10}
                shadow-mapSize={[2048 * 2, 2048 * 2]}
            />
            <ambientLight intensity={1.5} />
            {/*<fog attach="fog" args={[fogColor, 20, 150]} />*/}
        </>
    );
}
