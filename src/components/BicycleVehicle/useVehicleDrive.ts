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
    UPRIGHT_EPSILON,
} from './constants';
import { type VehicleController } from './types';
import { steerTowards } from './utils';

const FORWARD = new THREE.Vector3(1, 0, 0);
const WORLD_UP = new THREE.Vector3(0, 1, 0);

const chassisRotation = new THREE.Quaternion();
const chassisForward = new THREE.Vector3();
const uprightUp = new THREE.Vector3();
const uprightSide = new THREE.Vector3();
const uprightBasis = new THREE.Matrix4();
const uprightRotation = new THREE.Quaternion();
const chassisAngvel = new THREE.Vector3();

function chassisForwardOf(chassis: RapierRigidBody): THREE.Vector3 {
    const rotation = chassis.rotation();

    chassisRotation.set(rotation.x, rotation.y, rotation.z, rotation.w);

    return chassisForward.copy(FORWARD).applyQuaternion(chassisRotation);
}

/**
 * Roll is rotation about the chassis' own forward axis, so enabledRotations
 * cannot lock it - that only locks world axes, and locking Y there would take
 * the pitch away too. Forward is the one axis roll leaves alone, so rebuilding
 * the rotation around it keeps the pitch the hills give the bike and drops only
 * the sideways lean that would tip it over.
 */
function keepUpright(chassis: RapierRigidBody, forward: THREE.Vector3) {
    // world up with everything along forward removed: up at the current pitch
    uprightUp.copy(WORLD_UP).addScaledVector(forward, -WORLD_UP.dot(forward));

    // pointing straight up or down leaves no side to lean towards
    if (uprightUp.lengthSq() < UPRIGHT_EPSILON) {
        return;
    }

    uprightUp.normalize();
    uprightSide.crossVectors(forward, uprightUp);

    uprightBasis.makeBasis(forward, uprightUp, uprightSide);
    uprightRotation.setFromRotationMatrix(uprightBasis);
    chassis.setRotation(uprightRotation, true);

    // without this the cancelled lean keeps being fed back in next step
    const angvel = chassis.angvel();

    chassisAngvel.set(angvel.x, angvel.y, angvel.z);
    chassisAngvel.addScaledVector(forward, -chassisAngvel.dot(forward));
    chassis.setAngvel(chassisAngvel, true);
}

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

        const bikeForward = chassisForwardOf(chassis);

        keepUpright(chassis, bikeForward);

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
            steerTarget = steerTowards(
                Math.atan2(bikeForward.z, bikeForward.x),
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
