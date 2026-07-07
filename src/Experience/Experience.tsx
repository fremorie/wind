import { Terrain } from '../components/Terrain';
import { Player } from '../components/Player';
import { Environment } from './Environment';
import { Grass } from '../components/Grass';
import { WindTurbine } from '../components/WindTurbine';
import { GRID_TOTAL_WIDTH } from '../utils/constants';

export function Experience() {
    return (
        <>
            <Environment />

            <axesHelper />

            <Terrain />
            <Grass />
            <Player />

            {/* Left side */}
            <WindTurbine
                position={[GRID_TOTAL_WIDTH, 0, GRID_TOTAL_WIDTH / 2 - 20]}
                scale={3}
            />
            <WindTurbine
                position={[GRID_TOTAL_WIDTH - 30, 0, GRID_TOTAL_WIDTH / 2 - 40]}
                scale={3}
                rotation-y={Math.PI / 2}
            />
            <WindTurbine
                position={[GRID_TOTAL_WIDTH + 30, 0, GRID_TOTAL_WIDTH / 2 - 40]}
                scale={3}
                rotation-y={Math.PI / 3}
            />

            {/* Right side */}
            <WindTurbine
                position={[GRID_TOTAL_WIDTH, 0, GRID_TOTAL_WIDTH / 2 + 20]}
                scale={3}
            />
            <WindTurbine
                position={[GRID_TOTAL_WIDTH - 30, 0, GRID_TOTAL_WIDTH / 2 + 40]}
                scale={3}
            />
            <WindTurbine
                position={[GRID_TOTAL_WIDTH + 30, 0, GRID_TOTAL_WIDTH / 2 + 40]}
                scale={3}
            />
        </>
    );
}
