import type { Vector3 } from 'three';

import { simplexNoise2d } from './simplexNoise';
import {
    GRID_TOTAL_WIDTH,
    LAKE_CENTER,
    uBeachWidth,
    uCurvature,
    uLakeDepth,
    uLakeRadius,
    uLakeSurfaceLevel,
    uPositionFrequency,
    uRoadAmplitude,
    uRoadFalloff,
    uRiverAmplitude,
    uRiverAngle,
    uRiverCenterZ,
    uRiverDepth,
    uRiverFalloff,
    uRiverPeriod,
    uRiverSurfaceLevel,
    uRiverWaviness,
    uRiverWidth,
    uRoadPeriod,
    uRoadWaviness,
    uRoadWidth,
    uSideRoadX,
    uStrength,
    uSideRoadPeriod,
} from './constants';

// The road centre and the lake position are plain world constants; every
// material builds its uRoadCenter/uLakeCenter* uniforms from these same two.
const ROAD_CENTER_Z = GRID_TOTAL_WIDTH / 2;
const [LAKE_CENTER_X, LAKE_CENTER_Z] = LAKE_CENTER;

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

function roadCenterZ(x: number, z: number): number {
    const roadAmplitude = uRoadAmplitude * (1 - getRiverMask(x, z));

    return ROAD_CENTER_Z + roadAmplitude * Math.sin(x * uRoadWaviness);
}

function sideRoadCenterX(z: number): number {
    return uSideRoadX + Math.sin(z * uRoadWaviness * 0.5);
}

function getSideRoadMask(x: number, z: number) {
    const distanceToRoad = Math.abs(
        mod(x - sideRoadCenterX(z) + uSideRoadPeriod / 2, uSideRoadPeriod) -
            uSideRoadPeriod / 2,
    );
    const roadMask =
        1 - smoothstep(uRoadWidth - uRoadFalloff, uRoadWidth, distanceToRoad);

    return roadMask;
}

function getRoadMask(x: number, z: number): number {
    const distanceToRoad = Math.abs(
        mod(z - roadCenterZ(x, z) + uRoadPeriod / 2, uRoadPeriod) -
            uRoadPeriod / 2,
    );
    let roadMask =
        1 - smoothstep(uRoadWidth - uRoadFalloff, uRoadWidth, distanceToRoad);

    const distToLake = Math.hypot(x - LAKE_CENTER_X, z - LAKE_CENTER_Z);
    const grassLine = uLakeRadius + uBeachWidth;
    roadMask *= smoothstep(grassLine - 10, grassLine, distToLake);
    roadMask += getSideRoadMask(x, z);
    roadMask = clamp(roadMask, 0, 1);

    return roadMask;
}

function getRoadElevation(x: number, z: number): number {
    const roadFlatness = 0.1;
    return getBaseElevation(x, roadCenterZ(x, z)) * roadFlatness;
}

function riverCenterZ(x: number): number {
    return uRiverCenterZ + uRiverAmplitude * Math.sin(x * uRiverWaviness);
}

function getRiverMask(x: number, z: number): number {
    const c = Math.cos(uRiverAngle);
    const s = Math.sin(uRiverAngle);
    const px = c * x + s * z;
    const pz = -s * x + c * z;

    const distanceToRiver = Math.abs(
        mod(pz - riverCenterZ(px) + uRiverPeriod / 2, uRiverPeriod) -
            uRiverPeriod / 2,
    );

    return (
        1 -
        smoothstep(uRiverWidth - uRiverFalloff, uRiverWidth, distanceToRiver)
    );
}

function getLakeDepth(x: number, z: number): number {
    const dist = Math.hypot(x - LAKE_CENTER_X, z - LAKE_CENTER_Z);
    return uLakeDepth * (1 - smoothstep(0, uLakeRadius, dist));
}

export function getElevation(x: number, z: number): number {
    const roadMask = getRoadMask(x, z);

    let elevation = mix(
        getBaseElevation(x, z),
        getRoadElevation(x, z),
        roadMask,
    );

    elevation -= getLakeDepth(x, z);

    const riverMask = getRiverMask(x, z);
    const riverMix = mix(0.0, riverMask, 1 - roadMask);

    return mix(elevation, uRiverDepth, riverMix);
}

// How deep the water is at (x, z), 0 on dry land. Matches the water shaders.
export function getWaterDepth(x: number, z: number): number {
    const distanceToLake = Math.hypot(x - LAKE_CENTER_X, z - LAKE_CENTER_Z);
    const surfaceLevel =
        distanceToLake < uLakeRadius ? uLakeSurfaceLevel : uRiverSurfaceLevel;

    return Math.max(0, surfaceLevel - getElevation(x, z));
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
