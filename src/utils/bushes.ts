import { CHUNK_SIZE, GRID_SIZE_Z } from './constants';

export function getBushesPositions(
    treesPositions: Array<[x: number, y: number, z: number]>,
    treesScales: number[],
    bushCount: number,
) {
    const result: Array<[x: number, y: number, z: number]> = [];

    const treeBranches: Array<[x: number, y: number, z: number]> = [
        [-0.3, 2.8, -1],
        [0.6, 3.2, 0.2],
        [0, 3, 1.5],
        [-0.6, 3.6, -0.3],
        [0, 2.7, 0],
    ];

    for (let i = 0; i < treesPositions.length; i++) {
        const scale = treesScales[i];
        const treePosition = treesPositions[i];

        for (let j = 0; j < treeBranches.length; j++) {
            const position = treeBranches[j].map(
                (coordinate, index) => coordinate * scale + treePosition[index],
            ) as [x: number, y: number, z: number];

            result.push(position);
        }
    }

    const center = ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2;

    for (let i = 0; i < bushCount; i++) {
        const x = center - 20 + i * 10;

        result.push([x, 0, center]);
    }

    return result;
}
