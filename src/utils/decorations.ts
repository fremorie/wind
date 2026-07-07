import * as THREE from 'three';

import { curveOffset, getElevation } from './elevation';

export function getWindTurbinePosition(
    position: THREE.Vector3,
    playerPosition: THREE.Vector3,
) {
    const baseElevation = getElevation(position.x, position.z);
    const offset = curveOffset(
        position.x,
        position.z,
        playerPosition.x,
        playerPosition.z,
    );

    return baseElevation - offset;
}
