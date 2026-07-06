import { useRef } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { type Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import useGame from '../../store/useGame';
import { getElevation } from '../../utils/elevation';
import { terrainMaterial } from '../../materials/terrainMaterial';
import { updatePlayerDirection } from '../../utils/player';
import { Bicycle } from '../Bicycle';

const SPEED = 10;
const SPHERE_RADIUS = 1;

export function Player() {
    const playerMeshRef = useRef<Mesh>(null);
    const [, getKeys] = useKeyboardControls();

    const playerPosition = useGame((state) => state.playerPosition);
    const playerDirection = useRef<THREE.Vector3>(null);

    // eslint-disable-next-line react-hooks/immutability
    useFrame((state, delta) => {
        if (!playerMeshRef.current) {
            return;
        }

        const { forward, backward, leftward, rightward } = getKeys();

        if (!playerDirection.current) {
            playerDirection.current = new THREE.Vector3(0, 0, 0);
        }

        updatePlayerDirection(playerDirection.current, {
            forward,
            backward,
            leftward,
            rightward,
        });

        // eslint-disable-next-line react-hooks/immutability
        playerPosition.x += playerDirection.current.x * SPEED * delta;
        playerPosition.z += playerDirection.current.z * SPEED * delta;
        playerPosition.y =
            getElevation(playerPosition.x, playerPosition.z) + SPHERE_RADIUS;
        playerMeshRef.current.position.copy(playerPosition);

        terrainMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );

        state.camera.position.set(
            playerPosition.x - 20,
            playerPosition.y + 5,
            playerPosition.z - 1,
        );
        state.camera.lookAt(playerPosition);
    });

    return (
        <group ref={playerMeshRef} position={playerPosition}>
            <Bicycle scale={0.005} rotation-y={Math.PI / 2} />
        </group>
    );
}
