import * as THREE from 'three';
import { type RefObject } from 'react';
import { type Camera } from '@react-three/fiber';

import { getElevation } from './elevation';

const PITCH_DELTA = 1;
const SPEED = 20;
const JOYSTICK_DEADZONE = 0.15;

const WHEELBASE = 4.191 * 0.8; // front axle to rear axle, times the <Bicycle> scale
let currentYaw = 0;

const MAX_STEER = 0.5;
const STEER_GAIN = 1.5;

const SPHERE_RADIUS = 1;

const UP = new THREE.Vector3(0, 1, 0);
const RIGHT = new THREE.Vector3(1, 0, 0);

const yawQuaternion = new THREE.Quaternion();
const pitchQuaternion = new THREE.Quaternion();

// Camera
const cameraTargetPosition = new THREE.Vector3(0, 0, 0);
const CAMERA_STIFFNESS = 10;

export function updatePlayerDirection(
    playerDirection: THREE.Vector3,
    keys: {
        forward: boolean;
        backward: boolean;
        leftward: boolean;
        rightward: boolean;
    },
    joystick: THREE.Vector2,
) {
    let xDirection: number;
    let zDirection: number;

    const tilt = joystick.length();

    if (tilt > JOYSTICK_DEADZONE) {
        // Rescale [deadzone, 1] onto [0, 1] so the bike pulls away from a
        // standstill instead of jumping to deadzone speed. Dividing by tilt
        // turns the factor into a per-component scale.
        const scale =
            Math.min((tilt - JOYSTICK_DEADZONE) / (1 - JOYSTICK_DEADZONE), 1) /
            tilt;

        xDirection = joystick.y * scale;
        zDirection = joystick.x * scale;
    } else {
        xDirection = (keys.forward ? 1 : 0) + (keys.backward ? -1 : 0);
        zDirection = (keys.rightward ? 1 : 0) + (keys.leftward ? -1 : 0);
    }

    playerDirection.set(xDirection, 0, zDirection);

    // Keys give a length of 1 or sqrt(2), so this still normalizes them the way
    // it always did. The stick stays analog: shorter vector, slower ride.
    if (playerDirection.lengthSq() > 1) {
        playerDirection.normalize();
    }
}

export function updateCamera(
    camera: Camera,
    playerPosition: THREE.Vector3,
    delta: number,
) {
    const margin = 2;
    const groundAtCamera =
        getElevation(camera.position.x, camera.position.z) + margin;
    const desiredCameraY = playerPosition.y + 8;

    const cameraY = Math.max(desiredCameraY, groundAtCamera);

    cameraTargetPosition.set(
        playerPosition.x - 20,
        cameraY,
        playerPosition.z - 1,
    );

    camera.position.lerp(
        cameraTargetPosition,
        1 - Math.exp(-CAMERA_STIFFNESS * delta),
    );
    camera.lookAt(playerPosition);
}

export function updatePlayerPosition(
    playerPosition: THREE.Vector3,
    playerDirection: RefObject<THREE.Vector3 | null>,
    playerMeshRef: RefObject<THREE.Mesh | null>,
    delta: number,
) {
    if (!playerMeshRef.current || !playerDirection.current) return;

    const yaw = playerMeshRef.current.rotation.y;
    const speed = playerDirection.current.length() * SPEED;

    playerPosition.x += Math.sin(yaw) * speed * delta;
    playerPosition.z += Math.cos(yaw) * speed * delta;

    playerPosition.y =
        getElevation(playerPosition.x, playerPosition.z) + SPHERE_RADIUS;
    playerMeshRef.current.position.copy(playerPosition);
}

export function getPlayerDirectionAngle(
    playerDirection: RefObject<THREE.Vector3 | null>,
    playerMeshRef: RefObject<THREE.Mesh | null>,
) {
    if (!playerMeshRef.current) return 0;

    if (playerDirection.current && playerDirection.current.lengthSq() > 0) {
        return Math.atan2(playerDirection.current.x, playerDirection.current.z);
    }

    return playerMeshRef.current.rotation.y;
}

export function getPlayerPitch(
    playerMeshRef: RefObject<THREE.Mesh | null>,
    playerPosition: THREE.Vector3,
) {
    if (!playerMeshRef.current) return 0;

    const forwardX = Math.sin(playerMeshRef.current.rotation.y);
    const forwardZ = Math.cos(playerMeshRef.current.rotation.y);

    const ahead = getElevation(
        playerPosition.x + forwardX * PITCH_DELTA,
        playerPosition.z + forwardZ * PITCH_DELTA,
    );

    const behind = getElevation(
        playerPosition.x - forwardX * PITCH_DELTA,
        playerPosition.z - forwardZ * PITCH_DELTA,
    );

    return -Math.atan2(ahead - behind, 2 * PITCH_DELTA);
}

export function updatePlayerPitchAndYaw(
    playerDirection: RefObject<THREE.Vector3 | null>,
    playerMeshRef: RefObject<THREE.Mesh | null>,
    playerPosition: THREE.Vector3,
    steerAngle: number,
    delta: number,
) {
    if (!playerMeshRef.current || !playerDirection.current) return;

    const pitch = getPlayerPitch(playerMeshRef, playerPosition);

    const speed = playerDirection.current.length() * SPEED;
    currentYaw += ((speed * Math.tan(steerAngle)) / WHEELBASE) * delta;
    yawQuaternion.setFromAxisAngle(UP, currentYaw);

    pitchQuaternion.setFromAxisAngle(RIGHT, pitch);

    playerMeshRef.current.quaternion.multiplyQuaternions(
        yawQuaternion,
        pitchQuaternion,
    );
}

export function getSteerAngle(
    playerDirection: RefObject<THREE.Vector3 | null>,
    playerMeshRef: RefObject<THREE.Mesh | null>,
) {
    if (!playerMeshRef.current) return 0;

    const targetSteerAngle = getPlayerDirectionAngle(
        playerDirection,
        playerMeshRef,
    );
    const currentSteerAngle = playerMeshRef.current.rotation.y;
    const difference = targetSteerAngle - currentSteerAngle;

    // [-PI, PI]
    const error = Math.atan2(Math.sin(difference), Math.cos(difference));

    return THREE.MathUtils.clamp(error * STEER_GAIN, -MAX_STEER, MAX_STEER);
}
