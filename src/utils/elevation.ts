import { simplexNoise2d } from './simplexNoise';
import { terrainUniforms } from '../materials/terrainMaterial';
import {
    CURVATURE,
    uBeachWidth,
    uLakeDepth,
    uLakeRadius,
    uPositionFrequency,
    uRoadAmplitude,
    uRoadFalloff,
    uRoadWaviness,
    uRoadWidth,
    uStrength,
} from './constants';

function smoothstep(edge0: number, edge1: number, x: number): number {
    const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
    return t * t * (3 - 2 * t);
}

function mix(a: number, b: number, t: number): number {
    return a + (b - a) * t;
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

function getRoadMask(x: number, z: number): number {
    const distanceToRoad = Math.abs(z - roadCenterZ(x));
    let roadMask =
        1 - smoothstep(uRoadWidth - uRoadFalloff, uRoadWidth, distanceToRoad);

    const distToLake = Math.hypot(
        x - terrainUniforms.uLakeCenterX.value,
        z - terrainUniforms.uLakeCenterZ.value,
    );
    const grassLine = uLakeRadius + uBeachWidth;
    roadMask *= smoothstep(grassLine - 10, grassLine, distToLake);

    return roadMask;
}

function getRoadElevation(x: number): number {
    return getBaseElevation(x, roadCenterZ(x));
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
    curvature: number = CURVATURE,
): number {
    const dx = x - playerX;
    const dz = z - playerZ;

    return (dx * dx + dz * dz) * curvature;
}
