import { useEffect } from 'react';
import { useControls } from 'leva';

import { treeMaterial } from '../../../materials/treeMaterial';

export function useTreeControls() {
    const { color } = useControls('Trees', {
        color: {
            value: `#${treeMaterial.color.getHexString()}`,
        },
    });

    useEffect(() => {
        treeMaterial.color.set(color);
    }, [color]);
}
