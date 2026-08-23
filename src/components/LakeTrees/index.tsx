import { alea } from 'seedrandom';

import { TreesV2 } from '../Foliage/TreesV2';
import { TREE_BASE_SCALE } from '../../utils/constants';
import { type Instance } from '../../utils/instances';
import { type TreeSpeciesName } from '../../utils/treesV2';

const rng = alea('lakeTreesRotation');

const TREE_ROTATION = -Math.PI / 2 + rng() * 0.05;

// function toInstance({ x, y, z }: ControlledPosition): Instance {
//     return {
//         position: [x, y, z],
//         rotation: TREE_ROTATION,
//         scale: TREE_BASE_SCALE,
//     };
// }

const POSITIONS = [
    { x: 903, z: 157 },
    { x: 894, z: 103 },
    { x: 884, z: 90 },
    { x: 843, z: 74 },
    { x: 876, z: 196 },
    // Sides of the road
    { x: 907, z: 127 },
    { x: 907, z: 166 },
    { x: 843, z: 208 },
];

const SCALE = TREE_BASE_SCALE * 1.5;

const TREES: Record<TreeSpeciesName, Instance[]> = {
    birch: [
        {
            position: [POSITIONS[0].x, 0, POSITIONS[0].z],
            rotation: TREE_ROTATION,
            scale: SCALE,
        },
        {
            position: [POSITIONS[1].x, 0, POSITIONS[1].z],
            rotation: TREE_ROTATION,
            scale: SCALE,
        },
        {
            position: [POSITIONS[2].x, 0, POSITIONS[2].z],
            rotation: TREE_ROTATION,
            scale: SCALE,
        },
        {
            position: [POSITIONS[7].x, 0, POSITIONS[7].z],
            rotation: TREE_ROTATION,
            scale: SCALE,
        },
        {
            position: [POSITIONS[5].x, 0, POSITIONS[5].z],
            rotation: TREE_ROTATION,
            scale: SCALE,
        },
    ],
    maple: [
        {
            position: [POSITIONS[3].x, 0, POSITIONS[3].z],
            rotation: TREE_ROTATION,
            scale: SCALE,
        },

        {
            position: [POSITIONS[6].x, 0, POSITIONS[6].z],
            rotation: TREE_ROTATION,
            scale: SCALE,
        },
    ],
    oak: [
        {
            position: [POSITIONS[4].x, 0, POSITIONS[4].z],
            rotation: TREE_ROTATION - rng() * 0.2,
            scale: SCALE * 0.8,
        },
    ],
};

export function LakeTrees() {
    // Debug
    // const { birch, maple, oak } = useLakeTreesControls();
    // const treesAttributes: Record<TreeSpeciesName, Instance[]> = useMemo(
    //     () => ({
    //         birch: [toInstance(birch)],
    //         maple: [toInstance(maple)],
    //         oak: [toInstance(oak)],
    //     }),
    //     [birch, maple, oak],
    // );

    return (
        <TreesV2
            count={POSITIONS.length}
            recycle={false}
            treesAttributes={TREES}
        />
    );
}
