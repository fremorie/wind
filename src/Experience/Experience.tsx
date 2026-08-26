import { Terrain } from '../components/Terrain';
import { Environment } from './Environment';
import { WindFarm } from '../components/WindFarm';
import { WaterSurface } from '../components/WaterSurface';
import { TREES_V2_COUNT } from '../utils/constants';
import { useDebug } from '../hooks/useDebug';
import { TreesV2 } from '../components/Foliage/TreesV2';
import { Player } from '../components/Player';
import { OrbitControls } from '@react-three/drei';
import { GrassFieldV2 } from '../components/GrassV2';
import { LakeTrees } from '../components/LakeTrees';
import { RiverSurface } from '../components/riverSurface';

export function Experience() {
    const debug = useDebug();

    return (
        <>
            {debug && <axesHelper />}

            <Environment />

            <Player />

            <Terrain />

            <RiverSurface />

            <GrassFieldV2 />
            <WaterSurface />
            <WindFarm />
            <TreesV2 count={TREES_V2_COUNT} recycle />
            <LakeTrees />

            {debug && <OrbitControls makeDefault />}
        </>
    );
}
