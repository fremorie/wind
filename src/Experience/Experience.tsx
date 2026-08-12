import { OrbitControls } from '@react-three/drei';

import { Terrain } from '../components/Terrain';
import { Player } from '../components/Player';
import { Environment } from './Environment';
import { Grass } from '../components/Grass';
import { WindFarm } from '../components/WindFarm';
import { Cow } from '../components/Cow';
import { WaterSurface } from '../components/WaterSurface';
import { Foliage } from '../components/Foliage/Foliage';
import { BUSHES_COUNT, TREES_COUNT } from '../utils/constants';
import { useDebug } from '../hooks/useDebug';
import { Birches } from '../components/Foliage/TreesV2';

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
            <Birches count={3} />

            <Foliage bushesCount={BUSHES_COUNT} treesCount={TREES_COUNT} />
        </>
    );
}
