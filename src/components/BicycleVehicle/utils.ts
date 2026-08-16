import * as THREE from 'three';

import { getElevation } from '../../utils/elevation';
import {
    MAX_STEER,
    SPAWN_CLEARANCE,
    STEER_GAIN,
    SUSPENSION_REST_LENGTH,
    WHEEL_RADIUS,
} from './constants';

export function wrapAngle(angle: number): number {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
}

export function suspensionDampingFor(stiffness: number): number {
    return 2 * Math.sqrt(stiffness);
}

export function smoothTowards(
    current: number,
    target: number,
    rate: number,
    delta: number,
): number {
    return current + (target - current) * (1 - Math.exp(-rate * delta));
}

export function steerTowards(currentYaw: number, desiredYaw: number): number {
    return THREE.MathUtils.clamp(
        -wrapAngle(desiredYaw - currentYaw) * STEER_GAIN,
        -MAX_STEER,
        MAX_STEER,
    );
}

export function spawnPositionFor(
    x: number,
    z: number,
): [number, number, number] {
    return [
        x,
        getElevation(x, z) +
            SUSPENSION_REST_LENGTH +
            WHEEL_RADIUS +
            SPAWN_CLEARANCE,
        z,
    ];
}
