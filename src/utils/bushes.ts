import { alea } from 'seedrandom';

import { CHUNK_SIZE, GRID_SIZE_Z } from './constants';

const BASE_BUSH_SCALE = 2;

export function getBushesAsTreeFoliageAttributes(
    treesPositions: Array<[x: number, y: number, z: number]>,
    treesScales: number[],
) {
    // Seeded separately from getBushesAttributes: a shared seed would make the
    // canopy scales mirror the standalone bush scales value for value.
    const rng = alea('tree-canopy');
    const positions: Array<[x: number, y: number, z: number]> = [];
    const scales: Array<number> = [];

    const treeBranches: Array<[x: number, y: number, z: number]> = [
        [-0.3, 2.8, -1],
        [0.6, 3.2, 0.2],
        [0, 3, 1.5],
        [-0.6, 3.6, -0.3],
    ];

    for (let i = 0; i < treesPositions.length; i++) {
        const scale = treesScales[i];
        const treePosition = treesPositions[i];

        for (let j = 0; j < treeBranches.length; j++) {
            const position = treeBranches[j].map(
                (coordinate, index) => coordinate * scale + treePosition[index],
            ) as [x: number, y: number, z: number];

            positions.push(position);
            scales.push(BASE_BUSH_SCALE + (rng() - 0.5));
        }
    }

    return {
        positions,
        scales,
    };
}

export function getBushesAttributes(count: number) {
    const rng = alea('bushes');
    const positions: Array<[x: number, y: number, z: number]> = [];
    const scales: Array<number> = [];

    const center = ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2;

    for (let i = 0; i < count; i++) {
        const x = center - 20 + i * 10;
        const position: [x: number, y: number, z: number] = [x, 0, center];
        const scale = BASE_BUSH_SCALE + (rng() - 0.5);

        positions.push(position);
        scales.push(scale);
    }

    return {
        positions,
        scales,
    };
}

export function getFoliageAttributes(
    treesPositions: Array<[x: number, y: number, z: number]>,
    treesScales: number[],
    bushCount: number,
) {
    const bushes = getBushesAttributes(bushCount);
    const treeFoliage = getBushesAsTreeFoliageAttributes(
        treesPositions,
        treesScales,
    );

    return {
        positions: [...bushes.positions, ...treeFoliage.positions],
        scales: [...bushes.scales, ...treeFoliage.scales],
    };
}
