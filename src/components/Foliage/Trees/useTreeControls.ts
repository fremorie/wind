import { useEffect } from 'react';
import { useControls } from 'leva';

import { treeMaterial } from '../../../materials/treeMaterial';
import { canopyMaterial } from '../../../materials/bushMaterial';

export function useTreeControls() {
    const { color, canopyColor } = useControls('Trees', {
        color: {
            value: `#${treeMaterial.color.getHexString()}`,
        },
        canopyColor: {
            value: `#${canopyMaterial.color.getHexString()}`,
        },
    });

    useEffect(() => {
        treeMaterial.color.set(color);
    }, [color]);

    useEffect(() => {
        canopyMaterial.color.set(canopyColor);
    }, [canopyColor]);
}
