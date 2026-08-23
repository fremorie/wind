import { Sky, useHelper } from '@react-three/drei';
import {
    type ComponentRef,
    type RefObject,
    useEffect,
    useRef,
    useState,
} from 'react';
import { useFrame } from '@react-three/fiber';
import {
    CameraHelper,
    DirectionalLightHelper,
    type Camera,
    type DirectionalLight,
    type Object3D,
} from 'three';
import { folder, useControls } from 'leva';

import useGame from '../store/useGame';
import { useSkyControls } from './useSkyControls';
import { useDebug } from '../hooks/useDebug';

export function Environment() {
    const debug = useDebug();
    const lightRef = useRef<DirectionalLight>(null);
    const skyRef = useRef<ComponentRef<typeof Sky>>(null);
    const shadowCameraRef = useRef<Camera>(null);
    const [hasShadowCamera, setHasShadowCamera] = useState(false);

    const playerPosition = useGame((state) => state.playerPosition);
    const sky = useSkyControls();

    const { fogColor } = useControls({
        Fog: folder({
            fogColor: '#99a370',
        }),
    });

    useFrame(() => {
        if (!lightRef.current || !skyRef.current) return;

        // keep the light at a fixed offset above/beside the player...
        lightRef.current.position.set(
            playerPosition.x + sky.sunPosition[0],
            playerPosition.y + sky.sunPosition[1],
            playerPosition.z + sky.sunPosition[2],
        );
        // ...and aim its shadow box at the player
        lightRef.current.target.position.copy(playerPosition);
        lightRef.current.target.updateMatrixWorld();

        // Sky follows the player
        skyRef.current.position.copy(playerPosition);
    });

    useEffect(() => {
        if (!lightRef.current) return;

        shadowCameraRef.current = lightRef.current.shadow.camera;
        setHasShadowCamera(true);
    }, []);

    // The casts are needed because drei types useHelper's ref as
    // RefObject<Object3D>, which predates React 19 making .current nullable.
    useHelper(
        debug && (lightRef as RefObject<Object3D>),
        DirectionalLightHelper,
        1,
    );
    useHelper(
        debug && hasShadowCamera && (shadowCameraRef as RefObject<Object3D>),
        CameraHelper,
    );

    return (
        <>
            <Sky ref={skyRef} {...sky} />
            <directionalLight
                ref={lightRef}
                castShadow
                position={[1, 2, 3]}
                intensity={4.5}
                shadow-normalBias={0}
                shadow-camera-left={-5}
                shadow-camera-right={5}
                shadow-camera-top={5}
                shadow-camera-bottom={-4}
                shadow-camera-near={0}
                shadow-camera-far={15}
                shadow-radius={10}
                shadow-mapSize={[1024, 1024]}
            />
            <ambientLight intensity={1.5} />
            <fog attach="fog" args={[fogColor, 5, 250]} />
        </>
    );
}
