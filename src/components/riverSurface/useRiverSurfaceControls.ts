import { useEffect } from 'react';
import { folder, useControls } from 'leva';
import type { Color } from 'three';

import { riverSurfaceMaterial } from '../../materials/riverSurfaceMaterial';

const hex = (color: Color) => `#${color.getHexString()}`;

export function useRiverSurfaceControls() {
    const { uFresnelColor, uFresnelPower, uFresnelStrength, uShadowColor } =
        useControls('River surface', {
            Fresnel: folder({
                uFresnelColor: {
                    value: hex(riverSurfaceMaterial.uFresnelColor),
                },
                uFresnelPower: {
                    value: riverSurfaceMaterial.uFresnelPower,
                    min: 0,
                    max: 10,
                    step: 0.001,
                },
                uFresnelStrength: {
                    value: riverSurfaceMaterial.uFresnelStrength,
                    min: 0,
                    max: 5,
                    step: 0.001,
                },
                uShadowColor: {
                    value: hex(riverSurfaceMaterial.uShadowColor),
                },
            }),
        });

    useEffect(() => {
        riverSurfaceMaterial.uFresnelPower = uFresnelPower;
        riverSurfaceMaterial.uFresnelStrength = uFresnelStrength;

        riverSurfaceMaterial.uFresnelColor.set(uFresnelColor);
        riverSurfaceMaterial.uShadowColor.set(uShadowColor);
    }, [uFresnelColor, uFresnelPower, uFresnelStrength, uShadowColor]);
}
