import { useEffect, useMemo, useRef } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { type Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

import { getPlayerInitialPosition } from '../Terrain/utils';
import useGame from '../../store/useGame';

const SPEED = 5;

export function Player() {
    const playerMeshRef = useRef<Mesh>(null);
    const initialPosition = useMemo(() => getPlayerInitialPosition(), []);
    const [subscribeKeys] = useKeyboardControls();

    const moveForward = useGame((state) => state.moveForward);
    const stop = useGame((state) => state.stop);
    const isMovingForward = useGame((state) => state.isMovingForward);

    useEffect(() => {
        const unsubscribeMoveForward = subscribeKeys(
            (state) => state.forward,
            (value) => {
                if (value) {
                    console.log('Moving forward');
                    moveForward();
                } else {
                    console.log('Stopping');
                    stop();
                }
            },
        );

        return () => unsubscribeMoveForward();
    }, [moveForward, stop, subscribeKeys]);

    useFrame((state, delta) => {
        if (!playerMeshRef.current) {
            return;
        }

        if (isMovingForward) {
            playerMeshRef.current.position.x += SPEED * delta;
        }

        state.camera.position.x = playerMeshRef.current.position.x - 20;
        state.camera.lookAt(playerMeshRef.current.position);
    });

    return (
        <mesh ref={playerMeshRef} position={initialPosition}>
            <sphereGeometry />
            <meshBasicMaterial color="mediumpurple" />
        </mesh>
    );
}
