// import { OrbitControls } from '@react-three/drei';

import { Terrain } from '../components/Terrain';
import { Player } from '../components/Player';
import { Environment } from './Environment';
import { Grass } from '../components/Grass';
import { WindFarm } from '../components/WindFarm';
import { Cow } from '../components/Cow';
import { WaterSurface } from '../components/WaterSurface';
import { Bushes } from '../components/Bushes';
import { Trees } from '../components/Trees';

export function Experience() {
    return (
        <>
            {/*<OrbitControls makeDefault />*/}
            <Environment />

            <Trees count={10} />

            <axesHelper />

            <Terrain />
            <Grass />
            <WaterSurface />
            <Player />
            <Cow />

            <WindFarm />
            <Bushes count={10} />
        </>
    );
}
