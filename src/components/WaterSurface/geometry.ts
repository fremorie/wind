import * as THREE from 'three';

import { uLakeRadius } from '../../utils/constants';

export const waterSurfaceGeometry = new THREE.RingGeometry(
    0,
    uLakeRadius,
    48,
    12,
);

waterSurfaceGeometry.rotateX(-Math.PI / 2);
