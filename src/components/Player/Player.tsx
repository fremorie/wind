import { useRef } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { type Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import useGame from '../../store/useGame';
import { terrainMaterial } from '../../materials/terrainMaterial';
import {
    updateCamera,
    updatePlayerDirection,
    updatePlayerPitchAndYaw,
    updatePlayerPosition,
} from '../../utils/player';
import { Bicycle } from '../Bicycle';

export function Player() {
    const playerMeshRef = useRef<Mesh>(null);
    const [, getKeys] = useKeyboardControls();

    const playerPosition = useGame((state) => state.playerPosition);
    const playerDirection = useRef<THREE.Vector3>(null);

    useFrame((state, delta) => {
        if (!playerMeshRef.current) {
            return;
        }

        playerMeshRef.current.rotation.order = 'YXZ';

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

        updatePlayerPosition(
            playerPosition,
            playerDirection,
            playerMeshRef,
            delta,
        );

        updatePlayerPitchAndYaw(
            playerDirection,
            playerMeshRef,
            playerPosition,
            delta,
        );

        terrainMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );

        updateCamera(state.camera, playerPosition, delta);
    });

    return (
        <group ref={playerMeshRef} position={playerPosition}>
            <Bicycle scale={0.005} position-y={0.2} />
        </group>
    );
}
