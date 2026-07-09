import { useEffect } from 'react';
import { folder, useControls } from 'leva';
import type { Color } from 'three';

import { waterSurfaceUniforms } from '../../materials/waterSurfaceMaterial';

const hex = (color: Color) => `#${color.getHexString()}`;

export function useWaterSurfaceControls() {
    const { uFresnelColor, uFresnelPower, uFresnelStrength } = useControls(
        'Water surface',
        {
            Fresnel: folder({
                uFresnelColor: {
                    value: hex(waterSurfaceUniforms.uFresnelColor.value),
                },
                uFresnelPower: 4.2,
                uFresnelStrength: 0.88,
            }),
        },
    );

    useEffect(() => {
        waterSurfaceUniforms.uFresnelPower.value = uFresnelPower;
        waterSurfaceUniforms.uFresnelStrength.value = uFresnelStrength;

        waterSurfaceUniforms.uFresnelColor.value.set(uFresnelColor);
    }, [uFresnelColor, uFresnelPower, uFresnelStrength]);
}
