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
    const { uPositionFrequency, uStrength, uColorGrass } = useControls(
        'Terrain',
        {
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
            }),
            Colors: folder({
                uColorGrass: { value: hex(terrainUniforms.uColorGrass.value) },
            }),
        },
    );

    useEffect(() => {
        terrainUniforms.uPositionFrequency.value = uPositionFrequency;
        terrainUniforms.uStrength.value = uStrength;

        terrainUniforms.uColorGrass.value.set(uColorGrass);
    }, [uPositionFrequency, uStrength, uColorGrass]);
}
