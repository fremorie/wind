import { Terrain } from '../components/Terrain';
import { Player } from '../components/Player';
import { Environment } from './Environment';

export function Experience() {
    return (
        <>
            <Environment />

            <axesHelper />

            <Terrain />
            <Player />
        </>
    );
}
