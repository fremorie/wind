import * as THREE from 'three';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { CHUNK_SIZE, GRID_SIZE } from '../utils/constants';

interface GameState {
    playerPosition: THREE.Vector3;
}

export default create<GameState>()(
    subscribeWithSelector(() => {
        return {
            playerPosition: new THREE.Vector3(
                CHUNK_SIZE,
                0,
                ((GRID_SIZE - 1) * CHUNK_SIZE) / 2,
            ),
        };
    }),
);
