import { useEffect } from 'react';
import { folder, useControls } from 'leva';
import type { Color } from 'three';

import { terrainUniforms } from '../../materials/terrainMaterial';

const hex = (color: Color) => `#${color.getHexString()}`;

/**
 * Leva panel bound to the shared terrain material uniforms. Values flow through
 * React state and are pushed onto the uniforms in an effect — mutating the
 * imported uniforms directly in the control callbacks isn't allowed by the
 * React Compiler lint rule.
 */
export function useTerrainControls() {
    const {
        uPositionFrequency,
        uStrength,
        uWarpFrequency,
        uWarpStrength,
        uColorWaterDeep,
        uColorWaterSurface,
        uColorSand,
        uColorGrass,
        uColorSnow,
        uColorRock,
    } = useControls('Terrain', {
        Shape: folder({
            uPositionFrequency: {
                value: terrainUniforms.uPositionFrequency.value,
                min: 0,
                max: 1,
                step: 0.001,
            },
            uStrength: {
                value: terrainUniforms.uStrength.value,
                min: 0,
                max: 10,
                step: 0.001,
            },
            uWarpFrequency: {
                value: terrainUniforms.uWarpFrequency.value,
                min: 0,
                max: 10,
                step: 0.001,
            },
            uWarpStrength: {
                value: terrainUniforms.uWarpStrength.value,
                min: 0,
                max: 1,
                step: 0.001,
            },
        }),
        Colors: folder({
            uColorWaterDeep: {
                value: hex(terrainUniforms.uColorWaterDeep.value),
            },
            uColorWaterSurface: {
                value: hex(terrainUniforms.uColorWaterSurface.value),
            },
            uColorSand: { value: hex(terrainUniforms.uColorSand.value) },
            uColorGrass: { value: hex(terrainUniforms.uColorGrass.value) },
            uColorSnow: { value: hex(terrainUniforms.uColorSnow.value) },
            uColorRock: { value: hex(terrainUniforms.uColorRock.value) },
        }),
    });

    useEffect(() => {
        terrainUniforms.uPositionFrequency.value = uPositionFrequency;
        terrainUniforms.uStrength.value = uStrength;
        terrainUniforms.uWarpFrequency.value = uWarpFrequency;
        terrainUniforms.uWarpStrength.value = uWarpStrength;

        terrainUniforms.uColorWaterDeep.value.set(uColorWaterDeep);
        terrainUniforms.uColorWaterSurface.value.set(uColorWaterSurface);
        terrainUniforms.uColorSand.value.set(uColorSand);
        terrainUniforms.uColorGrass.value.set(uColorGrass);
        terrainUniforms.uColorSnow.value.set(uColorSnow);
        terrainUniforms.uColorRock.value.set(uColorRock);
    }, [
        uPositionFrequency,
        uStrength,
        uWarpFrequency,
        uWarpStrength,
        uColorWaterDeep,
        uColorWaterSurface,
        uColorSand,
        uColorGrass,
        uColorSnow,
        uColorRock,
    ]);
}
