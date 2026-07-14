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

export function Experience() {
    return (
        <>
            <OrbitControls makeDefault />
            <Environment />

            <axesHelper />

            <Player />

            <Terrain />
            <Grass />
            <WaterSurface />
            <Cow />
            <WindFarm />

            <Foliage bushesCount={BUSHES_COUNT} treesCount={TREES_COUNT} />
        </>
    );
}
