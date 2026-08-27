import { useRef } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import { type Mesh } from 'three';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

import useGame from '../../store/useGame';
import { terrainMaterial } from '../../materials/terrainMaterial';
import {
    CRANK_GEAR_RATIO,
    getSteerAngle,
    updateCamera,
    updatePlayerDirection,
    updatePlayerPitchAndYaw,
    updatePlayerPosition,
    updatePlayerSpeed,
    updateSteerAngle,
    updateWheelSpin,
} from '../../utils/player';
import { Bicycle } from '../Bicycle';
import { waterSurfaceMaterial } from '../../materials/waterSurfaceMaterial';
import { foliageUniforms } from '../../materials/foliage/foliageMaterials';

export function Player() {
    const playerMeshRef = useRef<Mesh>(null);
    const steeringRef = useRef<Mesh>(null);
    const frontWheelRef = useRef<Mesh>(null);
    const rearWheelRef = useRef<Mesh>(null);
    const crankRef = useRef<Mesh>(null);
    const leftPedalRef = useRef<Mesh>(null);
    const rightPedalRef = useRef<Mesh>(null);

    const [, getKeys] = useKeyboardControls();

    const playerPosition = useGame((state) => state.playerPosition);
    const joystick = useGame((state) => state.joystick);
    const playerDirection = useRef<THREE.Vector3>(null);

    useFrame((state, delta) => {
        if (
            !playerMeshRef.current ||
            !steeringRef.current ||
            !frontWheelRef.current ||
            !rearWheelRef.current ||
            !crankRef.current ||
            !leftPedalRef.current ||
            !rightPedalRef.current
        ) {
            return;
        }

        playerMeshRef.current.rotation.order = 'YXZ';

        const { forward, backward, leftward, rightward, sprint } = getKeys();

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

        updatePlayerSpeed(playerDirection, sprint, delta);
        const spin = updateWheelSpin(delta);
        frontWheelRef.current.rotation.z = spin;
        rearWheelRef.current.rotation.z = spin;

        const steerAngle = updateSteerAngle(
            getSteerAngle(playerDirection, playerMeshRef),
            delta,
        );
        steeringRef.current.rotation.y = steerAngle;

        updatePlayerPitchAndYaw(
            playerMeshRef,
            playerPosition,
            steerAngle,
            delta,
        );

        updatePlayerPosition(playerPosition, playerMeshRef, delta);

        const crankAngle = spin * CRANK_GEAR_RATIO;

        crankRef.current.rotation.z = crankAngle;
        leftPedalRef.current.rotation.z = -crankAngle;
        rightPedalRef.current.rotation.z = -crankAngle;

        terrainMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );

        waterSurfaceMaterial.uniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );

        foliageUniforms.uPlayerPosition.value.set(
            playerPosition.x,
            playerPosition.z,
        );

        updateCamera(state.camera, playerPosition, delta);
    });

    return (
        <group ref={playerMeshRef} position={playerPosition}>
            <Bicycle
                steeringRef={steeringRef}
                frontWheelRef={frontWheelRef}
                rearWheelRef={rearWheelRef}
                crankRef={crankRef}
                leftPedalRef={leftPedalRef}
                rightPedalRef={rightPedalRef}

                // Group props
                position-y={0.1}
                //position-z={1.669}
                scale={0.8}
                rotation-y={-Math.PI / 2}
            />
        </group>
    );
}
