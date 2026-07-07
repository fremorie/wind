import { Terrain } from '../components/Terrain';
import { Player } from '../components/Player';
import { Environment } from './Environment';
import { Grass } from '../components/Grass';

export function Experience() {
    return (
        <>
            <Environment />

            <axesHelper />

            <Terrain />
            <Grass />
            <Player />
        </>
    );
}
