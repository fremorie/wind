import { GRID_TOTAL_WIDTH } from '../../utils/constants';
import { CowModel } from './CowModel';

export function Cow() {
    return (
        <CowModel
            scale={0.8}
            rotation-y={-0.5}
            position={[GRID_TOTAL_WIDTH + 30, 0, GRID_TOTAL_WIDTH / 2 - 10]}
        />
    );
}
