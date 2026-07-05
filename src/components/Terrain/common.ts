import * as THREE from 'three';

import { CHUNK_SIZE } from './constants';

export const terrainGeometry = new THREE.PlaneGeometry(
    CHUNK_SIZE,
    CHUNK_SIZE,
    8,
    8,
);

terrainGeometry.rotateX(-Math.PI / 2);
