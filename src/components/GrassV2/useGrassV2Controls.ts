import { useEffect } from 'react';
import { folder, useControls } from 'leva';
import type { Color } from 'three';

import type { GrassV2MaterialImpl } from '../../materials/grassV2Material';

const hex = (color: Color) => `#${color.getHexString()}`;

export function useGrassV2Controls(materials: GrassV2MaterialImpl[]) {
    const [reference] = materials;

    const { uBaseColor, uTipColor, uBaseColor2, uTipColor2 } = useControls(
        'Grass',
        {
            Colors: folder({
                uBaseColor: { value: hex(reference.uBaseColor) },
                uTipColor: { value: hex(reference.uTipColor) },
                uBaseColor2: { value: hex(reference.uBaseColor2) },
                uTipColor2: { value: hex(reference.uTipColor2) },
            }),
        },
    );

    useEffect(() => {
        materials.forEach((material) => {
            material.uBaseColor.set(uBaseColor);
            material.uTipColor.set(uTipColor);
            material.uBaseColor2.set(uBaseColor2);
            material.uTipColor2.set(uTipColor2);
        });
    }, [materials, uBaseColor, uTipColor, uBaseColor2, uTipColor2]);
}
