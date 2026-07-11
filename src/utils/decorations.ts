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

export function getWindTurbineInstancesParams(count: number, windFarmRadius: number) {
    const result = [];
    const spread = (Math.PI * 60) / 180;

    for (let i = 0; i < count; i++) {
        const angle = (i / (count - 1)) * spread - spread / 2;

        result.push({
            key: `turbine-${i}`,
            x: windFarmRadius * Math.cos(angle),
            z: windFarmRadius * Math.sin(angle),
            yaw: 1,
            phase: Math.random() * i,
            speed: 0.4,
            scale: 7,
        });
    }
    return result;
}
