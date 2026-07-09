import * as THREE from 'three';

import { LAKE_RADIUS } from '../../utils/constants';

export const waterSurfaceGeometry = new THREE.PlaneGeometry(
    LAKE_RADIUS * 2,
    LAKE_RADIUS * 2,
    4,
    4,
);

waterSurfaceGeometry.rotateX(-Math.PI / 2);
