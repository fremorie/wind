import * as THREE from 'three';
import { type RefObject } from 'react';
import { type Camera } from '@react-three/fiber';

import { getElevation } from './elevation';

const PITCH_DELTA = 1;
const SPEED = 10;
const SPHERE_RADIUS = 1;

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

export function updateCamera(camera: Camera, playerPosition: THREE.Vector3) {
    camera.position.set(
        playerPosition.x - 20,
        playerPosition.y + 5,
        playerPosition.z - 1,
    );
    camera.lookAt(playerPosition);
}

export function updatePlayerPitch(
    playerMeshRef: RefObject<THREE.Mesh | null>,
    playerPosition: THREE.Vector3,
) {
    if (!playerMeshRef.current) return;

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

    const pitch = Math.atan2(ahead - behind, 2 * PITCH_DELTA);
    playerMeshRef.current.rotation.x = -pitch;
}

export function updatePlayerYaw(
    playerDirection: RefObject<THREE.Vector3 | null>,
    playerMeshRef: RefObject<THREE.Mesh | null>,
) {
    if (!playerMeshRef.current || !playerDirection.current) return;

    if (playerDirection.current.lengthSq() > 0) {
        const directionAngle = Math.atan2(
            playerDirection.current.x,
            playerDirection.current.z,
        );

        playerMeshRef.current.rotation.y = directionAngle;
    }
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
