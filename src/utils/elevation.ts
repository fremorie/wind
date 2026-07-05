import { simplexNoise2d } from './simplexNoise';
import { terrainUniforms } from '../materials/terrainMaterial';

export function getElevation(x: number, z: number): number {
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
