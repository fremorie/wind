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
        uColorGrass,
        uCurvature,
        uColorDirt,
        uRoadAmplitude,
        uRoadWaviness,
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
            uCurvature: {
                value: terrainUniforms.uCurvature.value,
                min: 0,
                max: 0.1,
                step: 0.0001,
            },
        }),
        Colors: folder({
            uColorGrass: { value: hex(terrainUniforms.uColorGrass.value) },
            uColorDirt: { value: hex(terrainUniforms.uColorDirt.value) },
        }),
        Road: folder({
            uRoadAmplitude: {
                value: terrainUniforms.uRoadAmplitude.value,
                min: 0,
                max: 10,
                step: 0.001,
            },
            uRoadWaviness: {
                value: terrainUniforms.uRoadWaviness.value,
                min: 0,
                max: 10,
                step: 0.001,
            },
        }),
    });

    useEffect(() => {
        terrainUniforms.uPositionFrequency.value = uPositionFrequency;
        terrainUniforms.uStrength.value = uStrength;
        terrainUniforms.uCurvature.value = uCurvature;

        terrainUniforms.uColorDirt.value.set(uColorDirt);
        terrainUniforms.uColorGrass.value.set(uColorGrass);

        terrainUniforms.uRoadAmplitude.value = uRoadAmplitude;
        terrainUniforms.uRoadWaviness.value = uRoadWaviness;
    }, [
        uPositionFrequency,
        uStrength,
        uColorGrass,
        uCurvature,
        uColorDirt,
        uRoadAmplitude,
        uRoadWaviness,
    ]);
}
