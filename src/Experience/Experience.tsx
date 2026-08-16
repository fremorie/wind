import { OrbitControls } from '@react-three/drei';

import { Terrain } from '../components/Terrain';
import { DebugPlayer, Player } from '../components/Player';
import { Environment } from './Environment';
import { Grass } from '../components/Grass';
import { WindFarm } from '../components/WindFarm';
import { Cow } from '../components/Cow';
import { WaterSurface } from '../components/WaterSurface';
import { TREES_V2_COUNT } from '../utils/constants';
import { useDebug } from '../hooks/useDebug';
import { TreesV2 } from '../components/Foliage/TreesV2';
import { RoadSign } from '../components/RoadSign';
import { Farm } from '../components/Farm';

export function Experience() {
    const debug = useDebug();

    return (
        <>
            <OrbitControls makeDefault />
            <Environment />

            {debug && <axesHelper />}

            {debug ? <DebugPlayer /> : <Player />}

            <Terrain />
            <Grass />
            <WaterSurface />
            <Cow />
            <WindFarm />
            <TreesV2 count={TREES_V2_COUNT} />

            <Farm />

            <RoadSign />
        </>
    );
}
