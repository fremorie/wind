import * as THREE from 'three';
import { alea } from 'seedrandom';

import { composeInstanceMatrix, type Instance } from './instances';
import { scatterPositions } from './foliageField';

const BASE_BUSH_SCALE = 2;

// Every quad in createFoliage() faces +Z (rotateZ only spins each plane within
// its own plane), so the blob only reads as foliage when viewed along that axis.
// This yaw turns the quads to face -X, toward the player. Any other yaw catches
// them edge-on and exposes the geometry as a stack of planes, so bushes hold
// this facing regardless of how the tree they belong to is rotated.
const BUSH_FACING_YAW = -Math.PI / 2;

// Branch tips in the tree's own local space, before its transform is applied.
const TREE_BRANCH_ANCHORS: Array<[x: number, y: number, z: number]> = [
    [-0.3, 2.8, -1],
    [0.6, 3.2, 0.2],
    [0, 3, 1.5],
    [-0.6, 3.6, -0.3],
];

export const CANOPY_BUSHES_PER_TREE = TREE_BRANCH_ANCHORS.length;

export function getBushesAsTreeFoliageAttributes(
    trees: Instance[],
): Instance[] {
    const rng = alea('tree-canopy');
    const bushes: Instance[] = [];

    const treeMatrix = new THREE.Matrix4();
    const anchor = new THREE.Vector3();

    for (const tree of trees) {
        composeInstanceMatrix(tree, treeMatrix);

        for (const localAnchor of TREE_BRANCH_ANCHORS) {
            anchor.set(...localAnchor).applyMatrix4(treeMatrix);

            bushes.push({
                position: [anchor.x, anchor.y, anchor.z],
                rotation: BUSH_FACING_YAW,
                scale: BASE_BUSH_SCALE + (rng() - 0.5),
            });
        }
    }

    return bushes;
}

export function getBushesAttributes(count: number): Instance[] {
    const rng = alea('bushes');

    return scatterPositions(count, rng).map(([x, z]) => ({
        position: [x, 0, z],
        rotation: BUSH_FACING_YAW,
        scale: BASE_BUSH_SCALE + (rng() - 0.5),
    }));
}
