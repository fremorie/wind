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
    CRANK_PIVOT,
    FRAME_POSITION,
    FRONT_WHEEL_OFFSET,
    MODEL_PATH,
    MODEL_SCALE,
    PEDAL_LEFT_OFFSET,
    PEDAL_RIGHT_OFFSET,
    REAR_WHEEL_POSITION,
    STEER_PIVOT,
} from './constants';
import { type BicycleGLTF } from './types';
import { useBicycleVisuals } from './useBicycleVisuals';
import { useVehicleController } from './useVehicleController';
import { useVehicleDrive } from './useVehicleDrive';
import { spawnPositionFor } from './utils';

type WheelProps = Pick<BicycleGLTF, 'nodes' | 'materials'> & {
    part: 'WheelFront' | 'WheelRear';
};

function Wheel({ nodes, materials, part }: WheelProps) {
    return (
        <>
            <mesh
                castShadow
                receiveShadow
                scale={MODEL_SCALE}
                geometry={nodes[`${part}_1`].geometry}
                material={materials.TireInner}
            />
            <mesh
                castShadow
                receiveShadow
                scale={MODEL_SCALE}
                geometry={nodes[`${part}_2`].geometry}
                material={materials.Tire}
            />
            <mesh
                castShadow
                receiveShadow
                scale={MODEL_SCALE}
                geometry={nodes[`${part}_3`].geometry}
                material={materials.Metal}
            />
        </>
    );
}

export function BicycleVehicle() {
    const { nodes, materials } = useGLTF(MODEL_PATH) as unknown as BicycleGLTF;

    const playerPosition = useGame((state) => state.playerPosition);

    const chassisRef = useRef<RapierRigidBody>(null);
    const chassisObjectRef = useRef<THREE.Object3D>(null);

    const controllerRef = useVehicleController(chassisRef);
    const steerAngle = useVehicleDrive(controllerRef, chassisRef);
    const {
        bikeRef,
        steeringRef,
        frontWheelRef,
        rearWheelRef,
        crankRef,
        pedalLeftRef,
        pedalRightRef,
        updateBicycleVisuals,
    } = useBicycleVisuals();

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
            updateBicycleVisuals(controller, steerAngle.current, delta);
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

            {/* the whole bike drops by the current suspension length */}
            <group ref={bikeRef}>
                <group position={FRAME_POSITION}>
                    <mesh
                        castShadow
                        receiveShadow
                        scale={MODEL_SCALE}
                        geometry={nodes.Frame_1.geometry}
                        material={materials.Handle}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        scale={MODEL_SCALE}
                        geometry={nodes.Frame_2.geometry}
                        material={materials.Rim}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        scale={MODEL_SCALE}
                        geometry={nodes.Frame_3.geometry}
                        material={materials.Metal}
                    />
                </group>

                <group ref={crankRef} position={CRANK_PIVOT}>
                    <mesh
                        castShadow
                        receiveShadow
                        scale={MODEL_SCALE}
                        geometry={nodes.Crank.geometry}
                        material={materials.Metal}
                    />

                    <group ref={pedalLeftRef} position={PEDAL_LEFT_OFFSET}>
                        <mesh
                            castShadow
                            receiveShadow
                            scale={MODEL_SCALE}
                            geometry={nodes.PedalLeft.geometry}
                            material={materials.Pedal}
                        />
                    </group>

                    <group ref={pedalRightRef} position={PEDAL_RIGHT_OFFSET}>
                        <mesh
                            castShadow
                            receiveShadow
                            scale={MODEL_SCALE}
                            geometry={nodes.PedalRight.geometry}
                            material={materials.Pedal}
                        />
                    </group>
                </group>

                {/* fork, stem and bar, with the front wheel hanging off them */}
                <group ref={steeringRef} position={STEER_PIVOT}>
                    <mesh
                        castShadow
                        receiveShadow
                        scale={MODEL_SCALE}
                        geometry={nodes.HandleBar_1.geometry}
                        material={materials.Handle}
                    />
                    <mesh
                        castShadow
                        receiveShadow
                        scale={MODEL_SCALE}
                        geometry={nodes.HandleBar_2.geometry}
                        material={materials.Rim}
                    />

                    <group ref={frontWheelRef} position={FRONT_WHEEL_OFFSET}>
                        <Wheel
                            nodes={nodes}
                            materials={materials}
                            part="WheelFront"
                        />
                    </group>
                </group>

                <group ref={rearWheelRef} position={REAR_WHEEL_POSITION}>
                    <Wheel
                        nodes={nodes}
                        materials={materials}
                        part="WheelRear"
                    />
                </group>
            </group>
        </RigidBody>
    );
}

useGLTF.preload(MODEL_PATH);
