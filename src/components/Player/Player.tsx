import { useEffect, useRef } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { type Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

import useGame from '../../store/useGame';
import { getElevation } from '../../utils/elevation';

const SPEED = 5;
const SPHERE_RADIUS = 1;

export function Player() {
    const playerMeshRef = useRef<Mesh>(null);
    const [subscribeKeys] = useKeyboardControls();

    const playerPosition = useGame((state) => state.playerPosition);
    const moveForward = useGame((state) => state.moveForward);
    const stop = useGame((state) => state.stop);
    const isMovingForward = useGame((state) => state.isMovingForward);

    useEffect(() => {
        const unsubscribeMoveForward = subscribeKeys(
            (state) => state.forward,
            (value) => {
                if (value) {
                    moveForward();
                } else {
                    stop();
                }
            },
        );

        return () => unsubscribeMoveForward();
    }, [moveForward, stop, subscribeKeys]);

    // eslint-disable-next-line react-hooks/immutability
    useFrame((state, delta) => {
        if (!playerMeshRef.current) {
            return;
        }

        if (isMovingForward) {
            // eslint-disable-next-line react-hooks/immutability
            playerPosition.x += SPEED * delta;
            playerPosition.y =
                getElevation(playerPosition.x, playerPosition.z) +
                SPHERE_RADIUS;
            playerMeshRef.current.position.copy(playerPosition);
        }

        state.camera.position.set(
            playerPosition.x - 20,
            playerPosition.y + 5,
            playerPosition.z - 1,
        );
        state.camera.lookAt(playerPosition);
    });

    return (
        <mesh ref={playerMeshRef} position={playerPosition} castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="mediumpurple" />
        </mesh>
    );
}
