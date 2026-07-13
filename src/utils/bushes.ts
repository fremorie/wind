export function getBushesPositions(
    treesPositions: Array<[x: number, y: number, z: number]>,
    treesScales: number[],
) {
    const result: Array<[x: number, y: number, z: number]> = [];

    const treeBranches: Array<[x: number, y: number, z: number]> = [
        [-0.3, 3.2, 1],
        [0.6, 3.6, -0.2],
        [0, 3.6, -1.5],
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

    return result;
}
