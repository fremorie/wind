import { simplexNoise2d } from './simplexNoise';
import { terrainUniforms } from '../materials/terrainMaterial';
import { CURVATURE } from './constants';

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
        simplexNoise2d(
            x * terrainUniforms.uPositionFrequency.value,
            z * terrainUniforms.uPositionFrequency.value,
        ) / 2;

    const elevationSign = Math.sign(elevation);
    elevation = elevationSign * Math.pow(Math.abs(elevation), 2);
    elevation *= terrainUniforms.uStrength.value;

    return elevation;
}

function roadCenterZ(x: number): number {
    return (
        terrainUniforms.uRoadCenter.value.z +
        terrainUniforms.uRoadAmplitude.value *
            Math.sin(x * terrainUniforms.uRoadWaviness.value)
    );
}

function getRoadMask(x: number, z: number): number {
    const distanceToRoad = Math.abs(z - roadCenterZ(x));
    return (
        1 -
        smoothstep(
            terrainUniforms.uRoadWidth.value -
                terrainUniforms.uRoadFalloff.value,
            terrainUniforms.uRoadWidth.value,
            distanceToRoad,
        )
    );
}

function getRoadElevation(x: number): number {
    return getBaseElevation(x, roadCenterZ(x));
}

export function getElevation(x: number, z: number): number {
    return mix(getBaseElevation(x, z), getRoadElevation(x), getRoadMask(x, z));
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
