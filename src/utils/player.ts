import * as THREE from 'three';
import { type Camera } from '@react-three/fiber';

import { getElevation } from './elevation';

const JOYSTICK_DEADZONE = 0.15;

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
