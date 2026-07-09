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
                uFresnelPower: {
                    value: waterSurfaceUniforms.uFresnelPower.value,
                    min: 0,
                    max: 10,
                    step: 0.001,
                },
                uFresnelStrength: {
                    value: waterSurfaceUniforms.uFresnelStrength.value,
                    min: 0,
                    max: 1,
                    step: 0.001,
                },
            }),
        },
    );

    useEffect(() => {
        waterSurfaceUniforms.uFresnelPower.value = uFresnelPower;
        waterSurfaceUniforms.uFresnelStrength.value = uFresnelStrength;

        waterSurfaceUniforms.uFresnelColor.value.set(uFresnelColor);
    }, [uFresnelColor, uFresnelPower, uFresnelStrength]);
}
