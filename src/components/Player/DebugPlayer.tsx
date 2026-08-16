import { useRef, useState } from 'react';
import { RigidBody, type RapierRigidBody } from '@react-three/rapier';
import { useKeyboardControls } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import useGame from '../../store/useGame';
import { terrainMaterial } from '../../materials/terrainMaterial';
import { updateCamera, updatePlayerDirection } from '../../utils/player';
import { waterSurfaceMaterial } from '../../materials/waterSurfaceMaterial';
import { treeMaterial } from '../../materials/treeMaterial';
import { bushMaterial } from '../../materials/bushMaterial';
import { foliageUniforms } from '../../materials/foliage/foliageMaterials';
import { farmUniforms } from '../../materials/farmMaterial';

const TORQUE_STRENGTH = 50;
const IMPULSE_STRENGTH = 10;

export function DebugPlayer() {
    const [, getKeys] = useKeyboardControls();

    const playerPosition = useGame((state) => state.playerPosition);
    const joystick = useGame((state) => state.joystick);
    const playerDirection = useRef<THREE.Vector3>(null);

    const playerBodyRef = useRef<RapierRigidBody>(null);

    const [spawnPosition] = useState<[number, number, number]>(() => [
        playerPosition.x,
        10,
        playerPosition.z,
    ]);

    useFrame((state, delta) => {
        const body = playerBodyRef.current;
        if (!body) {
            return;
        }

        const { forward, backward, leftward, rightward } = getKeys();

        if (!playerDirection.current) {
            playerDirection.current = new THREE.Vector3(0, 0, 0);
        }

        updatePlayerDirection(
            playerDirection.current,
            { forward, backward, leftward, rightward },
            joystick,
        );

        const direction = playerDirection.current;

        body.applyTorqueImpulse(
            {
                x: direction.z * TORQUE_STRENGTH * delta,
                y: 0,
                z: -direction.x * TORQUE_STRENGTH * delta,
            },
            true,
        );

        body.applyImpulse(
            {
                x: direction.x * IMPULSE_STRENGTH * delta,
                y: 0,
                z: direction.z * IMPULSE_STRENGTH * delta,
            },
            true,
        );

        const { x, y, z } = body.translation();
        playerPosition.set(x, y, z);

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
        <RigidBody
            ref={playerBodyRef}
            linearDamping={0.5}
            angularDamping={0.5}
            canSleep={false}
            colliders="ball"
            position={spawnPosition}
            restitution={0.2}
            friction={1}
        >
            <mesh castShadow receiveShadow>
                <icosahedronGeometry args={[1, 1]} />
                <meshStandardMaterial color="mediumpurple" />
            </mesh>
        </RigidBody>
    );
}
