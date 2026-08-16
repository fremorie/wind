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
import { waterSurfaceMaterial } from '../../materials/waterSurfaceMaterial';
import { treeMaterial } from '../../materials/treeMaterial';
import { bushMaterial } from '../../materials/bushMaterial';
import { foliageUniforms } from '../../materials/foliage/foliageMaterials';
import { farmUniforms } from '../../materials/farmMaterial';

export function DebugPlayer() {
    const playerMeshRef = useRef<Mesh>(null);
    const [, getKeys] = useKeyboardControls();

    const playerPosition = useGame((state) => state.playerPosition);
    const joystick = useGame((state) => state.joystick);
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

        updatePlayerDirection(
            playerDirection.current,
            {
                forward,
                backward,
                leftward,
                rightward,
            },
            joystick,
        );

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

        waterSurfaceMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );

        treeMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );

        bushMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );

        foliageUniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );

        farmUniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );

        updateCamera(state.camera, playerPosition, delta);
    });

    return (
        <group ref={playerMeshRef} position={playerPosition}>
            <mesh castShadow receiveShadow>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
        </group>
    );
}
