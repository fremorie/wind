import * as THREE from 'three';

import { GRID_TOTAL_WIDTH } from '../../utils/constants';

export const riverSurfaceGeometry = new THREE.PlaneGeometry(
    GRID_TOTAL_WIDTH,
    GRID_TOTAL_WIDTH,
    16,
    16,
);

riverSurfaceGeometry.rotateX(-Math.PI / 2);
