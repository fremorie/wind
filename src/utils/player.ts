import * as THREE from 'three';

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
