import * as THREE from 'three';

import { CHUNK_SIZE } from '../../utils/constants';

export const terrainGeometry = new THREE.PlaneGeometry(
    CHUNK_SIZE,
    CHUNK_SIZE,
    32,
    32,
);

terrainGeometry.rotateX(-Math.PI / 2);
