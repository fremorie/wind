import { useEffect } from 'react';
import { folder, useControls } from 'leva';
import type { Color } from 'three';

import type { GrassV2MaterialImpl } from '../../materials/grassV2Material';

const hex = (color: Color) => `#${color.getHexString()}`;

export function useGrassV2Controls(materials: GrassV2MaterialImpl[]) {
    const [reference] = materials;

    const {
        uBaseColor,
        uTipColor,
        uBaseColor2,
        uTipColor2,
        uHorizonColor,
        uRoadSideColor,
        uTrailPush,
        uTrailFlatten,
    } = useControls('Grass', {
        Colors: folder({
            uBaseColor: { value: hex(reference.uBaseColor) },
            uTipColor: { value: hex(reference.uTipColor) },
            uBaseColor2: { value: hex(reference.uBaseColor2) },
            uTipColor2: { value: hex(reference.uTipColor2) },
            uHorizonColor: { value: hex(reference.uHorizonColor) },
            uRoadSideColor: { value: hex(reference.uRoadSideColor) },
        }),
        Trail: folder({
            uTrailPush: {
                value: reference.uTrailPush,
                min: 0,
                max: 2,
                step: 0.01,
            },
            uTrailFlatten: {
                value: reference.uTrailFlatten,
                min: 0,
                max: 1,
                step: 0.01,
            },
        }),
    });

    useEffect(() => {
        materials.forEach((material) => {
            material.uBaseColor.set(uBaseColor);
            material.uTipColor.set(uTipColor);
            material.uBaseColor2.set(uBaseColor2);
            material.uTipColor2.set(uTipColor2);
            material.uHorizonColor.set(uHorizonColor);
            material.uRoadSideColor.set(uRoadSideColor);
            material.uTrailPush = uTrailPush;
            material.uTrailFlatten = uTrailFlatten;
        });
    }, [
        materials,
        uBaseColor,
        uTipColor,
        uBaseColor2,
        uTipColor2,
        uHorizonColor,
        uRoadSideColor,
        uTrailPush,
        uTrailFlatten,
    ]);
}
