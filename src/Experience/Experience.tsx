import { Terrain } from '../components/Terrain';
import { Environment } from './Environment';
import { WindFarm } from '../components/WindFarm';
import { Cow } from '../components/Cow';
import { WaterSurface } from '../components/WaterSurface';
import { TREES_V2_COUNT } from '../utils/constants';
import { useDebug } from '../hooks/useDebug';
import { TreesV2 } from '../components/Foliage/TreesV2';
import { RoadSign } from '../components/RoadSign';
import { Farm } from '../components/Farm';
import { Player } from '../components/Player';
import { OrbitControls } from '@react-three/drei';
import { GrassFieldV2 } from '../components/GrassV2';

export function Experience() {
    const debug = useDebug();

    return (
        <>
            {debug && <axesHelper />}

            <Environment />

            <Player />

            <Terrain />

            <GrassFieldV2 />
            <WaterSurface />
            <Cow />
            <WindFarm />
            <TreesV2 count={TREES_V2_COUNT} />

            <Farm />

            <RoadSign />

            {debug && <OrbitControls makeDefault />}
        </>
    );
}
