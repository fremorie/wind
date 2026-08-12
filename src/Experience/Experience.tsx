import { OrbitControls } from '@react-three/drei';

import { Terrain } from '../components/Terrain';
import { Player } from '../components/Player';
import { Environment } from './Environment';
import { Grass } from '../components/Grass';
import { WindFarm } from '../components/WindFarm';
import { Cow } from '../components/Cow';
import { WaterSurface } from '../components/WaterSurface';
import {
    BIRCHES_COUNT,
    MAPLES_COUNT,
    OAKS_COUNT,
} from '../utils/constants';
import { useDebug } from '../hooks/useDebug';
import { TreesV2 } from '../components/Foliage/TreesV2';

export function Experience() {
    const debug = useDebug();

    return (
        <>
            <OrbitControls makeDefault />
            <Environment />

            {debug && <axesHelper />}

            <Player />

            <Terrain />
            <Grass />
            <WaterSurface />
            <Cow />
            <WindFarm />
            <TreesV2
                birchesCount={BIRCHES_COUNT}
                maplesCount={MAPLES_COUNT}
                oaksCount={OAKS_COUNT}
            />
        </>
    );
}
