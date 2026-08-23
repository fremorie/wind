import type { Vector3 } from 'three';

import { simplexNoise2d } from './simplexNoise';
import { terrainUniforms } from '../materials/terrainMaterial';
import {
    uBeachWidth,
    uCurvature,
    uLakeDepth,
    uLakeRadius,
    uPositionFrequency,
    uRoadAmplitude,
    uRoadFalloff,
    uRoadPeriod,
    uRoadWaviness,
    uRoadWidth,
    uSideRoadX,
    uStrength,
} from './constants';

function clamp(value: number, minVal: number, maxVal: number) {
    if (value < minVal) return minVal;
    if (value > maxVal) return maxVal;

    return value;
}

function smoothstep(edge0: number, edge1: number, x: number): number {
    const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
    return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

function mod(x: number, y: number): number {
    return x - y * Math.floor(x / y);
}

function getBaseElevation(x: number, z: number): number {
    let elevation = 0;
    elevation +=
        simplexNoise2d(x * uPositionFrequency, z * uPositionFrequency) / 2;

    const elevationSign = Math.sign(elevation);
    elevation = elevationSign * Math.pow(Math.abs(elevation), 2);
    elevation *= uStrength;

    return elevation;
}

function roadCenterZ(x: number): number {
    return (
        terrainUniforms.uRoadCenter.value.z +
        uRoadAmplitude * Math.sin(x * uRoadWaviness)
    );
}

function sideRoadCenterX(z: number): number {
    return uSideRoadX + Math.sin(z * uRoadWaviness * 0.5);
}

function getSideRoadMask(x: number, z: number) {
    const distanceToRoad = Math.abs(x - sideRoadCenterX(z));
    const roadMask =
        1 - smoothstep(uRoadWidth - uRoadFalloff, uRoadWidth, distanceToRoad);

    return roadMask;
}

function getRoadMask(x: number, z: number): number {
    const distanceToRoad = Math.abs(
        mod(z - roadCenterZ(x) + uRoadPeriod / 2, uRoadPeriod) -
            uRoadPeriod / 2,
    );
    let roadMask =
        1 - smoothstep(uRoadWidth - uRoadFalloff, uRoadWidth, distanceToRoad);

    const distToLake = Math.hypot(
        x - terrainUniforms.uLakeCenterX.value,
        z - terrainUniforms.uLakeCenterZ.value,
    );
    const grassLine = uLakeRadius + uBeachWidth;
    roadMask *= smoothstep(grassLine - 10, grassLine, distToLake);
    roadMask += getSideRoadMask(x, z);
    roadMask = clamp(roadMask, 0, 1);

    return roadMask;
}

function getRoadElevation(x: number): number {
    const roadFlatness = 0.1;
    return getBaseElevation(x, roadCenterZ(x)) * roadFlatness;
}

function getLakeDepth(x: number, z: number): number {
    const dist = Math.hypot(
        x - terrainUniforms.uLakeCenterX.value,
        z - terrainUniforms.uLakeCenterZ.value,
    );
    return uLakeDepth * (1 - smoothstep(0, uLakeRadius, dist));
}

export function getElevation(x: number, z: number): number {
    const elevation = mix(
        getBaseElevation(x, z),
        getRoadElevation(x),
        getRoadMask(x, z),
    );

    return elevation - getLakeDepth(x, z);
}

export function curveOffset(
    x: number,
    z: number,
    playerX: number,
    playerZ: number,
    curvature: number = uCurvature,
): number {
    const dx = x - playerX;
    const dz = z - playerZ;

    return (dx * dx + dz * dz) * curvature;
}

// Plants decorations on the ground
export function getSurfaceY(
    position: Vector3,
    playerPosition: Vector3,
): number {
    return (
        getElevation(position.x, position.z) -
        curveOffset(position.x, position.z, playerPosition.x, playerPosition.z)
    );
}
