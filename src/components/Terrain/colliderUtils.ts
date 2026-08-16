import { getElevation } from '../../utils/elevation';

export const PATCH_SIZE = 16;
export const SUBDIVS = 32;
export const RECENTER_STEP = 4;

export const SAMPLES_PER_AXIS = SUBDIVS + 1;

export function buildHeights(centerX: number, centerZ: number): number[] {
    const heights: number[] = new Array(SAMPLES_PER_AXIS * SAMPLES_PER_AXIS);

    for (let i = 0; i < SAMPLES_PER_AXIS; i++) {
        const worldZ = centerZ + (i / SUBDIVS - 0.5) * PATCH_SIZE;

        for (let j = 0; j < SAMPLES_PER_AXIS; j++) {
            const worldX = centerX + (j / SUBDIVS - 0.5) * PATCH_SIZE;

            heights[j * SAMPLES_PER_AXIS + i] = getElevation(worldX, worldZ);
        }
    }

    return heights;
}

export function cellFor(value: number): number {
    return Math.round(value / RECENTER_STEP);
}
