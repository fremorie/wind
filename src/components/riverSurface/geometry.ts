import * as THREE from 'three';

import { GRID_TOTAL_WIDTH } from '../../utils/constants';

export const riverSurfaceGeometry = new THREE.PlaneGeometry(
    GRID_TOTAL_WIDTH,
    GRID_TOTAL_WIDTH,
    32,
    32,
);

riverSurfaceGeometry.rotateX(-Math.PI / 2);
