import { useControls } from 'leva';

import { LAKE_CENTER, uLakeRadius } from '../../utils/constants';
import { type TreeSpeciesName } from '../../utils/treesV2';

export type ControlledPosition = { x: number; y: number; z: number };

const [LAKE_X, LAKE_Z] = LAKE_CENTER;

// The lake cull in tree/vertex.glsl collapses anything within
// uLakeRadius + uBeachWidth of the centre, so the defaults start out past it.
const RING = 80;

// How far past the shoreline a tree may be dragged.
const REACH = uLakeRadius + 50;

/** Bounds one axis to the shore-plus-REACH band around `centre`. */
const range = (centre: number) => ({
    min: centre - REACH,
    max: centre + REACH,
});

// y is here because the panel asks for all three axes, but it cannot move a
// tree: groundingOffsetY subtracts the instance origin's y, so every tree lands
// on the terrain whatever this says. Only x/z do anything today.
const axes = (x: number, z: number) => ({
    x: { value: x, step: 0.5, ...range(LAKE_X) },
    y: { value: 0, step: 0.1, ...range(0) },
    z: { value: z, step: 0.5, ...range(LAKE_Z) },
});

/** TEMPORARY: drag the lake trees into place, then bake the numbers in. */
export function useLakeTreesControls(): Record<
    TreeSpeciesName,
    ControlledPosition
> {
    const birch = useControls('Lake trees.Birch', axes(LAKE_X + RING, LAKE_Z));
    const maple = useControls('Lake trees.Maple', axes(LAKE_X - RING, LAKE_Z));
    const oak = useControls('Lake trees.Oak', axes(LAKE_X, LAKE_Z + RING));

    return { birch, maple, oak };
}
