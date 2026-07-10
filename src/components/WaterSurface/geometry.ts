import * as THREE from 'three';

import { LAKE_RADIUS } from '../../utils/constants';

export const waterSurfaceGeometry = new THREE.RingGeometry(
    0,
    LAKE_RADIUS,
    48,
    12,
);

waterSurfaceGeometry.rotateX(-Math.PI / 2);
