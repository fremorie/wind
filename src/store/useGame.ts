import * as THREE from 'three';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { CHUNK_SIZE, GRID_SIZE_Z, SIDE_ROAD_X } from '../utils/constants';

interface GameState {
    playerPosition: THREE.Vector3;
    // Analog stick input, mutated in place every pointer move. x = right,
    // y = forward (already flipped out of screen space). Length is 0..1.
    joystick: THREE.Vector2;
}

export default create<GameState>()(
    subscribeWithSelector(() => {
        const center = ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2;
        return {
            playerPosition: new THREE.Vector3(
                SIDE_ROAD_X - CHUNK_SIZE * 10,
                0,
                center + 20,
            ),
            joystick: new THREE.Vector2(0, 0),
        };
    }),
);
