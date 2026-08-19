import { FarmModel } from './FarmModel';
import { FARM_BOUNDS, FARM_WIDTH } from '../../utils/constants';

export function Farm() {
    return (
        <group
            position={[
                FARM_BOUNDS[0][0],
                0,
                FARM_BOUNDS[0][1] + FARM_WIDTH / 2,
            ]}
        >
            <FarmModel />
        </group>
    );
}
