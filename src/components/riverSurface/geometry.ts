import * as THREE from 'three';

import { GRID_TOTAL_WIDTH } from '../../utils/constants';

export const riverSurfaceGeometry = new THREE.PlaneGeometry(
    GRID_TOTAL_WIDTH * 0.75,
    GRID_TOTAL_WIDTH * 0.75,
    8,
    8,
);

riverSurfaceGeometry.rotateX(-Math.PI / 2);
