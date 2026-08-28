import * as THREE from 'three';
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

import { CHUNK_SIZE, GRID_SIZE_Z, SIDE_ROAD_X } from '../utils/constants';

interface GameState {
    playerPosition: THREE.Vector3;
    // Analog stick input, mutated in place every pointer move. x = right,
    // y = forward (already flipped out of screen space). Length is 0..1.
    joystick: THREE.Vector2;
    hasStarted: boolean;
    isAudioEnabled: boolean;
    hasMoved: boolean;
    hasSprinted: boolean;
    start: (isAudioEnabled: boolean) => void;
    markMoved: () => void;
    markSprinted: () => void;
}

export default create<GameState>()(
    subscribeWithSelector((set, get) => {
        const center = ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2;
        return {
            playerPosition: new THREE.Vector3(
                SIDE_ROAD_X - CHUNK_SIZE * 10,
                0,
                center + 20,
            ),
            joystick: new THREE.Vector2(0, 0),

            hasStarted: false,
            isAudioEnabled: false,
            hasMoved: false,
            hasSprinted: false,
            start: (isAudioEnabled: boolean) =>
                set({ hasStarted: true, isAudioEnabled }),
            markMoved: () => {
                if (get().hasMoved) return;
                set({ hasMoved: true });
            },
            markSprinted: () => {
                if (get().hasSprinted) return;
                set({ hasSprinted: true });
            },
        };
    }),
);
