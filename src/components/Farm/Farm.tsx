import { RigidBody } from '@react-three/rapier';

import { FarmModel } from './FarmModel';
import { FARM_BOUNDS, FARM_WIDTH } from '../../utils/constants';

export function Farm() {
    return (
        <RigidBody
            restitution={0.2}
            friction={0}
            type="fixed"
            colliders="cuboid"
            position={[
                FARM_BOUNDS[0][0],
                0,
                FARM_BOUNDS[0][1] + FARM_WIDTH / 2,
            ]}
        >
            <FarmModel />
        </RigidBody>
    );
}
