import { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
    CuboidCollider,
    RigidBody,
    type RapierRigidBody,
} from '@react-three/rapier';
import * as THREE from 'three';

import useGame from '../../store/useGame';
import { updateCamera } from '../../utils/player';
import { updateWorldUniforms } from '../../utils/worldUniforms';
import {
    CHASSIS_ANGULAR_DAMPING,
    CHASSIS_HALF_EXTENTS,
    CHASSIS_LINEAR_DAMPING,
    CHASSIS_MASS_PROPERTIES,
    MODEL_PATH,
    MODEL_YAW,
} from './constants';
import { type BicycleGLTF } from './types';
import { useVehicleController } from './useVehicleController';
import { useVehicleDrive } from './useVehicleDrive';
import { useWheelVisuals } from './useWheelVisuals';
import { spawnPositionFor } from './utils';

export function BicycleVehicle() {
    const { nodes, materials } = useGLTF(MODEL_PATH) as unknown as BicycleGLTF;

    const playerPosition = useGame((state) => state.playerPosition);

    const chassisRef = useRef<RapierRigidBody>(null);
    const chassisObjectRef = useRef<THREE.Object3D>(null);

    const controllerRef = useVehicleController(chassisRef);
    const steerAngle = useVehicleDrive(controllerRef, chassisRef);
    const { frontWheelRef, rearWheelRef, updateWheelVisuals } =
        useWheelVisuals();

    const [spawn] = useState(() =>
        spawnPositionFor(playerPosition.x, playerPosition.z),
    );

    useFrame((state, delta) => {
        const chassis = chassisRef.current;

        if (!chassis) {
            return;
        }

        if (chassisObjectRef.current) {
            chassisObjectRef.current.getWorldPosition(playerPosition);
        } else {
            const { x, y, z } = chassis.translation();
            playerPosition.set(x, y, z);
        }

        updateWorldUniforms(playerPosition);
        updateCamera(state.camera, playerPosition, delta);

        const controller = controllerRef.current;

        if (controller) {
            updateWheelVisuals(controller, steerAngle.current, delta);
        }
    });

    return (
        <RigidBody
            ref={chassisRef}
            position={spawn}
            colliders={false}
            canSleep={false}
            linearDamping={CHASSIS_LINEAR_DAMPING}
            angularDamping={CHASSIS_ANGULAR_DAMPING}
        >
            <CuboidCollider
                args={CHASSIS_HALF_EXTENTS}
                massProperties={CHASSIS_MASS_PROPERTIES}
            />

            <object3D ref={chassisObjectRef} />

            <mesh
                castShadow
                receiveShadow
                geometry={nodes.Cube.geometry}
                material={nodes.Cube.material}
                rotation-y={MODEL_YAW}
            />

            <group ref={frontWheelRef}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.WheelFront.geometry}
                    material={materials.PlaceholderFront}
                    rotation-y={MODEL_YAW}
                />
            </group>

            <group ref={rearWheelRef}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.WheelRear.geometry}
                    material={materials.PlaceholderRear}
                    rotation-y={MODEL_YAW}
                />
            </group>
        </RigidBody>
    );
}

useGLTF.preload(MODEL_PATH);
