import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/rapier';

import { Terrain, TerrainCollider } from '../components/Terrain';
import { Player } from '../components/Player';
import { BicycleVehicle } from '../components/BicycleVehicle';
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

            <Physics debug={debug} gravity={[0, -24.5, 0]} timeStep={1 / 60}>
                <Environment />

                {debug && <axesHelper />}

                {debug ? <BicycleVehicle /> : <Player />}

                <Terrain />
                <TerrainCollider />

                <Grass />
                <WaterSurface />
                <Cow />
                <WindFarm />
                <TreesV2 count={TREES_V2_COUNT} />

                <Farm />

                <RoadSign />
            </Physics>
        </>
    );
}
