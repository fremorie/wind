import { CHUNK_SIZE, GRID_SIZE_Z } from '../../utils/constants';
import { TreeModel } from './TreeModel';

export function Tree() {
    return (
        <>
            <TreeModel
                position={[
                    ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 28,
                    0,
                    ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 44,
                ]}
            />
        </>
    );
}
