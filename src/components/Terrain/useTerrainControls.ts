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
        uColorGrass,
        uColorDirt,
        uColorWaterShallow,
        uColorWaterDeep,
    } = useControls('Terrain', {
        Colors: folder({
            uColorGrass: { value: hex(terrainUniforms.uColorGrass.value) },
            uColorDirt: { value: hex(terrainUniforms.uColorDirt.value) },
            uColorWaterShallow: {
                value: hex(terrainUniforms.uColorWaterShallow.value),
            },
            uColorWaterDeep: {
                value: hex(terrainUniforms.uColorWaterDeep.value),
            },
        }),
    });

    useEffect(() => {
        terrainUniforms.uColorDirt.value.set(uColorDirt);
        terrainUniforms.uColorGrass.value.set(uColorGrass);
        terrainUniforms.uColorWaterShallow.value.set(uColorWaterShallow);
        terrainUniforms.uColorWaterDeep.value.set(uColorWaterDeep);
    }, [
        uColorGrass,
        uColorDirt,
        uColorWaterShallow,
        uColorWaterDeep,
    ]);
}
