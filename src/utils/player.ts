import * as THREE from 'three';
import { type RefObject } from 'react';
import { type Camera } from '@react-three/fiber';

import { getElevation } from './elevation';

const PITCH_DELTA = 1;
const SPEED = 30;
const SPHERE_RADIUS = 1;
const STIFFNESS = 10;

const UP = new THREE.Vector3(0, 1, 0);
const RIGHT = new THREE.Vector3(1, 0, 0);

const yawQuaternion = new THREE.Quaternion();
const targetYawQuaternion = new THREE.Quaternion();
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
) {
    const xDirection = (keys.forward ? 1 : 0) + (keys.backward ? -1 : 0);
    const zDirection = (keys.rightward ? 1 : 0) + (keys.leftward ? -1 : 0);

    playerDirection.set(xDirection, 0, zDirection).normalize();
}

export function updateCamera(
    camera: Camera,
    playerPosition: THREE.Vector3,
    delta: number,
) {
    const margin = 2;
    const groundAtCamera =
        getElevation(camera.position.x, camera.position.z) + margin;
    const desiredCameraY = playerPosition.y + 7;

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

    playerPosition.x += playerDirection.current.x * SPEED * delta;
    playerPosition.z += playerDirection.current.z * SPEED * delta;
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
    delta: number,
) {
    if (!playerMeshRef.current) return;

    const yaw = getPlayerDirectionAngle(playerDirection, playerMeshRef);
    const pitch = getPlayerPitch(playerMeshRef, playerPosition);

    targetYawQuaternion.setFromAxisAngle(UP, yaw);
    const t = 1 - Math.exp(-STIFFNESS * delta);
    yawQuaternion.slerp(targetYawQuaternion, t);

    pitchQuaternion.setFromAxisAngle(RIGHT, pitch);

    playerMeshRef.current.quaternion.multiplyQuaternions(
        yawQuaternion,
        pitchQuaternion,
    );
}
