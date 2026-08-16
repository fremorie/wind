import { useMemo, useRef, type RefObject } from 'react';
import { useKeyboardControls } from '@react-three/drei';
import {
    useBeforePhysicsStep,
    type RapierRigidBody,
} from '@react-three/rapier';
import * as THREE from 'three';

import useGame from '../../store/useGame';
import { updatePlayerDirection } from '../../utils/player';
import {
    BRAKE_FORCE,
    ENGINE_FORCE,
    FRONT_WHEELS,
    INPUT_DEADZONE,
    MAX_SPEED,
    PHYSICS_TIME_STEP,
    REAR_WHEELS,
    STEER_RESPONSE,
} from './constants';
import { type VehicleController } from './types';
import { steerTowards } from './utils';

const FORWARD = new THREE.Vector3(1, 0, 0);
const chassisRotation = new THREE.Quaternion();
const chassisForward = new THREE.Vector3();

export function useVehicleDrive(
    controllerRef: RefObject<VehicleController | null>,
    chassisRef: RefObject<RapierRigidBody | null>,
) {
    const [, getKeys] = useKeyboardControls();
    const joystick = useGame((state) => state.joystick);

    const playerDirection = useMemo(() => new THREE.Vector3(), []);
    const steerAngle = useRef(0);

    useBeforePhysicsStep(() => {
        const controller = controllerRef.current;
        const chassis = chassisRef.current;

        if (!controller || !chassis) {
            return;
        }

        const { forward, backward, leftward, rightward } = getKeys();

        updatePlayerDirection(
            playerDirection,
            { forward, backward, leftward, rightward },
            joystick,
        );

        const inputMagnitude = playerDirection.length();
        const throttling = inputMagnitude > INPUT_DEADZONE;

        let steerTarget = 0;

        if (throttling) {
            const rotation = chassis.rotation();

            chassisRotation.set(rotation.x, rotation.y, rotation.z, rotation.w);
            chassisForward.copy(FORWARD).applyQuaternion(chassisRotation);

            steerTarget = steerTowards(
                Math.atan2(chassisForward.z, chassisForward.x),
                Math.atan2(playerDirection.z, playerDirection.x),
            );
        }

        steerAngle.current +=
            (steerTarget - steerAngle.current) * STEER_RESPONSE;

        const velocity = chassis.linvel();
        const speed = Math.hypot(velocity.x, velocity.z);

        const engineForce =
            throttling && speed < MAX_SPEED
                ? (inputMagnitude * ENGINE_FORCE) / REAR_WHEELS.length
                : 0;

        for (const index of REAR_WHEELS) {
            controller.setWheelEngineForce(index, engineForce);
            controller.setWheelBrake(index, throttling ? 0 : BRAKE_FORCE);
        }

        for (const index of FRONT_WHEELS) {
            controller.setWheelSteering(index, steerAngle.current);
        }

        controller.updateVehicle(PHYSICS_TIME_STEP);
    });

    return steerAngle;
}
