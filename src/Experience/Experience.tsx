// import { OrbitControls } from '@react-three/drei';

import { Terrain } from '../components/Terrain';
import { Player } from '../components/Player';
import { Environment } from './Environment';
import { Grass } from '../components/Grass';
import { WindFarm } from '../components/WindFarm';
import { Cow } from '../components/Cow';
import { WaterSurface } from '../components/WaterSurface';
import { ConstructionSign } from '../components/constructionSign';
import { Bushes } from '../components/Bushes';
import { TreeModel } from '../components/Trees/TreeModel';
import { CHUNK_SIZE, GRID_SIZE_Z } from '../utils/constants';

export function Experience() {
    return (
        <>
            {/*<OrbitControls makeDefault />*/}
            <Environment />

            <TreeModel
                position={[
                    ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 28,
                    0,
                    ((GRID_SIZE_Z - 1) * CHUNK_SIZE) / 2 + 24,
                ]}
            />

            <axesHelper />

            <Terrain />
            <Grass />
            <WaterSurface />
            <Player />
            <Cow />

            <WindFarm />
            <Bushes count={10} />

            {/* tmp */}
            <ConstructionSign />
        </>
    );
}
