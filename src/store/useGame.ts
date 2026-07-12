import * as THREE from 'three';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { CHUNK_SIZE, GRID_SIZE_Z } from '../utils/constants';

interface GameState {
    playerPosition: THREE.Vector3;
}

export default create<GameState>()(
    subscribeWithSelector(() => {
        const center = ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2;
        return {
            playerPosition: new THREE.Vector3(0, 0, center + 10),
        };
    }),
);
