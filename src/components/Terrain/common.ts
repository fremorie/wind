import * as THREE from 'three';

import { CHUNK_SIZE } from './constants';

export const terrainGeometry = new THREE.PlaneGeometry(
    CHUNK_SIZE,
    CHUNK_SIZE,
    128,
    128,
);
